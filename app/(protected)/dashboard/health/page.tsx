"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Area, AreaChart, CartesianGrid, Line, LineChart, XAxis, YAxis, Bar, BarChart } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import { getHealthScoreColor, getHealthScoreBadgeVariant, getUptimeStatus } from "@/lib/health-monitoring-client";

interface HealthAnalyticsData {
  timeRange: string;
  overallStats: {
    totalDomains: number;
    monitoredDomains: number;
    healthyDomains: number;
    warningDomains: number;
    criticalDomains: number;
    averageUptime: number;
    averageResponseTime: number;
    averageHealthScore: number;
  };
  domains: DomainAnalytics[];
}

interface DomainAnalytics {
  domain: {
    id: string;
    domainName: string;
    provider: string;
    expiresAt: string;
    sslExpiresAt?: string;
    isMonitored: boolean;
    lastHealthCheck?: string;
  };
  metrics: {
    uptimePercentage: number;
    avgResponseTime: number;
    errorRate: number;
    totalChecks: number;
    healthScore: {
      overall: number;
      uptime: number;
      performance: number;
      ssl: number;
      factors: {
        uptimePercentage: number;
        avgResponseTime: number;
        sslValidDays: number;
        errorRate: number;
      };
    };
    sslValidDays: number;
    performancePercentiles: {
      p50: number;
      p95: number;
      p99: number;
    };
  };
  timeSeries: {
    uptime: Array<{
      timestamp: string;
      isUp: boolean;
      responseTime: number;
    }>;
    performance: Array<{
      timestamp: string;
      responseTime: number;
      ttfb: number;
      domainLookup: number;
      connect: number;
      tlsHandshake: number;
      contentTransfer: number;
    }>;
  };
}

export default function HealthDashboardPage() {
  const [data, setData] = useState<HealthAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("24h");
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [checking, setChecking] = useState(false);

  // Chart configurations
  const uptimeChartConfig = {
    uptime: {
      label: "Uptime",
      color: "hsl(var(--chart-1))",
    },
    responseTime: {
      label: "Response Time",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  const performanceChartConfig = {
    responseTime: {
      label: "Total Response Time",
      color: "hsl(var(--chart-1))",
    },
    ttfb: {
      label: "Time to First Byte",
      color: "hsl(var(--chart-2))",
    },
    domainLookup: {
      label: "DNS Lookup",
      color: "hsl(var(--chart-3))",
    },
    connect: {
      label: "Connection",
      color: "hsl(var(--chart-4))",
    },
    tlsHandshake: {
      label: "TLS Handshake",
      color: "hsl(var(--chart-5))",
    },
    contentTransfer: {
      label: "Content Transfer",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  const fetchHealthData = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        timeRange,
        ...(selectedDomain !== "all" && { domainId: selectedDomain })
      });
      
      const response = await fetch(`/api/domains/health-analytics?${params}`);
      if (response.ok) {
        const analyticsData = await response.json();
        setData(analyticsData);
      }
    } catch (error) {
      console.error("Failed to fetch health data:", error);
    } finally {
      setLoading(false);
    }
  }, [timeRange, selectedDomain]);

  useEffect(() => {
    fetchHealthData();
  }, [fetchHealthData]);

  const runHealthCheck = async () => {
    setChecking(true);
    try {
      const response = await fetch("/api/domains/health-check", {
        method: "PUT",
      });
      if (response.ok) {
        await fetchHealthData();
      }
    } catch (error) {
      console.error("Health check failed:", error);
    } finally {
      setChecking(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const getResponseTimeColor = (responseTime: number) => {
    if (responseTime < 500) return "#10b981"; // green
    if (responseTime < 1000) return "#f59e0b"; // yellow
    if (responseTime < 3000) return "#f97316"; // orange
    return "#ef4444"; // red
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Health Dashboard</h1>
            <p className="text-muted-foreground">Monitor domain health and performance metrics</p>
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

  if (!data) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Icons.warning className="mb-4 size-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No Data Available</h3>
            <p className="text-muted-foreground">Unable to load health analytics data.</p>
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
          <h1 className="text-3xl font-bold">Health Dashboard</h1>
          <p className="text-muted-foreground">Monitor domain health and performance metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="6h">Last 6 Hours</SelectItem>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedDomain} onValueChange={setSelectedDomain}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Domains</SelectItem>
              {data.domains.map((domain) => (
                <SelectItem key={domain.domain.id} value={domain.domain.id}>
                  {domain.domain.domainName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={runHealthCheck} disabled={checking}>
            {checking ? (
              <>
                <Icons.spinner className="mr-2 size-4 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <Icons.refresh className="mr-2 size-4" />
                Run Check
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Health</CardTitle>
            <Icons.shield className="size-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getHealthScoreColor(data.overallStats.averageHealthScore)}`}>
              {Math.round(data.overallStats.averageHealthScore)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Average across {data.overallStats.monitoredDomains} domains
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Uptime</CardTitle>
            <Icons.arrowUpRight className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {data.overallStats.averageUptime.toFixed(2)}%
            </div>
            <Progress value={data.overallStats.averageUptime} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Icons.clock className="size-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(data.overallStats.averageResponseTime)}ms
            </div>
            <p className="text-xs text-muted-foreground">
              Across all monitored domains
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Domain Status</CardTitle>
            <Icons.home className="size-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-sm">
                <span className="font-semibold text-green-600">{data.overallStats.healthyDomains}</span> healthy,{" "}
                <span className="font-semibold text-yellow-600">{data.overallStats.warningDomains}</span> warning,{" "}
                <span className="font-semibold text-red-600">{data.overallStats.criticalDomains}</span> critical
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="domains">Domain Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Uptime Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Uptime Trends</CardTitle>
                <CardDescription>Domain availability over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartContainer config={uptimeChartConfig}>
                    <AreaChart
                      accessibilityLayer
                      data={selectedDomain === "all" && data.domains.length > 0 ? 
                        data.domains[0].timeSeries.uptime.map(point => ({
                          ...point,
                          uptime: point.isUp ? 100 : 0,
                          timestamp: formatTimestamp(point.timestamp)
                        })) : 
                        data.domains.find(d => d.domain.id === selectedDomain)?.timeSeries.uptime.map(point => ({
                          ...point,
                          uptime: point.isUp ? 100 : 0,
                          timestamp: formatTimestamp(point.timestamp)
                        })) || []
                      }
                    >
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="timestamp"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                      />
                      <YAxis domain={[0, 100]} />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent />}
                      />
                      <Area
                        dataKey="uptime"
                        type="natural"
                        fill="var(--color-uptime)"
                        fillOpacity={0.4}
                        stroke="var(--color-uptime)"
                        stackId="a"
                      />
                    </AreaChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            {/* Response Time Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Response Time Trends</CardTitle>
                <CardDescription>Performance metrics over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartContainer config={performanceChartConfig}>
                    <LineChart
                      accessibilityLayer
                      data={selectedDomain === "all" && data.domains.length > 0 ? 
                        data.domains[0].timeSeries.performance.map(point => ({
                          ...point,
                          timestamp: formatTimestamp(point.timestamp)
                        })) : 
                        data.domains.find(d => d.domain.id === selectedDomain)?.timeSeries.performance.map(point => ({
                          ...point,
                          timestamp: formatTimestamp(point.timestamp)
                        })) || []
                      }
                    >
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="timestamp"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                      />
                      <YAxis />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent />}
                      />
                      <Line
                        dataKey="responseTime"
                        type="monotone"
                        stroke="var(--color-responseTime)"
                        strokeWidth={2}
                      />
                      <Line
                        dataKey="ttfb"
                        type="monotone"
                        stroke="var(--color-ttfb)"
                        strokeWidth={1}
                      />
                    </LineChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Performance Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Breakdown</CardTitle>
                <CardDescription>Detailed timing metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartContainer config={performanceChartConfig}>
                    <BarChart
                      accessibilityLayer
                      data={selectedDomain === "all" && data.domains.length > 0 ? 
                        data.domains[0].timeSeries.performance.slice(-10).map(point => ({
                          ...point,
                          timestamp: formatTimestamp(point.timestamp)
                        })) : 
                        data.domains.find(d => d.domain.id === selectedDomain)?.timeSeries.performance.slice(-10).map(point => ({
                          ...point,
                          timestamp: formatTimestamp(point.timestamp)
                        })) || []
                      }
                    >
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="timestamp"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                      />
                      <YAxis />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent />}
                      />
                      <Bar dataKey="domainLookup" stackId="a" fill="var(--color-domainLookup)" />
                      <Bar dataKey="connect" stackId="a" fill="var(--color-connect)" />
                      <Bar dataKey="tlsHandshake" stackId="a" fill="var(--color-tlsHandshake)" />
                      <Bar dataKey="ttfb" stackId="a" fill="var(--color-ttfb)" />
                      <Bar dataKey="contentTransfer" stackId="a" fill="var(--color-contentTransfer)" />
                    </BarChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            {/* Performance Percentiles */}
            <Card>
              <CardHeader>
                <CardTitle>Response Time Distribution</CardTitle>
                <CardDescription>Performance percentiles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(selectedDomain === "all" ? data.domains : data.domains.filter(d => d.domain.id === selectedDomain)).map((domain) => (
                  <div key={domain.domain.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{domain.domain.domainName}</span>
                      <Badge variant={getHealthScoreBadgeVariant(domain.metrics.healthScore.overall)}>
                        {domain.metrics.healthScore.overall}% Health
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">P50:</span>
                        <span className="ml-2 font-mono">{domain.metrics.performancePercentiles.p50}ms</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">P95:</span>
                        <span className="ml-2 font-mono">{domain.metrics.performancePercentiles.p95}ms</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">P99:</span>
                        <span className="ml-2 font-mono">{domain.metrics.performancePercentiles.p99}ms</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="domains">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.domains.map((domain) => {
              const uptimeStatus = getUptimeStatus(domain.metrics.uptimePercentage);
              
              return (
                <Card key={domain.domain.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{domain.domain.domainName}</CardTitle>
                        <CardDescription>{domain.domain.provider}</CardDescription>
                      </div>
                      <Badge variant={getHealthScoreBadgeVariant(domain.metrics.healthScore.overall)}>
                        {domain.metrics.healthScore.overall}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Uptime:</span>
                        <div className={`font-semibold ${uptimeStatus.color}`}>
                          {domain.metrics.uptimePercentage.toFixed(2)}%
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Avg Response:</span>
                        <div className="font-mono">
                          {domain.metrics.avgResponseTime}ms
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">SSL Status:</span>
                        <div className={domain.metrics.sslValidDays > 30 ? "text-green-600" : 
                                      domain.metrics.sslValidDays > 7 ? "text-yellow-600" : "text-red-600"}>
                          {domain.metrics.sslValidDays > 0 ? `${domain.metrics.sslValidDays} days` : "Expired"}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Checks:</span>
                        <div>{domain.metrics.totalChecks}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Health Score Breakdown</span>
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span>Uptime:</span>
                          <span>{domain.metrics.healthScore.uptime}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Performance:</span>
                          <span>{domain.metrics.healthScore.performance}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>SSL:</span>
                          <span>{domain.metrics.healthScore.ssl}%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
