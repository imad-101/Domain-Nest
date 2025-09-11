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
  const whoisApis = [
    {
      name: 'whois.vu',
      url: `https://api.whois.vu/?q=${domainName}`,
      headers: { 'User-Agent': 'DomainManager/1.0' } as Record<string, string>,
      timeout: 8000,
      parseResponse: (data: any) => ({
        registrar: data.registrar || data.registrar_name || 'Unknown',
        expiryDate: parseWhoisDate(data.expires || data.registrar_registration_expiration_date),
      })
    },
    {
      name: 'whoisjsonapi',
      url: `https://whoisjsonapi.com/v1/${domainName}`,
      headers: { 'Accept': 'application/json' } as Record<string, string>,
      timeout: 8000,
      parseResponse: (data: any) => ({
        registrar: data.registrar || 'Unknown',
        expiryDate: parseWhoisDate(data.expires_date || data.expiry_date),
      })
    }
  ];

  for (const api of whoisApis) {
    try {
      console.log(`Trying ${api.name} for domain:`, domainName);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), api.timeout);
      
      const response = await fetch(api.url, {
        headers: api.headers,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        console.warn(`${api.name} API returned status:`, response.status);
        continue;
      }

      const data = await response.json();
      console.log(`${api.name} API response for`, domainName, ':', data);
      
      const result = api.parseResponse(data);
      
      if (result.registrar && result.registrar !== 'Unknown') {
        console.log(`Successfully fetched WHOIS data from ${api.name}`);
        return result;
      }
      
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.warn(`${api.name} API timeout for domain:`, domainName);
      } else {
        console.warn(`${api.name} API error:`, error.message);
      }
      continue;
    }
  }
  
  console.log('All WHOIS APIs failed, using fallback values');
  return {
    registrar: 'Unknown Registrar',
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
  };
}

function parseWhoisDate(dateValue: any): Date {
  if (!dateValue) {
    return new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year from now as fallback
  }
  
  let date: Date;
  
  if (typeof dateValue === 'number') {
    // Unix timestamp
    date = new Date(dateValue * 1000);
  } else if (typeof dateValue === 'string') {
    // String date
    date = new Date(dateValue);
  } else {
    // Invalid format
    return new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
  }
  
  // Validate the date
  if (isNaN(date.getTime())) {
    console.warn('Invalid date parsed:', dateValue);
    return new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
  }
  
  return date;
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

    // Save to database (all monitoring data will be fetched in real-time)
    const domain = await prisma.domain.create({
      data: {
        userId: user.id,
        domainName: validatedData.domainName,
        provider: whoisData.registrar,
        expiresAt: whoisData.expiryDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        registrar: whoisData.registrar,
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