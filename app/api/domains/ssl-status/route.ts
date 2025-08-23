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
    const { domainName } = body;

    if (!domainName) {
      return NextResponse.json(
        { error: "Domain name is required" },
        { status: 400 }
      );
    }

    // Verify domain belongs to user
    const domain = await prisma.domain.findFirst({
      where: {
        domainName: domainName,
        userId: user.id,
      },
    });

    if (!domain) {
      return NextResponse.json(
        { error: "Domain not found" },
        { status: 404 }
      );
    }

    // Check SSL certificate in real-time
    try {
      const sslInfo = await checkSSLCertificate(domainName);
      
      // Update only the lastSslCheck timestamp
      await prisma.domain.update({
        where: { id: domain.id },
        data: { 
          lastSslCheck: new Date(),
        }
      });

      return NextResponse.json({
        success: true,
        ssl: {
          status: sslInfo.status,
          issuer: sslInfo.issuer,
          expiresAt: sslInfo.expiryDate,
          isValid: sslInfo.status === 'valid',
          daysUntilExpiry: sslInfo.expiryDate 
            ? Math.ceil((new Date(sslInfo.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
            : null,
        },
        lastChecked: new Date().toISOString(),
      });

    } catch (error) {
      console.error("SSL check failed:", error);
      
      // Still update the lastSslCheck even if check failed
      await prisma.domain.update({
        where: { id: domain.id },
        data: { 
          lastSslCheck: new Date(),
        }
      });

      return NextResponse.json({
        success: false,
        error: "SSL check failed",
        ssl: {
          status: 'error',
          issuer: null,
          expiresAt: null,
          isValid: false,
          daysUntilExpiry: null,
        },
        lastChecked: new Date().toISOString(),
      });
    }

  } catch (error) {
    console.error("SSL status API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Bulk SSL check for multiple domains
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user || !user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { domainNames } = body;

    if (!domainNames || !Array.isArray(domainNames)) {
      return NextResponse.json(
        { error: "Domain names array is required" },
        { status: 400 }
      );
    }

    // Verify all domains belong to user
    const domains = await prisma.domain.findMany({
      where: {
        domainName: { in: domainNames },
        userId: user.id,
      },
    });

    if (domains.length !== domainNames.length) {
      return NextResponse.json(
        { error: "Some domains not found or access denied" },
        { status: 404 }
      );
    }

    const results: Record<string, any> = {};

    // Check SSL for each domain
    for (const domain of domains) {
      try {
        const sslInfo = await checkSSLCertificate(domain.domainName);
        
        // Update lastSslCheck timestamp
        await prisma.domain.update({
          where: { id: domain.id },
          data: { lastSslCheck: new Date() }
        });

        results[domain.domainName] = {
          success: true,
          ssl: {
            status: sslInfo.status,
            issuer: sslInfo.issuer,
            expiresAt: sslInfo.expiryDate,
            isValid: sslInfo.status === 'valid',
            daysUntilExpiry: sslInfo.expiryDate 
              ? Math.ceil((new Date(sslInfo.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
              : null,
          },
          lastChecked: new Date().toISOString(),
        };

      } catch (error) {
        console.error(`SSL check failed for ${domain.domainName}:`, error);
        
        // Still update lastSslCheck even if check failed
        await prisma.domain.update({
          where: { id: domain.id },
          data: { lastSslCheck: new Date() }
        });

        results[domain.domainName] = {
          success: false,
          error: "SSL check failed",
          ssl: {
            status: 'error',
            issuer: null,
            expiresAt: null,
            isValid: false,
            daysUntilExpiry: null,
          },
          lastChecked: new Date().toISOString(),
        };
      }

      // Rate limiting between domains
      if (domains.length > 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return NextResponse.json({
      success: true,
      results,
    });

  } catch (error) {
    console.error("Bulk SSL status API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
