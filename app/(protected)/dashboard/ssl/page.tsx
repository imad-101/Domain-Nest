"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Domain {
  id: string;
  domainName: string;
  provider: string;
  expiresAt: string;
  createdAt: string;
  sslExpiresAt?: string | null;
  sslIssuer?: string | null;
  sslStatus?: string | null;
  lastSslCheck?: string | null;
}

interface SSLStats {
  total: number;
  valid: number;
  warning: number;
  expired: number;
  error: number;
  unknown: number;
}

export default function SSLMonitorPage() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [bulkChecking, setBulkChecking] = useState(false);
  const [stats, setStats] = useState<SSLStats>({
    total: 0,
    valid: 0,
    warning: 0,
    expired: 0,
    error: 0,
    unknown: 0
  });

  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    try {
      const response = await fetch("/api/domains");
      if (response.ok) {
        const data = await response.json();
        setDomains(data.domains || []);
      }
    } catch (error) {
      console.error("Failed to fetch domains:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSSLDaysUntilExpiry = (sslExpiresAt: string | null) => {
    if (!sslExpiresAt) return null;
    const expiryDate = new Date(sslExpiresAt);
    const now = new Date();
    
    expiryDate.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    
    const diffTime = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getSSLStatus = useCallback((domain: Domain) => {
    if (!domain.sslStatus || domain.sslStatus === 'unknown') {
      return { status: "unknown", color: "outline", text: "Not checked", priority: 5 };
    }
    
    if (domain.sslStatus === 'error') {
      return { status: "error", color: "destructive", text: "SSL Error", priority: 4 };
    }

    const daysUntilExpiry = getSSLDaysUntilExpiry(domain.sslExpiresAt || null);
    
    if (daysUntilExpiry === null) {
      return { status: "unknown", color: "outline", text: "No SSL", priority: 5 };
    }
    
    if (daysUntilExpiry < 0) {
      return { status: "expired", color: "destructive", text: "Expired", priority: 1 };
    } else if (daysUntilExpiry <= 7) {
      return { status: "warning", color: "destructive", text: `${daysUntilExpiry} days`, priority: 2 };
    } else if (daysUntilExpiry <= 30) {
      return { status: "warning", color: "secondary", text: `${daysUntilExpiry} days`, priority: 3 };
    } else {
      return { status: "valid", color: "default", text: `${daysUntilExpiry} days`, priority: 6 };
    }
  }, []);

  const calculateStats = useCallback(() => {
    const newStats: SSLStats = {
      total: domains.length,
      valid: 0,
      warning: 0,
      expired: 0,
      error: 0,
      unknown: 0
    };

    domains.forEach(domain => {
      const sslStatus = getSSLStatus(domain);
      switch (sslStatus.status) {
        case 'valid':
          newStats.valid++;
          break;
        case 'warning':
          newStats.warning++;
          break;
        case 'expired':
          newStats.expired++;
          break;
        case 'error':
          newStats.error++;
          break;
        default:
          newStats.unknown++;
      }
    });

    setStats(newStats);
  }, [domains, getSSLStatus]);

  const checkSSL = async (domainId: string) => {
    try {
      const response = await fetch("/api/domains/ssl-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ domainId }),
      });
      
      if (response.ok) {
        await fetchDomains();
      }
    } catch (error) {
      console.error("Error checking SSL:", error);
    }
  };

  const bulkSSLCheck = async () => {
    setBulkChecking(true);
    try {
      const response = await fetch("/api/domains/ssl-check", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (response.ok) {
        await fetchDomains();
      }
    } catch (error) {
      console.error("Error in bulk SSL check:", error);
    } finally {
      setBulkChecking(false);
    }
  };

  const filterDomains = (status: string) => {
    return domains.filter(domain => {
      const sslStatus = getSSLStatus(domain);
      return sslStatus.status === status;
    });
  };

  const getExpiringDomains = () => {
    return domains
      .filter(domain => {
        const sslStatus = getSSLStatus(domain);
        return ['expired', 'warning'].includes(sslStatus.status);
      })
      .sort((a, b) => {
        const statusA = getSSLStatus(a);
        const statusB = getSSLStatus(b);
        return statusA.priority - statusB.priority;
      });
  };

  const getValidPercentage = () => {
    if (stats.total === 0) return 0;
    return Math.round((stats.valid / stats.total) * 100);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">SSL Monitor</h1>
            <p className="text-muted-foreground">Monitor SSL certificate health across your domains</p>
          </div>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Icons.spinner className="size-8 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">SSL Monitor</h1>
          <p className="text-muted-foreground">Monitor SSL certificate health across your domains</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={bulkSSLCheck}
            disabled={bulkChecking}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            {bulkChecking ? (
              <>
                <Icons.spinner className="mr-2 size-4 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <Icons.shield className="mr-2 size-4" />
                Check All SSL
              </>
            )}
          </Button>
        </div>
      </div>

      {/* SSL Health Overview */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valid Certificates</CardTitle>
            <Icons.shield className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.valid}</div>
            <Progress value={getValidPercentage()} className="mt-2" />
            <p className="mt-1 text-xs text-muted-foreground">{getValidPercentage()}% of total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <Icons.warning className="size-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.warning}</div>
            <p className="text-xs text-muted-foreground">Within 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
            <Icons.x className="size-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.expired}</div>
            <p className="text-xs text-muted-foreground">Need immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Not Checked</CardTitle>
            <Icons.help className="size-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unknown + stats.error}</div>
            <p className="text-xs text-muted-foreground">Unknown status</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {getExpiringDomains().length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <Icons.warning className="size-4" />
          <AlertTitle className="text-red-800">SSL Certificates Need Attention</AlertTitle>
          <AlertDescription className="text-red-700">
            {getExpiringDomains().length} domain(s) have SSL certificates that are expired or expiring soon.
          </AlertDescription>
        </Alert>
      )}

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="expiring">
            Expiring ({getExpiringDomains().length})
          </TabsTrigger>
          <TabsTrigger value="all">All Domains</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Recent SSL Checks */}
            <Card>
              <CardHeader>
                <CardTitle>Recent SSL Checks</CardTitle>
                <CardDescription>
                  Latest SSL certificate validations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {domains
                    .filter(d => d.lastSslCheck)
                    .sort((a, b) => new Date(b.lastSslCheck!).getTime() - new Date(a.lastSslCheck!).getTime())
                    .slice(0, 5)
                    .map((domain) => {
                      const sslStatus = getSSLStatus(domain);
                      return (
                        <div key={domain.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{domain.domainName}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(domain.lastSslCheck!).toLocaleString()}
                            </p>
                          </div>
                          <Badge variant={sslStatus.color as any}>
                            {sslStatus.text}
                          </Badge>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>

            {/* SSL Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>SSL Status Distribution</CardTitle>
                <CardDescription>
                  Breakdown of SSL certificate statuses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Valid</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-20 rounded-full bg-gray-200">
                      <div 
                        className="h-2 rounded-full bg-green-500" 
                        style={{ width: `${stats.total > 0 ? (stats.valid / stats.total) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="w-8 text-sm">{stats.valid}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Warning</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-20 rounded-full bg-gray-200">
                      <div 
                        className="h-2 rounded-full bg-orange-500" 
                        style={{ width: `${stats.total > 0 ? (stats.warning / stats.total) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="w-8 text-sm">{stats.warning}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Expired</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-20 rounded-full bg-gray-200">
                      <div 
                        className="h-2 rounded-full bg-red-500" 
                        style={{ width: `${stats.total > 0 ? (stats.expired / stats.total) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="w-8 text-sm">{stats.expired}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Unknown</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-20 rounded-full bg-gray-200">
                      <div 
                        className="h-2 rounded-full bg-gray-500" 
                        style={{ width: `${stats.total > 0 ? ((stats.unknown + stats.error) / stats.total) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="w-8 text-sm">{stats.unknown + stats.error}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="expiring">
          <Card>
            <CardHeader>
              <CardTitle>Expiring SSL Certificates</CardTitle>
              <CardDescription>
                Domains with SSL certificates that need attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              {getExpiringDomains().length === 0 ? (
                <div className="py-8 text-center">
                  <Icons.shield className="mx-auto mb-4 size-12 text-green-500" />
                  <h3 className="mb-2 text-lg font-semibold">All SSL Certificates are Valid</h3>
                  <p className="text-muted-foreground">No certificates are expiring soon.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Domain</TableHead>
                      <TableHead>Issuer</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Check</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getExpiringDomains().map((domain) => {
                      const sslStatus = getSSLStatus(domain);
                      return (
                        <TableRow key={domain.id}>
                          <TableCell className="font-medium">{domain.domainName}</TableCell>
                          <TableCell>{domain.sslIssuer || 'Unknown'}</TableCell>
                          <TableCell>
                            <Badge variant={sslStatus.color as any}>
                              {sslStatus.text}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {domain.lastSslCheck 
                              ? new Date(domain.lastSslCheck).toLocaleDateString()
                              : 'Never'
                            }
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => checkSSL(domain.id)}
                            >
                              <Icons.shield className="mr-1 size-4" />
                              Recheck
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Domains SSL Status</CardTitle>
              <CardDescription>
                Complete overview of SSL certificate status for all domains
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Domain</TableHead>
                    <TableHead>Registrar</TableHead>
                    <TableHead>SSL Issuer</TableHead>
                    <TableHead>SSL Status</TableHead>
                    <TableHead>Last Check</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {domains.map((domain) => {
                    const sslStatus = getSSLStatus(domain);
                    return (
                      <TableRow key={domain.id}>
                        <TableCell className="font-medium">{domain.domainName}</TableCell>
                        <TableCell>{domain.provider}</TableCell>
                        <TableCell>{domain.sslIssuer || 'Unknown'}</TableCell>
                        <TableCell>
                          <Badge variant={sslStatus.color as any}>
                            {sslStatus.text}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {domain.lastSslCheck 
                            ? new Date(domain.lastSslCheck).toLocaleDateString()
                            : 'Never'
                          }
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => checkSSL(domain.id)}
                          >
                            <Icons.shield className="mr-1 size-4" />
                            Check
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
