import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { 
  updateStaleWhoisData, 
  updateSSLStatuses, 
  performUptimeChecks, 
  updateHealthScores,
  runAllBackgroundJobs 
} from "@/lib/background-jobs";

/**
 * POST /api/admin/background-jobs
 * Manually trigger background jobs (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // For now, allow any authenticated user to trigger jobs
    // In production, you might want to check for admin role
    
    const { searchParams } = new URL(request.url);
    const jobType = searchParams.get('job') || 'all';

    let results;

    switch (jobType) {
      case 'whois':
        results = { whoisResults: await updateStaleWhoisData() };
        break;
      
      case 'ssl':
        results = { sslResults: await updateSSLStatuses() };
        break;
      
      case 'uptime':
        results = { uptimeResults: await performUptimeChecks() };
        break;
      
      case 'health':
        results = { healthResults: await updateHealthScores() };
        break;
      
      case 'all':
      default:
        results = await runAllBackgroundJobs();
        break;
    }

    const totalJobs = Object.values(results).flat().length;
    const successfulJobs = Object.values(results).flat().filter((job: any) => job.success).length;

    return NextResponse.json({
      success: true,
      message: `Background job '${jobType}' completed`,
      jobType,
      summary: {
        total: totalJobs,
        successful: successfulJobs,
        failed: totalJobs - successfulJobs,
      },
      results,
    });

  } catch (error) {
    console.error("Background job error:", error);
    return NextResponse.json(
      { 
        error: "Failed to run background jobs",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/background-jobs/status
 * Get status of domains that need updates
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { prisma } = await import("@/lib/db");

    // Calculate thresholds
    const now = new Date();
    const whoisStaleThreshold = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24h ago
    const sslStaleThreshold = new Date(now.getTime() - 6 * 60 * 60 * 1000);   // 6h ago
    const uptimeStaleThreshold = new Date(now.getTime() - 5 * 60 * 1000);     // 5min ago

    // Count domains needing updates
    const [staleWhoisCount, staleSslCount, needsUptimeCount, totalDomains] = await Promise.all([
      // WHOIS data that's stale
      prisma.domain.count({
        where: {
          OR: [
            { updatedAt: { lt: whoisStaleThreshold } },
            { registrar: null },
          ]
        }
      }),
      
      // SSL data that's stale
      prisma.domain.count({
        where: {
          OR: [
            { lastSslCheck: { lt: sslStaleThreshold } },
            { lastSslCheck: null },
            { sslStatus: null }
          ]
        }
      }),
      
      // Domains that need uptime checks
      prisma.domain.count({
        where: {
          isMonitored: true,
          OR: [
            { lastHealthCheck: { lt: uptimeStaleThreshold } },
            { lastHealthCheck: null }
          ]
        }
      }),
      
      // Total domains
      prisma.domain.count()
    ]);

    // Get recent job activity (from uptime checks as a proxy)
    const recentActivity = await prisma.uptimeCheck.findMany({
      take: 10,
      orderBy: { timestamp: 'desc' },
      include: {
        domain: {
          select: { domainName: true }
        }
      }
    });

    return NextResponse.json({
      success: true,
      status: {
        totalDomains,
        needsUpdate: {
          whois: staleWhoisCount,
          ssl: staleSslCount,
          uptime: needsUptimeCount,
        },
        thresholds: {
          whois: '24 hours',
          ssl: '6 hours',
          uptime: '5 minutes',
        },
        recentActivity: recentActivity.map(check => ({
          domain: check.domain.domainName,
          timestamp: check.timestamp,
          isUp: check.isUp,
          responseTime: check.responseTime,
        })),
      },
    });

  } catch (error) {
    console.error("Background job status error:", error);
    return NextResponse.json(
      { error: "Failed to get background job status" },
      { status: 500 }
    );
  }
}
