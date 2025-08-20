"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/shared/icons";
import { toast } from "sonner";

interface Domain {
  id: string;
  domainName: string;
  provider: string; // This is currently used as registrar
  expiresAt: Date;
  sslStatus: string | null;
  sslExpiresAt: Date | null;
  lastSslCheck: Date | null;
  lastHealthCheck: Date | null;
  createdAt: Date;
}

interface DataRefreshManagerProps {
  onRefreshComplete?: () => void;
}

export function DataRefreshManager({ onRefreshComplete }: DataRefreshManagerProps) {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshingDomain, setRefreshingDomain] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const fetchDomains = async () => {
    try {
      const response = await fetch('/api/domains');
      if (!response.ok) throw new Error('Failed to fetch domains');
      const data = await response.json();
      setDomains(data.domains || []);
    } catch (error) {
      console.error('Error fetching domains:', error);
      toast.error('Failed to fetch domains');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDomains();
  }, []);

  const refreshSingleDomain = async (domainName: string, dataTypes: string[] = ['all']) => {
    setRefreshingDomain(domainName);
    
    try {
      const response = await fetch('/api/domains/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domainName, dataTypes }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(`Refreshed data for ${domainName}`);
        onRefreshComplete?.();
      } else {
        toast.error(`Failed to refresh ${domainName}: ${result.error}`);
      }
    } catch (error) {
      toast.error(`Error refreshing ${domainName}`);
      console.error('Refresh error:', error);
    } finally {
      setRefreshingDomain(null);
    }
  };

  const refreshAllDomains = async () => {
    setIsRefreshing(true);
    
    try {
      const response = await fetch('/api/domains/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshAll: true, dataTypes: ['all'] }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(`Refreshed ${result.refreshedCount} of ${result.totalDomains} domains`);
        setLastRefresh(new Date());
        onRefreshComplete?.();
      } else {
        toast.error(`Refresh failed: ${result.error}`);
      }
    } catch (error) {
      toast.error('Failed to refresh domains');
      console.error('Bulk refresh error:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const runBackgroundJobs = async () => {
    setIsRefreshing(true);
    
    try {
      const response = await fetch('/api/admin/background-jobs', {
        method: 'POST',
      });

      const result = await response.json();

      if (result.success) {
        toast.success(`Background jobs completed: ${result.summary.successful}/${result.summary.total} successful`);
        onRefreshComplete?.();
      } else {
        toast.error(`Background jobs failed: ${result.error}`);
      }
    } catch (error) {
      toast.error('Failed to run background jobs');
      console.error('Background job error:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getDataFreshness = (date: Date | null, thresholdHours: number) => {
    if (!date) return { status: 'never', color: 'destructive' };
    
    const hoursSince = (Date.now() - date.getTime()) / (1000 * 60 * 60);
    
    if (hoursSince < thresholdHours / 2) return { status: 'fresh', color: 'default' };
    if (hoursSince < thresholdHours) return { status: 'aging', color: 'secondary' };
    return { status: 'stale', color: 'destructive' };
  };

  const getSSLStatusColor = (status: string | null) => {
    switch (status) {
      case 'valid': return 'default';
      case 'warning': return 'secondary';
      case 'critical': case 'expired': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Control Panel */}
      <Card className="premium-card luxury-shadow relative overflow-hidden">
        <div className="premium-gradient absolute inset-0 opacity-5"></div>
        <CardHeader className="relative z-10">
          <CardTitle className="premium-text-gradient flex items-center gap-3 text-2xl font-bold">
            <span className="text-3xl">⚡</span>
            Data Refresh Manager
          </CardTitle>
          <CardDescription className="text-base font-medium">
            Manage cached data and trigger updates using the hybrid caching system
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={refreshAllDomains}
              disabled={isRefreshing || isLoading}
              variant="secondary"
              className="premium-hover pulse-glow flex items-center gap-2 shadow-lg"
            >
              {isRefreshing ? (
                <Icons.spinner className="size-4 animate-spin" />
              ) : (
                <Icons.refresh className="size-4" />
              )}
              Refresh All Domains
            </Button>
            
            <Button 
              variant="outline"
              onClick={runBackgroundJobs}
              disabled={isRefreshing || isLoading}
              className="premium-hover flex items-center gap-2 border-2"
            >
              {isRefreshing ? (
                <Icons.spinner className="size-4 animate-spin" />
              ) : (
                <Icons.settings className="size-4" />
              )}
              Run Background Jobs
            </Button>
          </div>
          
          {lastRefresh && (
            <p className="mt-3 text-sm text-muted-foreground">
              Last bulk refresh: {lastRefresh.toLocaleString()}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Domain Status Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {domains.map((domain) => {
          const whoisFreshness = getDataFreshness(domain.createdAt, 24);
          const sslFreshness = getDataFreshness(domain.lastSslCheck, 6);
          const healthFreshness = getDataFreshness(domain.lastHealthCheck, 1);
          
          return (
            <Card key={domain.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{domain.domainName}</CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => refreshSingleDomain(domain.domainName)}
                    disabled={refreshingDomain === domain.domainName}
                    className="size-8 p-0"
                  >
                    {refreshingDomain === domain.domainName ? (
                      <Icons.spinner className="size-4 animate-spin" />
                    ) : (
                      <Icons.refresh className="size-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* WHOIS Data Status */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">WHOIS Data</span>
                  <Badge variant={whoisFreshness.color as any}>
                    {whoisFreshness.status}
                  </Badge>
                </div>
                
                {/* SSL Status */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">SSL Status</span>
                  <div className="flex items-center gap-2">
                    <Badge variant={getSSLStatusColor(domain.sslStatus) as any}>
                      {domain.sslStatus || 'unknown'}
                    </Badge>
                    <Badge variant={sslFreshness.color as any} className="text-xs">
                      {sslFreshness.status}
                    </Badge>
                  </div>
                </div>
                
                {/* Health Check Status */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Health Check</span>
                  <Badge variant={healthFreshness.color as any}>
                    {healthFreshness.status}
                  </Badge>
                </div>
                
                {/* Quick Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => refreshSingleDomain(domain.domainName, ['whois'])}
                    disabled={refreshingDomain === domain.domainName}
                    className="flex-1 text-xs"
                  >
                    WHOIS
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => refreshSingleDomain(domain.domainName, ['ssl'])}
                    disabled={refreshingDomain === domain.domainName}
                    className="flex-1 text-xs"
                  >
                    SSL
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => refreshSingleDomain(domain.domainName, ['uptime'])}
                    disabled={refreshingDomain === domain.domainName}
                    className="flex-1 text-xs"
                  >
                    Uptime
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Data Freshness Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-3">
            <div className="space-y-2">
              <h4 className="font-medium">WHOIS Data</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="default">fresh</Badge>
                  <span>&lt; 12 hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">aging</Badge>
                  <span>12-24 hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">stale</Badge>
                  <span>&gt; 24 hours</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">SSL Status</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="default">fresh</Badge>
                  <span>&lt; 3 hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">aging</Badge>
                  <span>3-6 hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">stale</Badge>
                  <span>&gt; 6 hours</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Health Check</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="default">fresh</Badge>
                  <span>&lt; 30 minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">aging</Badge>
                  <span>30-60 minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">stale</Badge>
                  <span>&gt; 1 hour</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
