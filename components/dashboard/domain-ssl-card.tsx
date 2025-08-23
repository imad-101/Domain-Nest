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
  lastSslCheck?: string | null;
}

interface SSLData {
  status: string;
  issuer: string | null;
  expiresAt: string | null;
  isValid: boolean;
  daysUntilExpiry: number | null;
}

interface DomainSSLCardProps {
  domain: Domain;
}

export function DomainSSLCard({ domain }: DomainSSLCardProps) {
  const [sslData, setSslData] = useState<SSLData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchSSLData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/domains/ssl-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domainName: domain.domainName }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setSslData(data.ssl);
      } else {
        throw new Error("Failed to fetch SSL data");
      }
    } catch (error) {
      console.error("Failed to fetch SSL data:", error);
      toast.error("Failed to fetch SSL certificate information");
      setSslData({
        status: 'error',
        issuer: null,
        expiresAt: null,
        isValid: false,
        daysUntilExpiry: null,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSSLData();
  }, [domain.domainName]);

  const getSSLStatus = () => {
    if (loading) {
      return { text: "Checking...", color: "secondary" as const };
    }

    if (!sslData || !sslData.isValid || sslData.status === 'error') {
      return { text: "Invalid", color: "destructive" as const };
    }

    if (sslData.daysUntilExpiry !== null) {
      if (sslData.daysUntilExpiry <= 7) {
        return { text: "Critical", color: "destructive" as const };
      } else if (sslData.daysUntilExpiry <= 30) {
        return { text: "Expires Soon", color: "secondary" as const };
      }
    }

    return { text: "Valid", color: "default" as const };
  };

  const sslStatus = getSSLStatus();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>SSL Certificate</CardTitle>
            <CardDescription>
              SSL certificate status and information
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchSSLData}
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
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Status</label>
            <div className="flex items-center gap-2 mt-1">
              {loading ? (
                <Icons.spinner className="size-4 animate-spin" />
              ) : sslData?.isValid ? (
                <Icons.shieldCheck className="size-4 text-green-600" />
              ) : (
                <Icons.shieldAlert className="size-4 text-red-600" />
              )}
              <Badge variant={sslStatus.color} className="px-3 py-1">
                {sslStatus.text}
              </Badge>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Issuer</label>
            <p className="text-sm mt-1">
              {loading ? "Loading..." : sslData?.issuer || "Unknown"}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Expires</label>
            <p className="text-sm mt-1">
              {loading ? "Loading..." : 
               sslData?.expiresAt ? 
                 new Date(sslData.expiresAt).toLocaleDateString('en-US', {
                   month: 'short',
                   day: 'numeric',
                   year: 'numeric'
                 }) : "Unknown"}
            </p>
          </div>

          {sslData?.daysUntilExpiry !== null && sslData?.daysUntilExpiry !== undefined && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Days Until Expiry</label>
              <p className="text-sm mt-1">
                {sslData.daysUntilExpiry > 0 ? `${sslData.daysUntilExpiry} days` : "Expired"}
              </p>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-muted-foreground">Last Checked</label>
            <p className="text-sm mt-1">
              {domain.lastSslCheck 
                ? new Date(domain.lastSslCheck).toLocaleString()
                : "Never"
              }
            </p>
          </div>
        </div>

        {sslData && !sslData.isValid && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-center gap-2">
              <Icons.shieldAlert className="size-4 text-red-600" />
              <p className="text-sm font-medium text-red-800">SSL Certificate Issues</p>
            </div>
            <p className="text-sm text-red-600 mt-1">
              There are issues with this domain&apos;s SSL certificate. This may affect security and user trust.
            </p>
          </div>
        )}

        {sslData && sslData.daysUntilExpiry !== null && sslData.daysUntilExpiry <= 30 && sslData.daysUntilExpiry > 0 && (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <div className="flex items-center gap-2">
              <Icons.warning className="size-4 text-yellow-600" />
              <p className="text-sm font-medium text-yellow-800">SSL Certificate Expiring Soon</p>
            </div>
            <p className="text-sm text-yellow-600 mt-1">
              Your SSL certificate will expire in {sslData.daysUntilExpiry} days. Consider renewing it soon.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
