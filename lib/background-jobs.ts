/**
 * Background job utilities for Domain Nest
 * Handles scheduled updates for WHOIS data, SSL checks, and uptime monitoring
 */

import { prisma } from "@/lib/db";
import { getWhoisData, getSSLStatus, performUptimeCheck } from "@/lib/domain-utils";

interface JobResult {
  success: boolean;
  message: string;
  domainId?: string;
  error?: string;
}

/**
 * Update WHOIS data for all domains that are stale
 */
export async function updateStaleWhoisData(): Promise<JobResult[]> {
  console.log("🔄 Starting WHOIS update job...");
  
  const staleThreshold = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
  
  const staleDomains = await prisma.domain.findMany({
    where: {
      OR: [
        { updatedAt: { lt: staleThreshold } },
        { registrar: null }
      ]
    },
    include: { user: true }
  });

  console.log(`Found ${staleDomains.length} domains with stale WHOIS data`);
  
  const results: JobResult[] = [];
  
  for (const domain of staleDomains) {
    try {
      console.log(`Updating WHOIS for ${domain.domainName}...`);
      
      await getWhoisData(domain.domainName, domain.userId, true); // Force refresh
      
      results.push({
        success: true,
        message: `WHOIS updated for ${domain.domainName}`,
        domainId: domain.id
      });
      
      // Rate limiting - wait 1 second between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`Failed to update WHOIS for ${domain.domainName}:`, error);
      
      results.push({
        success: false,
        message: `WHOIS update failed for ${domain.domainName}`,
        domainId: domain.id,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
  
  console.log(`WHOIS update job completed. ${results.filter(r => r.success).length}/${results.length} successful`);
  return results;
}

/**
 * Update SSL status for all domains that need checking
 */
export async function updateSSLStatuses(): Promise<JobResult[]> {
  console.log("🔒 Starting SSL update job...");
  
  const staleThreshold = new Date(Date.now() - 6 * 60 * 60 * 1000); // 6 hours ago
  
  const domains = await prisma.domain.findMany({
    where: {
      OR: [
        { lastSslCheck: { lt: staleThreshold } },
        { lastSslCheck: null }
      ]
    }
  });

  console.log(`Found ${domains.length} domains needing SSL check`);
  
  const results: JobResult[] = [];
  
  for (const domain of domains) {
    try {
      console.log(`Checking SSL for ${domain.domainName}...`);
      
      const sslData = await getSSLStatus(domain.domainName, true); // Force refresh
      
      // Update database
      await prisma.domain.update({
        where: { id: domain.id },
        data: {
          lastSslCheck: new Date(),
        }
      });
      
      results.push({
        success: true,
        message: `SSL checked for ${domain.domainName} - Status: ${sslData.status}`,
        domainId: domain.id
      });
      
      // Rate limiting - wait 2 seconds between SSL checks
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error(`Failed to check SSL for ${domain.domainName}:`, error);
      
      // Mark as error in database
      await prisma.domain.update({
        where: { id: domain.id },
        data: {
          lastSslCheck: new Date(),
        }
      });
      
      results.push({
        success: false,
        message: `SSL check failed for ${domain.domainName}`,
        domainId: domain.id,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
  
  console.log(`SSL update job completed. ${results.filter(r => r.success).length}/${results.length} successful`);
  return results;
}

/**
 * Perform uptime checks for all monitored domains
 */
export async function performUptimeChecks(): Promise<JobResult[]> {
  console.log("⚡ Starting uptime check job...");
  
  const monitoredDomains = await prisma.domain.findMany({
    where: { isMonitored: true }
  });

  console.log(`Found ${monitoredDomains.length} domains to monitor`);
  
  const results: JobResult[] = [];
  
  for (const domain of monitoredDomains) {
    try {
      console.log(`Checking uptime for ${domain.domainName}...`);
      
      const uptimeData = await performUptimeCheck(domain.domainName);
      
      // Store uptime check result
      await prisma.uptimeCheck.create({
        data: {
          domainId: domain.id,
          isUp: uptimeData.isUp,
          responseTime: uptimeData.responseTime,
          statusCode: uptimeData.statusCode,
          timestamp: uptimeData.timestamp,
        }
      });
      
      // Update domain with latest uptime data
      await prisma.domain.update({
        where: { id: domain.id },
        data: {
          lastHealthCheck: new Date(),
        }
      });
      
      results.push({
        success: true,
        message: `Uptime checked for ${domain.domainName} - ${uptimeData.isUp ? 'UP' : 'DOWN'} (${uptimeData.responseTime}ms)`,
        domainId: domain.id
      });
      
      // Rate limiting - wait 1 second between checks
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`Failed to check uptime for ${domain.domainName}:`, error);
      
      // Store failed check
      await prisma.uptimeCheck.create({
        data: {
          domainId: domain.id,
          isUp: false,
          responseTime: null,
          statusCode: null,
          timestamp: new Date(),
          errorMessage: error instanceof Error ? error.message : String(error),
        }
      });
      
      results.push({
        success: false,
        message: `Uptime check failed for ${domain.domainName}`,
        domainId: domain.id,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
  
  console.log(`Uptime check job completed. ${results.filter(r => r.success).length}/${results.length} successful`);
  return results;
}

/**
 * Calculate health scores for all domains
 */
export async function updateHealthScores(): Promise<JobResult[]> {
  console.log("📊 Starting health score calculation job...");
  
  const domains = await prisma.domain.findMany({
    include: {
      uptimeChecks: {
        where: {
          timestamp: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
          }
        }
      }
    }
  });

  const results: JobResult[] = [];
  
  for (const domain of domains) {
    try {
      const healthScore = calculateHealthScore(domain);
      
      await prisma.domain.update({
        where: { id: domain.id },
        data: { healthScore }
      });
      
      results.push({
        success: true,
        message: `Health score updated for ${domain.domainName} - Score: ${healthScore.toFixed(1)}`,
        domainId: domain.id
      });
      
    } catch (error) {
      console.error(`Failed to calculate health score for ${domain.domainName}:`, error);
      
      results.push({
        success: false,
        message: `Health score calculation failed for ${domain.domainName}`,
        domainId: domain.id,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
  
  console.log(`Health score job completed. ${results.filter(r => r.success).length}/${results.length} successful`);
  return results;
}

/**
 * Calculate health score for a domain
 */
function calculateHealthScore(domain: any): number {
  let score = 0;
  let totalWeight = 0;
  
  // SSL Health (30% weight) - SSL data is fetched in real-time, not stored
  // This section is skipped as SSL status is not persisted in the database
  
  // Uptime Health (70% weight)
  const uptimeWeight = 70;
  if (domain.uptimeChecks && domain.uptimeChecks.length > 0) {
    const totalChecks = domain.uptimeChecks.length;
    const successfulChecks = domain.uptimeChecks.filter((check: any) => check.isUp).length;
    const uptimePercentage = (successfulChecks / totalChecks) * 100;
    
    score += uptimePercentage * uptimeWeight;
    totalWeight += uptimeWeight;
  }
  
  // Return weighted average, or 50 if no data
  return totalWeight > 0 ? score / totalWeight : 50;
}

/**
 * Run all background jobs
 */
export async function runAllBackgroundJobs(): Promise<{
  whoisResults: JobResult[];
  sslResults: JobResult[];
  uptimeResults: JobResult[];
  healthResults: JobResult[];
}> {
  console.log("🚀 Starting all background jobs...");
  
  const startTime = Date.now();
  
  const [whoisResults, sslResults, uptimeResults, healthResults] = await Promise.allSettled([
    updateStaleWhoisData(),
    updateSSLStatuses(),
    performUptimeChecks(),
    updateHealthScores(),
  ]);
  
  const duration = Date.now() - startTime;
  console.log(`✅ All background jobs completed in ${duration}ms`);
  
  return {
    whoisResults: whoisResults.status === 'fulfilled' ? whoisResults.value : [],
    sslResults: sslResults.status === 'fulfilled' ? sslResults.value : [],
    uptimeResults: uptimeResults.status === 'fulfilled' ? uptimeResults.value : [],
    healthResults: healthResults.status === 'fulfilled' ? healthResults.value : [],
  };
}
