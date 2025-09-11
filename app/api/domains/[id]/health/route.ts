import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/session';
import { prisma } from '@/lib/db';
import { DomainRealtimeService } from '@/lib/domain-realtime';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const domain = await prisma.domain.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!domain) {
      return NextResponse.json({ error: 'Domain not found' }, { status: 404 });
    }

    const healthData = await DomainRealtimeService.getDomainHealthData(domain.domainName);

    return NextResponse.json(healthData);
  } catch (error) {
    console.error('Error fetching domain health data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch domain health data' },
      { status: 500 }
    );
  }
}
