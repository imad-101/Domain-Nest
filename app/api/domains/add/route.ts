import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { z } from "zod";

const addDomainSchema = z.object({
  domainName: z
    .string()
    .min(1, "Domain name is required")
    .regex(/^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/, "Please enter a valid domain name"),
});

async function fetchWhoisData(domainName: string) {
  try {
    // Try the free WHOIS API
    const response = await fetch(`https://api.whois.vu/?q=${domainName}`, {
      headers: {
        'User-Agent': 'DomainManager/1.0',
      },
    });

    if (!response.ok) {
      throw new Error('WHOIS API request failed');
    }

    const data = await response.json();
    console.log('WHOIS API response for', domainName, ':', data);
    
    // Extract registrar and expiry date from WHOIS data
    const registrar = data.registrar || data.registrar_name || 'Unknown';
    
    // Handle different date formats
    let expiryDate: Date | null = null;
    if (data.expires) {
      // If expires is a Unix timestamp (number)
      if (typeof data.expires === 'number') {
        expiryDate = new Date(data.expires * 1000);
      } else {
        // If expires is a string date
        expiryDate = new Date(data.expires);
      }
    } else if (data.registrar_registration_expiration_date) {
      expiryDate = new Date(data.registrar_registration_expiration_date);
    }
    
    // Validate the date
    if (expiryDate && isNaN(expiryDate.getTime())) {
      console.warn('Invalid expiry date for', domainName, '- using fallback');
      expiryDate = null;
    }
    
    return {
      registrar,
      expiryDate: expiryDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now as fallback
    };
  } catch (error) {
    console.error('WHOIS API error:', error);
    
    // Fallback dummy values
    return {
      registrar: 'Unknown Registrar',
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
    };
  }
}

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
    const validatedData = addDomainSchema.parse(body);

    // Check if domain already exists for this user
    const existingDomain = await prisma.domain.findFirst({
      where: {
        userId: user.id,
        domainName: validatedData.domainName,
      },
    });

    if (existingDomain) {
      return NextResponse.json(
        { error: "Domain already exists in your portfolio" },
        { status: 400 }
      );
    }

    // Fetch WHOIS data
    const whoisData = await fetchWhoisData(validatedData.domainName);

    // Check SSL certificate (optional, don't fail if SSL check fails)
    let sslData: any = null;
    try {
      const { checkSSLCertificate } = await import("@/lib/ssl");
      sslData = await checkSSLCertificate(validatedData.domainName);
    } catch (error) {
      console.warn("SSL check failed during domain addition:", error);
    }

    // Save to database
    const domain = await prisma.domain.create({
      data: {
        userId: user.id,
        domainName: validatedData.domainName,
        provider: whoisData.registrar,
        expiresAt: whoisData.expiryDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        sslExpiresAt: sslData?.expiryDate || null,
        sslIssuer: sslData?.issuer || null,
        sslStatus: sslData?.status || 'unknown',
        lastSslCheck: sslData ? new Date() : null,
      },
    });

    return NextResponse.json(
      { 
        message: "Domain added successfully",
        domain: {
          id: domain.id,
          domainName: domain.domainName,
          provider: domain.provider,
          expiresAt: domain.expiresAt,
          createdAt: domain.createdAt,
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error adding domain:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 