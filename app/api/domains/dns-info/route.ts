import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import dns from "dns";
import { promisify } from "util";

const dnsResolve = promisify(dns.resolve);
const dnsResolve4 = promisify(dns.resolve4);
const dnsResolve6 = promisify(dns.resolve6);
const dnsResolveMx = promisify(dns.resolveMx);
const dnsResolveTxt = promisify(dns.resolveTxt);
const dnsResolveCname = promisify(dns.resolveCname);
const dnsResolveNs = promisify(dns.resolveNs);

interface DNSRecord {
  type: string;
  name: string;
  value: string;
  ttl: number;
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { domainName } = await req.json();
    if (!domainName || typeof domainName !== "string") {
      return NextResponse.json({ error: "Domain name is required" }, { status: 400 });
    }

    const dnsData = await fetchDNSData(domainName);
    
    return NextResponse.json({
      success: true,
      dns: dnsData,
    });
  } catch (error) {
    console.error("DNS lookup error:", error);
    return NextResponse.json(
      { error: "Failed to fetch DNS data" },
      { status: 500 }
    );
  }
}

async function fetchDNSData(domain: string) {
  const records: DNSRecord[] = [];
  const nameservers: string[] = [];

  try {
    // Get nameservers
    try {
      const ns = await dnsResolveNs(domain);
      nameservers.push(...ns);
    } catch (error) {
      console.log(`No NS records found for ${domain}`);
    }

    // Get A records
    try {
      const aRecords = await dnsResolve4(domain);
      aRecords.forEach((ip) => {
        records.push({
          type: "A",
          name: domain,
          value: ip,
          ttl: 300, // Default TTL
        });
      });
    } catch (error) {
      console.log(`No A records found for ${domain}`);
    }

    // Get AAAA records
    try {
      const aaaaRecords = await dnsResolve6(domain);
      aaaaRecords.forEach((ip) => {
        records.push({
          type: "AAAA",
          name: domain,
          value: ip,
          ttl: 300,
        });
      });
    } catch (error) {
      console.log(`No AAAA records found for ${domain}`);
    }

    // Get MX records
    try {
      const mxRecords = await dnsResolveMx(domain);
      mxRecords.forEach((mx) => {
        records.push({
          type: "MX",
          name: domain,
          value: `${mx.priority} ${mx.exchange}`,
          ttl: 300,
        });
      });
    } catch (error) {
      console.log(`No MX records found for ${domain}`);
    }

    // Get TXT records
    try {
      const txtRecords = await dnsResolveTxt(domain);
      txtRecords.forEach((txt) => {
        records.push({
          type: "TXT",
          name: domain,
          value: Array.isArray(txt) ? txt.join(" ") : txt,
          ttl: 300,
        });
      });
    } catch (error) {
      console.log(`No TXT records found for ${domain}`);
    }

    // Get CNAME records (for subdomains)
    try {
      const cnameRecords = await dnsResolveCname(`www.${domain}`);
      cnameRecords.forEach((cname) => {
        records.push({
          type: "CNAME",
          name: `www.${domain}`,
          value: cname,
          ttl: 300,
        });
      });
    } catch (error) {
      console.log(`No CNAME records found for www.${domain}`);
    }

  } catch (error) {
    console.error(`DNS lookup failed for ${domain}:`, error);
  }

  return {
    nameservers: nameservers.sort(),
    records: records.sort((a, b) => a.type.localeCompare(b.type)),
  };
}
