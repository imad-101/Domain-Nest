import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { checkSSLCertificate } from "@/lib/ssl";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user || !user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { domainId } = body;

    if (!domainId) {
      return NextResponse.json(
        { error: "Domain ID is required" },
        { status: 400 }
      );
    }

    // Verify domain belongs to user
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

    // Check SSL certificate
    const sslInfo = await checkSSLCertificate(domain.domainName);
    
    // Update domain with SSL information
    await prisma.domain.update({
      where: { id: domainId },
      data: {
        sslExpiresAt: sslInfo.expiryDate,
        sslIssuer: sslInfo.issuer,
        sslStatus: sslInfo.status,
        lastSslCheck: new Date(),
      },
    });

    return NextResponse.json({
      message: "SSL certificate checked successfully",
      ssl: {
        expiryDate: sslInfo.expiryDate,
        issuer: sslInfo.issuer,
        status: sslInfo.status,
        daysUntilExpiry: sslInfo.daysUntilExpiry,
      }
    });

  } catch (error) {
    console.error("Error checking SSL certificate:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Bulk SSL check for all user domains
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user || !user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get all user domains
    const domains = await prisma.domain.findMany({
      where: { userId: user.id },
    });

    const results: Array<{
      domainId: string;
      domainName: string;
      ssl?: any;
      success: boolean;
      error?: string;
    }> = [];

    // Check SSL for each domain
    for (const domain of domains) {
      try {
        const sslInfo = await checkSSLCertificate(domain.domainName);
        
        await prisma.domain.update({
          where: { id: domain.id },
          data: {
            sslExpiresAt: sslInfo.expiryDate,
            sslIssuer: sslInfo.issuer,
            sslStatus: sslInfo.status,
            lastSslCheck: new Date(),
          },
        });

        results.push({
          domainId: domain.id,
          domainName: domain.domainName,
          ssl: sslInfo,
          success: true,
        });
      } catch (error) {
        console.error(`SSL check failed for ${domain.domainName}:`, error);
        results.push({
          domainId: domain.id,
          domainName: domain.domainName,
          success: false,
          error: 'SSL check failed',
        });
      }
    }

    return NextResponse.json({
      message: "Bulk SSL check completed",
      results,
      total: domains.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
    });

  } catch (error) {
    console.error("Error in bulk SSL check:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
