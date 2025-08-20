import { prisma } from "@/lib/db";
import { DomainCache, CACHE_TTL, getCacheKey } from "@/lib/cache";

interface WhoisData {
  registrar: string | null;
  expiresAt: Date | null;
  nameservers: string[];
  status: string[];
}

interface SSLData {
  status: string;
  expiresAt: Date | null;
  issuer: string | null;
  daysUntilExpiry: number;
  isValid: boolean;
}

interface DNSRecord {
  type: string;
  name: string;
  value: string;
  ttl: number;
}

const cache = DomainCache.getInstance();

/**
 * Get WHOIS data with intelligent caching
 */
export async function getWhoisData(domainName: string, userId: string, forceRefresh = false): Promise<WhoisData> {
  const cacheKey = getCacheKey.whois(domainName);
  
  if (forceRefresh) {
    cache.invalidate(cacheKey);
  }

  return cache.get(cacheKey, CACHE_TTL.WHOIS_DATA, async () => {
    console.log(`🔍 Fetching fresh WHOIS data for ${domainName}`);
    
    try {
      // Check database first for recent data
      const domain = await prisma.domain.findUnique({
        where: { userId_domainName: { userId, domainName } },
        select: { registrar: true, expiresAt: true, updatedAt: true }
      });

      const daysSinceUpdate = domain?.updatedAt 
        ? Math.floor((Date.now() - domain.updatedAt.getTime()) / (1000 * 60 * 60 * 24))
        : Infinity;

      // Use DB data if updated within last 3 days
      if (domain && daysSinceUpdate < 3) {
        return {
          registrar: domain.registrar,
          expiresAt: domain.expiresAt,
          nameservers: [],
          status: []
        };
      }

      // Fetch from external API
      const response = await fetch(`https://whois.vu/api/v1/whois/${domainName}`, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`WHOIS API error: ${response.status}`);
      }

      const data = await response.json();
      
      const whoisData: WhoisData = {
        registrar: data.registrar?.name || null,
        expiresAt: data.expires_date ? new Date(data.expires_date) : null,
        nameservers: data.nameservers || [],
        status: data.status || []
      };

      // Update database with fresh data
      if (domain) {
        await prisma.domain.update({
          where: { userId_domainName: { userId, domainName } },
          data: {
            registrar: whoisData.registrar,
            expiresAt: whoisData.expiresAt || domain.expiresAt,
            updatedAt: new Date(),
          }
        });
      }

      return whoisData;
    } catch (error) {
      console.error(`Failed to fetch WHOIS for ${domainName}:`, error);
      
      // Return DB data as fallback if available
      const domain = await prisma.domain.findUnique({
        where: { userId_domainName: { userId, domainName } },
        select: { registrar: true, expiresAt: true }
      });

      if (domain) {
        return {
          registrar: domain.registrar,
          expiresAt: domain.expiresAt,
          nameservers: [],
          status: []
        };
      }

      throw error;
    }
  });
}

/**
 * Get SSL status with intelligent caching
 */
export async function getSSLStatus(domainName: string, forceRefresh = false): Promise<SSLData> {
  const cacheKey = getCacheKey.ssl(domainName);
  
  if (forceRefresh) {
    cache.invalidate(cacheKey);
  }

  return cache.get(cacheKey, CACHE_TTL.SSL_STATUS, async () => {
    console.log(`🔒 Checking SSL certificate for ${domainName}`);
    
    try {
      const tls = await import('tls');
      const { promisify } = await import('util');
      
      return new Promise<SSLData>((resolve, reject) => {
        const options = {
          host: domainName,
          port: 443,
          servername: domainName,
        };

        const socket = tls.connect(options, () => {
          const cert = socket.getPeerCertificate();
          
          if (!cert || Object.keys(cert).length === 0) {
            socket.end();
            reject(new Error('No certificate found'));
            return;
          }

          const now = new Date();
          const expiresAt = new Date(cert.valid_to);
          const daysUntilExpiry = Math.floor((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          
          let status = 'valid';
          if (daysUntilExpiry < 0) status = 'expired';
          else if (daysUntilExpiry < 7) status = 'critical';
          else if (daysUntilExpiry < 30) status = 'warning';

          const sslData: SSLData = {
            status,
            expiresAt,
            issuer: cert.issuer?.CN || null,
            daysUntilExpiry,
            isValid: daysUntilExpiry > 0
          };

          socket.end();
          resolve(sslData);
        });

        socket.on('error', (error) => {
          reject(new Error(`SSL connection failed: ${error.message}`));
        });

        socket.setTimeout(10000, () => {
          socket.destroy();
          reject(new Error('SSL check timeout'));
        });
      });
    } catch (error) {
      console.error(`SSL check failed for ${domainName}:`, error);
      throw error;
    }
  });
}

/**
 * Get DNS records with caching
 */
export async function getDNSRecords(domainName: string, forceRefresh = false): Promise<DNSRecord[]> {
  const cacheKey = getCacheKey.dns(domainName);
  
  if (forceRefresh) {
    cache.invalidate(cacheKey);
  }

  return cache.get(cacheKey, CACHE_TTL.DNS_RECORDS, async () => {
    console.log(`🌐 Fetching DNS records for ${domainName}`);
    
    const dns = await import('dns');
    const { promisify } = await import('util');
    
    const resolve4 = promisify(dns.resolve4);
    const resolveMx = promisify(dns.resolveMx);
    const resolveTxt = promisify(dns.resolveTxt);
    const resolveCname = promisify(dns.resolveCname);

    const records: DNSRecord[] = [];

    try {
      // A Records
      const aRecords = await resolve4(domainName);
      aRecords.forEach(ip => {
        records.push({ type: 'A', name: domainName, value: ip, ttl: 300 });
      });
    } catch (error) {
      console.log(`No A records for ${domainName}`);
    }

    try {
      // MX Records
      const mxRecords = await resolveMx(domainName);
      mxRecords.forEach(mx => {
        records.push({ 
          type: 'MX', 
          name: domainName, 
          value: `${mx.priority} ${mx.exchange}`, 
          ttl: 300 
        });
      });
    } catch (error) {
      console.log(`No MX records for ${domainName}`);
    }

    try {
      // TXT Records
      const txtRecords = await resolveTxt(domainName);
      txtRecords.forEach(txt => {
        records.push({ 
          type: 'TXT', 
          name: domainName, 
          value: txt.join(''), 
          ttl: 300 
        });
      });
    } catch (error) {
      console.log(`No TXT records for ${domainName}`);
    }

    return records;
  });
}

/**
 * Perform uptime check with caching
 */
export async function performUptimeCheck(domainName: string): Promise<{
  isUp: boolean;
  responseTime: number;
  statusCode: number | null;
  timestamp: Date;
}> {
  const cacheKey = getCacheKey.uptime(domainName);
  
  return cache.get(cacheKey, CACHE_TTL.UPTIME_CHECK, async () => {
    console.log(`⚡ Performing uptime check for ${domainName}`);
    
    const startTime = Date.now();
    
    try {
      const response = await fetch(`https://${domainName}`, {
        method: 'HEAD',
        signal: AbortSignal.timeout(15000), // 15 second timeout
      });
      
      const responseTime = Date.now() - startTime;
      
      return {
        isUp: response.ok,
        responseTime,
        statusCode: response.status,
        timestamp: new Date(),
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      return {
        isUp: false,
        responseTime,
        statusCode: null,
        timestamp: new Date(),
      };
    }
  });
}

/**
 * Invalidate all cache for a domain
 */
export function invalidateDomainCache(domainName: string): void {
  cache.invalidate(getCacheKey.whois(domainName));
  cache.invalidate(getCacheKey.ssl(domainName));
  cache.invalidate(getCacheKey.dns(domainName));
  cache.invalidate(getCacheKey.uptime(domainName));
}
