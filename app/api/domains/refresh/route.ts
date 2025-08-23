import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { getWhoisData, performUptimeCheck, invalidateDomainCache } from "@/lib/domain-utils";
import { prisma } from "@/lib/db";
import { z } from "zod";

const refreshSchema = z.object({
  domainName: z.string().min(1).optional(),
  dataTypes: z.array(z.enum(['whois', 'uptime', 'all'])).optional().default(['all']),
  refreshAll: z.boolean().optional().default(false),
});

/**
 * POST /api/domains/refresh
 * Refresh cached data for specific domains or all domains using hybrid caching
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { domainName, dataTypes, refreshAll } = refreshSchema.parse(body);

    let domainsToRefresh;
    
    if (refreshAll || !domainName) {
      // Refresh all user domains
      domainsToRefresh = await prisma.domain.findMany({
        where: { userId: user.id }
      });
    } else {
      // Refresh specific domain
      const domain = await prisma.domain.findUnique({
        where: { userId_domainName: { userId: user.id, domainName } }
      });

      if (!domain) {
        return NextResponse.json({ 
          error: "Domain not found or access denied" 
        }, { status: 404 });
      }

      domainsToRefresh = [domain];
    }

    const results: Record<string, any> = {};
    let refreshedCount = 0;
    const errors: string[] = [];

    for (const domain of domainsToRefresh) {
      const domainResults: Record<string, any> = {};
      const refreshAllData = dataTypes.includes('all');
      let hasError = false;

      // Refresh WHOIS data
      if (refreshAllData || dataTypes.includes('whois')) {
        try {
          const whoisData = await getWhoisData(domain.domainName, user.id, true);
          domainResults.whois = {
            success: true,
            data: whoisData,
            timestamp: new Date().toISOString(),
          };
        } catch (error) {
          domainResults.whois = {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          };
          hasError = true;
          errors.push(`WHOIS refresh failed for ${domain.domainName}`);
        }
      }

      // Refresh uptime data
      if (refreshAllData || dataTypes.includes('uptime')) {
        try {
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
          
          // Update domain health check timestamp
          await prisma.domain.update({
            where: { id: domain.id },
            data: { lastHealthCheck: new Date() }
          });
          
          domainResults.uptime = {
            success: true,
            data: uptimeData,
            timestamp: new Date().toISOString(),
          };
        } catch (error) {
          domainResults.uptime = {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          };
          hasError = true;
          errors.push(`Uptime check failed for ${domain.domainName}`);
        }
      }

      // Invalidate cache for this domain
      invalidateDomainCache(domain.domainName);
      
      if (!hasError) {
        refreshedCount++;
      }

      results[domain.domainName] = domainResults;

      // Rate limiting between domains
      if (domainsToRefresh.length > 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return NextResponse.json({
      success: true,
      message: `Refreshed ${refreshedCount} of ${domainsToRefresh.length} domains`,
      refreshedCount,
      totalDomains: domainsToRefresh.length,
      dataTypes: dataTypes,
      results,
      errors: errors.length > 0 ? errors : undefined,
    });

  } catch (error) {
    console.error("Domain refresh error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: "Invalid request data", 
        details: error.errors 
      }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Failed to refresh domain data" },
      { status: 500 }
    );
  }
}
