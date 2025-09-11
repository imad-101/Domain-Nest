import dns from 'dns';
import { promisify } from 'util';
import https from 'https';
import tls from 'tls';

const resolveDns = promisify(dns.resolve);
const resolveTxt = promisify(dns.resolveTxt);
const resolveMx = promisify(dns.resolveMx);
const resolveCname = promisify(dns.resolveCname);
const resolveNs = promisify(dns.resolveNs);

export interface DnsRecord {
  type: string;
  name: string;
  value: string;
  ttl?: number;
}

export interface SslInfo {
  issuer: string;
  subject: string;
  validFrom: string;
  validTo: string;
  daysUntilExpiry: number;
  isValid: boolean;
}

export interface UptimeCheck {
  isUp: boolean;
  responseTime: number;
  statusCode?: number;
  errorMessage?: string;
  timestamp: Date;
}

export interface PerformanceMetrics {
  responseTime: number;
  ttfb: number;
  domainLookup: number;
  connect: number;
  tlsHandshake: number;
  contentTransfer: number;
  timestamp: Date;
}

export interface DomainHealthData {
  domain: string;
  dnsRecords: DnsRecord[];
  sslInfo: SslInfo | null;
  uptime: UptimeCheck;
  performance: PerformanceMetrics;
  nameservers: string[];
  healthScore: number;
}

export class DomainRealtimeService {
  // Get DNS records for a domain
  static async getDnsRecords(domain: string): Promise<DnsRecord[]> {
    const records: DnsRecord[] = [];

    try {
      // A records
      try {
        const aRecords = await resolveDns(domain, 'A');
        aRecords.forEach(record => {
          records.push({ type: 'A', name: domain, value: record });
        });
      } catch (e) {
        // A records not found
      }

      // AAAA records
      try {
        const aaaaRecords = await resolveDns(domain, 'AAAA');
        aaaaRecords.forEach(record => {
          records.push({ type: 'AAAA', name: domain, value: record });
        });
      } catch (e) {
        // AAAA records not found
      }

      // MX records
      try {
        const mxRecords = await resolveMx(domain);
        mxRecords.forEach(record => {
          records.push({ 
            type: 'MX', 
            name: domain, 
            value: `${record.priority} ${record.exchange}` 
          });
        });
      } catch (e) {
        // MX records not found
      }

      // TXT records
      try {
        const txtRecords = await resolveTxt(domain);
        txtRecords.forEach(record => {
          records.push({ 
            type: 'TXT', 
            name: domain, 
            value: record.join(' ') 
          });
        });
      } catch (e) {
        // TXT records not found
      }

      // CNAME records
      try {
        const cnameRecords = await resolveCname(domain);
        cnameRecords.forEach(record => {
          records.push({ type: 'CNAME', name: domain, value: record });
        });
      } catch (e) {
        // CNAME records not found
      }

      // NS records
      try {
        const nsRecords = await resolveNs(domain);
        nsRecords.forEach(record => {
          records.push({ type: 'NS', name: domain, value: record });
        });
      } catch (e) {
        // NS records not found
      }

    } catch (error) {
      console.error('Error fetching DNS records:', error);
    }

    return records;
  }

  // Get nameservers for a domain
  static async getNameservers(domain: string): Promise<string[]> {
    try {
      const nsRecords = await resolveNs(domain);
      return nsRecords;
    } catch (error) {
      console.error('Error fetching nameservers:', error);
      return [];
    }
  }

  // Get SSL certificate information
  static async getSslInfo(domain: string): Promise<SslInfo | null> {
    return new Promise((resolve) => {
      const options = {
        host: domain,
        port: 443,
        servername: domain,
        rejectUnauthorized: false,
      };

      const socket = tls.connect(options, () => {
        const cert = socket.getPeerCertificate();
        
        if (cert) {
          const validFrom = new Date(cert.valid_from);
          const validTo = new Date(cert.valid_to);
          const now = new Date();
          const daysUntilExpiry = Math.floor((validTo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

          const sslInfo: SslInfo = {
            issuer: cert.issuer.CN || 'Unknown',
            subject: cert.subject.CN || domain,
            validFrom: validFrom.toISOString(),
            validTo: validTo.toISOString(),
            daysUntilExpiry,
            isValid: now >= validFrom && now <= validTo,
          };

          resolve(sslInfo);
        } else {
          resolve(null);
        }
        
        socket.end();
      });

      socket.on('error', () => {
        resolve(null);
      });

      socket.setTimeout(10000, () => {
        socket.destroy();
        resolve(null);
      });
    });
  }

  // Check domain uptime and response time
  static async checkUptime(domain: string): Promise<UptimeCheck> {
    const startTime = Date.now();
    
    return new Promise((resolve) => {
      const url = `https://${domain}`;
      
      const req = https.get(url, (res) => {
        const responseTime = Date.now() - startTime;
        
        resolve({
          isUp: true,
          responseTime,
          statusCode: res.statusCode,
          timestamp: new Date(),
        });
      });

      req.on('error', (error) => {
        const responseTime = Date.now() - startTime;
        
        resolve({
          isUp: false,
          responseTime,
          errorMessage: error.message,
          timestamp: new Date(),
        });
      });

      req.setTimeout(10000, () => {
        req.destroy();
        resolve({
          isUp: false,
          responseTime: 10000,
          errorMessage: 'Request timeout',
          timestamp: new Date(),
        });
      });
    });
  }

  // Get detailed performance metrics
  static async getPerformanceMetrics(domain: string): Promise<PerformanceMetrics> {
    const startTime = Date.now();
    let domainLookupTime = 0;
    let connectTime = 0;
    let tlsHandshakeTime = 0;
    let contentTransferTime = 0;
    let ttfb = 0;

    return new Promise((resolve) => {
      const url = `https://${domain}`;
      
      const req = https.get(url, (res) => {
        const firstByteTime = Date.now();
        ttfb = firstByteTime - startTime;
        
        let dataReceived = false;
        
        res.on('data', () => {
          if (!dataReceived) {
            contentTransferTime = Date.now() - firstByteTime;
            dataReceived = true;
          }
        });

        res.on('end', () => {
          const totalTime = Date.now() - startTime;
          
          resolve({
            responseTime: totalTime,
            ttfb,
            domainLookup: domainLookupTime,
            connect: connectTime,
            tlsHandshake: tlsHandshakeTime,
            contentTransfer: contentTransferTime,
            timestamp: new Date(),
          });
        });
      });

      req.on('lookup', () => {
        domainLookupTime = Date.now() - startTime;
      });

      req.on('connect', () => {
        connectTime = Date.now() - startTime;
      });

      req.on('secureConnect', () => {
        tlsHandshakeTime = Date.now() - startTime;
      });

      req.on('error', () => {
        resolve({
          responseTime: Date.now() - startTime,
          ttfb: 0,
          domainLookup: domainLookupTime,
          connect: connectTime,
          tlsHandshake: tlsHandshakeTime,
          contentTransfer: 0,
          timestamp: new Date(),
        });
      });

      req.setTimeout(10000, () => {
        req.destroy();
        resolve({
          responseTime: 10000,
          ttfb: 0,
          domainLookup: domainLookupTime,
          connect: connectTime,
          tlsHandshake: tlsHandshakeTime,
          contentTransfer: 0,
          timestamp: new Date(),
        });
      });
    });
  }

  // Calculate health score based on various metrics
  static calculateHealthScore(
    uptime: UptimeCheck,
    ssl: SslInfo | null,
    performance: PerformanceMetrics
  ): number {
    let score = 0;

    // Uptime score (40% weight)
    if (uptime.isUp) {
      score += 40;
    }

    // SSL score (30% weight)
    if (ssl?.isValid) {
      if (ssl.daysUntilExpiry > 30) {
        score += 30;
      } else if (ssl.daysUntilExpiry > 7) {
        score += 20;
      } else {
        score += 10;
      }
    }

    // Performance score (30% weight)
    if (performance.responseTime < 1000) {
      score += 30;
    } else if (performance.responseTime < 3000) {
      score += 20;
    } else if (performance.responseTime < 5000) {
      score += 10;
    }

    return Math.round(score);
  }

  // Get complete domain health data
  static async getDomainHealthData(domain: string): Promise<DomainHealthData> {
    const [dnsRecords, nameservers, sslInfo, uptime, performance] = await Promise.all([
      this.getDnsRecords(domain),
      this.getNameservers(domain),
      this.getSslInfo(domain),
      this.checkUptime(domain),
      this.getPerformanceMetrics(domain),
    ]);

    const healthScore = this.calculateHealthScore(uptime, sslInfo, performance);

    return {
      domain,
      dnsRecords,
      sslInfo,
      uptime,
      performance,
      nameservers,
      healthScore,
    };
  }
}
