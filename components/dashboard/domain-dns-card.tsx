"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";
import { toast } from "sonner";

interface Domain {
  id: string;
  domainName: string;
  provider: string;
  expiresAt: string;
  createdAt: string;
  nameservers?: string | null;
}

interface DNSRecord {
  type: string;
  name: string;
  value: string;
  ttl: number;
}

interface DNSData {
  nameservers: string[];
  records: DNSRecord[];
}

interface DomainDNSCardProps {
  domain: Domain;
}

export function DomainDNSCard({ domain }: DomainDNSCardProps) {
  const [dnsData, setDnsData] = useState<DNSData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchDNSData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/domains/dns-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domainName: domain.domainName }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setDnsData(data.dns);
      } else {
        throw new Error("Failed to fetch DNS data");
      }
    } catch (error) {
      console.error("Failed to fetch DNS data:", error);
      toast.error("Failed to fetch DNS information");
      setDnsData({
        nameservers: [],
        records: [],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDNSData();
  }, [domain.domainName]);

  const getRecordTypeColor = (type: string) => {
    const colors: Record<string, "default" | "secondary" | "destructive"> = {
      A: "default",
      AAAA: "default", 
      CNAME: "secondary",
      MX: "destructive",
      TXT: "secondary",
      NS: "default",
    };
    return colors[type] || "secondary";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>DNS & Nameservers</CardTitle>
            <CardDescription>
              DNS records and nameserver information
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchDNSData}
            disabled={loading}
          >
            {loading ? (
              <>
                <Icons.spinner className="mr-2 size-4 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <Icons.refresh className="mr-2 size-4" />
                Refresh
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Nameservers Section */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Icons.shield className="size-5 text-blue-600" />
            Nameservers
          </h3>
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          ) : dnsData?.nameservers && dnsData.nameservers.length > 0 ? (
            <div className="grid gap-2">
              {dnsData.nameservers.map((ns, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                    <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-mono text-sm">{ns}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    NS{index + 1}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Icons.search className="size-12 mx-auto mb-3 opacity-50" />
              <p>No nameservers found</p>
            </div>
          )}
        </div>

        {/* DNS Records Section */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Icons.settings className="size-5 text-green-600" />
            DNS Records
          </h3>
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          ) : dnsData?.records && dnsData.records.length > 0 ? (
            <div className="space-y-3">
              {dnsData.records.map((record, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={getRecordTypeColor(record.type)} className="font-mono">
                        {record.type}
                      </Badge>
                      <span className="font-medium">{record.name || domain.domainName}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">TTL: {record.ttl}s</span>
                  </div>
                  <div className="font-mono text-sm bg-gray-100 p-2 rounded break-all">
                    {record.value}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Icons.search className="size-12 mx-auto mb-3 opacity-50" />
              <p>No DNS records found</p>
            </div>
          )}
        </div>

        {/* DNS Status Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icons.shield className="size-4 text-blue-600" />
            <h4 className="font-medium text-blue-900">DNS Status</h4>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-blue-700 font-medium">Nameservers:</span>
              <span className="ml-2 text-blue-600">
                {loading ? "Checking..." : `${dnsData?.nameservers?.length || 0} configured`}
              </span>
            </div>
            <div>
              <span className="text-blue-700 font-medium">DNS Records:</span>
              <span className="ml-2 text-blue-600">
                {loading ? "Checking..." : `${dnsData?.records?.length || 0} found`}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
