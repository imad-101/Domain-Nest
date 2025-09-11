import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const domains = await prisma.domain.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        expiresAt: 'asc',
      },
    });

    return NextResponse.json({
      domains: domains.map(domain => ({
        id: domain.id,
        domainName: domain.domainName,
        provider: domain.provider,
        registrar: domain.registrar,
        expiresAt: domain.expiresAt,
        createdAt: domain.createdAt,
        updatedAt: domain.updatedAt,
      })),
    });

  } catch (error) {
    console.error("Error fetching domains:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 