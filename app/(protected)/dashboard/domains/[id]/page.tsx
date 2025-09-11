"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";
import { DomainHealthSkeleton } from "@/components/dashboard/domain-health-skeleton";
import { useRealtimeDomainData } from "@/hooks/use-realtime-domain-data";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

interface Domain {
  id: string;
  domainName: string;
  provider: string;
  expiresAt: string;
  createdAt: string;
  registrar?: string;
}

export default function DomainSettingsPage() {
  const params = useParams();
  const domainId = params.id as string;
  const [domain, setDomain] = useState<Domain | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { healthData, isLoading: healthLoading, error: healthError, refreshData } = useRealtimeDomainData(domainId);

  useEffect(() => {
    const fetchDomain = async () => {
      try {
        const response = await fetch(`/api/domains/${domainId}`);
        if (response.ok) {
          const data = await response.json();
          setDomain(data.domain);
        } else {
          toast.error("Domain not found");
        }
      } catch (error) {
        console.error("Error fetching domain:", error);
        toast.error("Failed to fetch domain data");
      } finally {
        setLoading(false);
      }
    };

    fetchDomain();
  }, [domainId]);

  if (loading) {
    return <DomainHealthSkeleton />;
  }

  if (!domain) {
    return (
      <div className="flex items-center justify-center py-12">
        <p>Domain not found</p>
      </div>
    );
  }

  const getDaysUntilExpiry = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    return Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  const daysUntilExpiry = getDaysUntilExpiry(domain.expiresAt);

  if (healthLoading) {
    return (
      <>
        <DashboardHeader
          heading={`Settings for ${domain.domainName}`}
          text="Manage your domain settings, monitoring, and configuration."
        >
          <Link href="/dashboard">
            <Button variant="outline">
              <Icons.arrowLeft className="mr-2 size-4" />
              Back to Dashboard
            </Button>
          </Link>
        </DashboardHeader>
        <DomainHealthSkeleton />
      </>
    );
  }

  return (
    <>
      <DashboardHeader
        heading={`Settings for ${domain.domainName}`}
        text="Manage your domain settings, monitoring, and configuration."
      >
        <div className="flex gap-2">
          <Button variant="outline" onClick={refreshData} disabled={healthLoading}>
            <Icons.refresh className="mr-2 size-4" />
            Refresh Data
          </Button>
          <Link href="/dashboard">
            <Button variant="outline">
              <Icons.arrowLeft className="mr-2 size-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </DashboardHeader>

      {healthError && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <Icons.alertTriangle className="size-4" />
              <p>Error fetching real-time data: {healthError}</p>
              <Button variant="outline" size="sm" onClick={refreshData}>
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {/* Domain Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Domain Overview</CardTitle>
            <CardDescription>
              Basic information about your domain
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Domain Name</label>
                <p className="text-lg font-semibold">{domain.domainName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Provider</label>
                <p className="text-lg">{domain.provider}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Domain Status</label>
                <Badge variant={daysUntilExpiry > 30 ? "default" : daysUntilExpiry > 7 ? "secondary" : "destructive"}>
                  {daysUntilExpiry < 0 ? "Expired" : `${daysUntilExpiry} days left`}
                </Badge>
              </div>
              {healthData && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Health Score</label>
                  <div className="flex items-center gap-2">
                    <div className="h-2 flex-1 rounded-full bg-muted">
                      <div 
                        className={`h-2 rounded-full ${
                          healthData.healthScore >= 90 ? 'bg-green-500' :
                          healthData.healthScore >= 70 ? 'bg-yellow-500' :
                          healthData.healthScore >= 50 ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${healthData.healthScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{healthData.healthScore}/100</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 gap-4 pt-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Domain Expires</label>
                <p className="text-lg">{new Date(domain.expiresAt).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Added On</label>
                <p className="text-lg">{new Date(domain.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SSL Certificate Information */}
        {healthData?.sslInfo ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icons.shield className="size-5" />
                SSL Certificate
              </CardTitle>
              <CardDescription>
                Real-time SSL certificate status and information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="flex items-center gap-2">
                    {healthData.sslInfo.isValid ? (
                      <Icons.shieldCheck className="size-4 text-green-500" />
                    ) : (
                      <Icons.shieldAlert className="size-4 text-red-500" />
                    )}
                    <Badge variant={healthData.sslInfo.isValid ? "default" : "destructive"}>
                      {healthData.sslInfo.isValid ? "Valid" : "Invalid"}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Issuer</label>
                  <p className="text-sm">{healthData.sslInfo.issuer}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Valid Until</label>
                  <p className="text-sm">{new Date(healthData.sslInfo.validTo).toLocaleDateString()}</p>
                  <p className="text-xs text-muted-foreground">
                    {healthData.sslInfo.daysUntilExpiry} days remaining
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icons.shield className="size-5" />
                SSL Certificate
              </CardTitle>
              <CardDescription>
                SSL certificate information unavailable
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Unable to fetch SSL certificate information</p>
            </CardContent>
          </Card>
        )}

        {/* DNS & Nameservers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icons.globe className="size-5" />
              DNS & Nameservers
            </CardTitle>
            <CardDescription>
              Real-time DNS records and nameserver information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Nameservers */}
            {healthData?.nameservers && healthData.nameservers.length > 0 && (
              <div>
                <h4 className="font-medium mb-3">Nameservers</h4>
                <div className="space-y-2">
                  {healthData.nameservers.map((ns, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Icons.server className="size-4 text-muted-foreground" />
                      <code className="text-sm bg-muted px-2 py-1 rounded">{ns}</code>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* DNS Records */}
            {healthData?.dnsRecords && healthData.dnsRecords.length > 0 && (
              <div>
                <h4 className="font-medium mb-3">DNS Records</h4>
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {healthData.dnsRecords.map((record, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Badge variant="outline">{record.type}</Badge>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{record.name}</TableCell>
                          <TableCell className="font-mono text-sm break-all">{record.value}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance & Uptime */}
        {healthData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icons.activity className="size-5" />
                Performance & Uptime
              </CardTitle>
              <CardDescription>
                Real-time performance metrics and uptime status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Uptime Status */}
                <div>
                  <h4 className="font-medium mb-3">Current Status</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Status</span>
                      <div className="flex items-center gap-2">
                        {healthData.uptime.isUp ? (
                          <Icons.checkCircle className="size-4 text-green-500" />
                        ) : (
                          <Icons.xCircle className="size-4 text-red-500" />
                        )}
                        <Badge variant={healthData.uptime.isUp ? "default" : "destructive"}>
                          {healthData.uptime.isUp ? "Online" : "Offline"}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Response Time</span>
                      <span className="font-mono text-sm">{healthData.uptime.responseTime}ms</span>
                    </div>
                    {healthData.uptime.statusCode && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Status Code</span>
                        <Badge variant={healthData.uptime.statusCode < 400 ? "default" : "destructive"}>
                          {healthData.uptime.statusCode}
                        </Badge>
                      </div>
                    )}
                    {healthData.uptime.errorMessage && (
                      <div>
                        <span className="text-sm text-muted-foreground">Error</span>
                        <p className="text-sm text-red-500">{healthData.uptime.errorMessage}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Performance Metrics */}
                <div>
                  <h4 className="font-medium mb-3">Performance Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Response Time</span>
                      <span className="font-mono text-sm">{healthData.performance.responseTime}ms</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Time to First Byte</span>
                      <span className="font-mono text-sm">{healthData.performance.ttfb}ms</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Domain Lookup</span>
                      <span className="font-mono text-sm">{healthData.performance.domainLookup}ms</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Connect Time</span>
                      <span className="font-mono text-sm">{healthData.performance.connect}ms</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">TLS Handshake</span>
                      <span className="font-mono text-sm">{healthData.performance.tlsHandshake}ms</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common domain management tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={refreshData} disabled={healthLoading}>
                <Icons.refresh className="mr-2 size-4" />
                Refresh All Data
              </Button>
              <Button variant="outline" disabled>
                <Icons.settings className="mr-2 size-4" />
                DNS Management (Coming Soon)
              </Button>
              <Button variant="outline" disabled>
                <Icons.bell className="mr-2 size-4" />
                Set Alerts
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}