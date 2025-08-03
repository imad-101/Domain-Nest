import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { calculateHealthScore } from "@/lib/health-monitoring-client";

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
    const timeRange = searchParams.get('timeRange') || '24h';
    const domainId = searchParams.get('domainId');

    // Calculate time range
    let hoursBack = 24;
    switch (timeRange) {
      case '1h': hoursBack = 1; break;
      case '6h': hoursBack = 6; break;
      case '24h': hoursBack = 24; break;
      case '7d': hoursBack = 24 * 7; break;
      case '30d': hoursBack = 24 * 30; break;
    }

    const startTime = new Date(Date.now() - hoursBack * 60 * 60 * 1000);

    // Get domains with optional filter
    const whereClause: any = {
      userId: user.id,
    };
    
    if (domainId) {
      whereClause.id = domainId;
    }

    const domains = await prisma.domain.findMany({
      where: whereClause,
      include: {
        uptimeChecks: {
          where: {
            timestamp: {
              gte: startTime,
            },
          },
          orderBy: {
            timestamp: 'asc',
          },
        },
        performanceMetrics: {
          where: {
            timestamp: {
              gte: startTime,
            },
          },
          orderBy: {
            timestamp: 'asc',
          },
        },
      },
    }) as any; // Type assertion to fix TypeScript errors

    // Calculate analytics for each domain
    const domainAnalytics = domains.map((domain: any) => {
      const uptimeChecks = domain.uptimeChecks || [];
      const performanceMetrics = domain.performanceMetrics || [];

      // Calculate uptime percentage
      const uptimePercentage = uptimeChecks.length > 0 
        ? (uptimeChecks.filter(check => check.isUp).length / uptimeChecks.length) * 100 
        : 0;

      // Calculate average response time
      const avgResponseTime = uptimeChecks.length > 0
        ? uptimeChecks.reduce((sum, check) => sum + (check.responseTime || 0), 0) / uptimeChecks.length
        : 0;

      // Calculate SSL days remaining
      const sslValidDays = domain.sslExpiresAt 
        ? Math.ceil((domain.sslExpiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : 0;

      // Calculate error rate
      const errorRate = uptimeChecks.length > 0
        ? uptimeChecks.filter(check => !check.isUp).length / uptimeChecks.length
        : 0;

      // Calculate health score
      const healthScore = calculateHealthScore(uptimePercentage, avgResponseTime, sslValidDays, errorRate);

      // Prepare time series data for charts
      const uptimeTimeSeries = uptimeChecks.map(check => ({
        timestamp: check.timestamp,
        isUp: check.isUp,
        responseTime: check.responseTime,
      }));

      const performanceTimeSeries = performanceMetrics.map(metric => ({
        timestamp: metric.timestamp,
        responseTime: metric.responseTime,
        ttfb: metric.ttfb,
        domainLookup: metric.domainLookup,
        connect: metric.connect,
        tlsHandshake: metric.tlsHandshake,
        contentTransfer: metric.contentTransfer,
      }));

      // Calculate performance percentiles
      const responseTimes = performanceMetrics.map(m => m.responseTime).sort((a, b) => a - b);
      const p50 = responseTimes[Math.floor(responseTimes.length * 0.5)] || 0;
      const p95 = responseTimes[Math.floor(responseTimes.length * 0.95)] || 0;
      const p99 = responseTimes[Math.floor(responseTimes.length * 0.99)] || 0;

      return {
        domain: {
          id: domain.id,
          domainName: domain.domainName,
          provider: domain.provider,
          expiresAt: domain.expiresAt,
          sslExpiresAt: domain.sslExpiresAt,
          isMonitored: domain.isMonitored ?? true,
          lastHealthCheck: domain.lastHealthCheck ?? null,
        },
        metrics: {
          uptimePercentage,
          avgResponseTime: Math.round(avgResponseTime),
          errorRate,
          totalChecks: uptimeChecks.length,
          healthScore,
          sslValidDays,
          performancePercentiles: {
            p50: Math.round(p50),
            p95: Math.round(p95),
            p99: Math.round(p99),
          },
        },
        timeSeries: {
          uptime: uptimeTimeSeries,
          performance: performanceTimeSeries,
        },
      };
    });

    // Calculate overall statistics
    const totalDomains = domains.length;
    const monitoredDomains = domains.filter((d: any) => d.isMonitored !== false).length;
    const healthyDomains = domainAnalytics.filter(d => d.metrics.healthScore.overall >= 90).length;
    const warningDomains = domainAnalytics.filter(d => 
      d.metrics.healthScore.overall >= 70 && d.metrics.healthScore.overall < 90
    ).length;
    const criticalDomains = domainAnalytics.filter(d => d.metrics.healthScore.overall < 70).length;

    const overallStats = {
      totalDomains,
      monitoredDomains,
      healthyDomains,
      warningDomains,
      criticalDomains,
      averageUptime: domainAnalytics.length > 0 
        ? domainAnalytics.reduce((sum, d) => sum + d.metrics.uptimePercentage, 0) / domainAnalytics.length 
        : 0,
      averageResponseTime: domainAnalytics.length > 0
        ? domainAnalytics.reduce((sum, d) => sum + d.metrics.avgResponseTime, 0) / domainAnalytics.length
        : 0,
      averageHealthScore: domainAnalytics.length > 0
        ? domainAnalytics.reduce((sum, d) => sum + d.metrics.healthScore.overall, 0) / domainAnalytics.length
        : 0,
    };

    return NextResponse.json({
      timeRange,
      overallStats,
      domains: domainAnalytics,
    });

  } catch (error) {
    console.error("Error fetching health analytics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
