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

    const dnsRecords = await DomainRealtimeService.getDnsRecords(domain.domainName);

    return NextResponse.json({ records: dnsRecords });
  } catch (error) {
    console.error('Error fetching DNS records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch DNS records' },
      { status: 500 }
    );
  }
}
