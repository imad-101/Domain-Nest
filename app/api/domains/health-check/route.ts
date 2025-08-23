import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { checkDomainHealth } from "@/lib/health-monitoring";
import { calculateHealthScore } from "@/lib/health-monitoring-client";

// Check health for a specific domain
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user || !user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { domainId } = await request.json();

    // Get the domain
    const domain = await prisma.domain.findFirst({
      where: {
        id: domainId,
        userId: user.id,
      },
    });

    if (!domain) {
      return NextResponse.json(
        { error: "Domain not found" },
        { status: 404 }
      );
    }

    // Perform health check
    const healthResult = await checkDomainHealth(domain.domainName);

    // Store uptime check result
    await prisma.uptimeCheck.create({
      data: {
        domainId: domain.id,
        isUp: healthResult.isUp,
        responseTime: healthResult.responseTime,
        statusCode: healthResult.statusCode,
        errorMessage: healthResult.errorMessage,
      },
    });

    // Store performance metrics if available
    if (healthResult.performanceMetrics) {
      await prisma.performanceMetric.create({
        data: {
          domainId: domain.id,
          responseTime: healthResult.responseTime,
          ttfb: healthResult.performanceMetrics.ttfb,
          domainLookup: healthResult.performanceMetrics.domainLookup,
          connect: healthResult.performanceMetrics.connect,
          tlsHandshake: healthResult.performanceMetrics.tlsHandshake,
          contentTransfer: healthResult.performanceMetrics.contentTransfer,
        },
      });
    }

    // Calculate health score
    const uptimeChecks = await prisma.uptimeCheck.findMany({
      where: {
        domainId: domain.id,
        timestamp: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
    });

    const uptimePercentage = uptimeChecks.length > 0 
      ? (uptimeChecks.filter(check => check.isUp).length / uptimeChecks.length) * 100 
      : 0;

    const avgResponseTime = uptimeChecks.length > 0
      ? uptimeChecks.reduce((sum, check) => sum + (check.responseTime || 0), 0) / uptimeChecks.length
      : healthResult.responseTime;

    const errorRate = uptimeChecks.length > 0
      ? uptimeChecks.filter(check => !check.isUp).length / uptimeChecks.length
      : healthResult.isUp ? 0 : 1;

    const healthScore = calculateHealthScore(uptimePercentage, avgResponseTime, 0, errorRate);

    // Update domain with latest health data
    await prisma.domain.update({
      where: { id: domain.id },
      data: {
        lastUptime: uptimePercentage,
        healthScore: healthScore.overall,
        lastHealthCheck: new Date(),
      },
    });

    return NextResponse.json({
      message: "Health check completed",
      result: healthResult,
      healthScore,
      uptimePercentage,
    });

  } catch (error) {
    console.error("Error in health check:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Bulk health check for all monitored domains
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user || !user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get all monitored domains
    const domains = await prisma.domain.findMany({
      where: {
        userId: user.id,
        isMonitored: true,
      },
    });

    const results: Array<{
      domainId: string;
      domainName: string;
      status: string;
      responseTime?: number;
      healthScore?: number;
      error?: string;
    }> = [];

    for (const domain of domains) {
      try {
        const healthResult = await checkDomainHealth(domain.domainName);

        // Store uptime check
        await prisma.uptimeCheck.create({
          data: {
            domainId: domain.id,
            isUp: healthResult.isUp,
            responseTime: healthResult.responseTime,
            statusCode: healthResult.statusCode,
            errorMessage: healthResult.errorMessage,
          },
        });

        // Store performance metrics
        if (healthResult.performanceMetrics) {
          await prisma.performanceMetric.create({
            data: {
              domainId: domain.id,
              responseTime: healthResult.responseTime,
              ttfb: healthResult.performanceMetrics.ttfb,
              domainLookup: healthResult.performanceMetrics.domainLookup,
              connect: healthResult.performanceMetrics.connect,
              tlsHandshake: healthResult.performanceMetrics.tlsHandshake,
              contentTransfer: healthResult.performanceMetrics.contentTransfer,
            },
          });
        }

        // Calculate and update health score
        const uptimeChecks = await prisma.uptimeCheck.findMany({
          where: {
            domainId: domain.id,
            timestamp: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
            },
          },
        });

        const uptimePercentage = uptimeChecks.length > 0 
          ? (uptimeChecks.filter(check => check.isUp).length / uptimeChecks.length) * 100 
          : 0;

        const avgResponseTime = uptimeChecks.length > 0
          ? uptimeChecks.reduce((sum, check) => sum + (check.responseTime || 0), 0) / uptimeChecks.length
          : healthResult.responseTime;

        const errorRate = uptimeChecks.length > 0
          ? uptimeChecks.filter(check => !check.isUp).length / uptimeChecks.length
          : healthResult.isUp ? 0 : 1;

        const healthScore = calculateHealthScore(uptimePercentage, avgResponseTime, 0, errorRate);

        await prisma.domain.update({
          where: { id: domain.id },
          data: {
            lastUptime: uptimePercentage,
            healthScore: healthScore.overall,
            lastHealthCheck: new Date(),
          },
        });

        results.push({
          domainId: domain.id,
          domainName: domain.domainName,
          status: healthResult.isUp ? 'up' : 'down',
          responseTime: healthResult.responseTime,
          healthScore: healthScore.overall,
        });

      } catch (error) {
        console.error(`Error checking ${domain.domainName}:`, error);
        results.push({
          domainId: domain.id,
          domainName: domain.domainName,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return NextResponse.json({
      message: "Bulk health check completed",
      results,
      totalChecked: domains.length,
    });

  } catch (error) {
    console.error("Error in bulk health check:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
