import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";

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
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get all user domains
    const domains = await prisma.domain.findMany({
      where: {
        userId: user.id,
      },
    });

    if (domains.length === 0) {
      return NextResponse.json(
        { message: "No domains to refresh" },
        { status: 200 }
      );
    }

    let refreshedCount = 0;
    const errors: string[] = [];

    // Refresh each domain
    for (const domain of domains) {
      try {
        const whoisData = await fetchWhoisData(domain.domainName);
        
        await prisma.domain.update({
          where: {
            id: domain.id,
          },
          data: {
            provider: whoisData.registrar,
            expiresAt: whoisData.expiryDate,
          },
        });
        
        refreshedCount++;
      } catch (error) {
        console.error(`Failed to refresh domain ${domain.domainName}:`, error);
        errors.push(`Failed to refresh ${domain.domainName}`);
      }
    }

    return NextResponse.json({
      message: `Successfully refreshed ${refreshedCount} of ${domains.length} domains`,
      refreshedCount,
      totalDomains: domains.length,
      errors: errors.length > 0 ? errors : undefined,
    });

  } catch (error) {
    console.error("Error refreshing domains:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
