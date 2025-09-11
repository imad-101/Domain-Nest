import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { DomainRealtimeService } from "@/lib/domain-realtime";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user || !user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const domainId = searchParams.get('domainId');

    // Get domains with optional filter
    const whereClause: any = {
      userId: user.id,
    };
    
    if (domainId) {
      whereClause.id = domainId;
    }

    const domains = await prisma.domain.findMany({
      where: whereClause,
    });

    // Get real-time health data for each domain
    const domainAnalytics = await Promise.all(
      domains.map(async (domain) => {
        try {
          const healthData = await DomainRealtimeService.getDomainHealthData(domain.domainName);
          
          return {
            domain: {
              id: domain.id,
              domainName: domain.domainName,
              provider: domain.provider,
              registrar: domain.registrar,
              expiresAt: domain.expiresAt,
            },
            metrics: {
              uptimePercentage: healthData.uptime.isUp ? 100 : 0,
              avgResponseTime: healthData.performance.responseTime,
              errorRate: healthData.uptime.isUp ? 0 : 100,
              totalChecks: 1, // Real-time check
              healthScore: {
                overall: healthData.healthScore,
                uptime: healthData.uptime.isUp ? 100 : 0,
                performance: healthData.performance.responseTime < 1000 ? 100 : 
                           healthData.performance.responseTime < 3000 ? 75 : 50,
                ssl: healthData.sslInfo?.isValid ? 100 : 0,
              },
              sslInfo: healthData.sslInfo,
              dnsRecords: healthData.dnsRecords,
              nameservers: healthData.nameservers,
            },
            realtime: healthData,
          };
        } catch (error) {
          console.error(`Error fetching health data for ${domain.domainName}:`, error);
          return {
            domain: {
              id: domain.id,
              domainName: domain.domainName,
              provider: domain.provider,
              registrar: domain.registrar,
              expiresAt: domain.expiresAt,
            },
            metrics: {
              uptimePercentage: 0,
              avgResponseTime: 0,
              errorRate: 100,
              totalChecks: 0,
              healthScore: {
                overall: 0,
                uptime: 0,
                performance: 0,
                ssl: 0,
              },
              sslInfo: null,
              dnsRecords: [],
              nameservers: [],
            },
            realtime: null,
            error: 'Failed to fetch real-time data',
          };
        }
      })
    );

    // Calculate overall statistics
    const totalDomains = domains.length;
    const monitoredDomains = totalDomains; // All domains are monitored in real-time
    const healthyDomains = domainAnalytics.filter(d => d.metrics.healthScore.overall >= 90).length;
    const warningDomains = domainAnalytics.filter(d => 
      d.metrics.healthScore.overall >= 70 && d.metrics.healthScore.overall < 90
    ).length;
    const criticalDomains = domainAnalytics.filter(d => d.metrics.healthScore.overall < 70).length;

    const summary = {
      overview: {
        totalDomains,
        monitoredDomains,
        healthyDomains,
        warningDomains,
        criticalDomains,
        averageHealthScore: domainAnalytics.length > 0
          ? Math.round(domainAnalytics.reduce((sum, d) => sum + d.metrics.healthScore.overall, 0) / domainAnalytics.length)
          : 0,
      },
      domains: domainAnalytics,
    };

    return NextResponse.json(summary);

  } catch (error) {
    console.error("Error in health analytics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
