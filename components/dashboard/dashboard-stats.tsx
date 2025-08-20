"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/shared/icons";
import { Badge } from "@/components/ui/badge";

interface Domain {
  id: string;
  domainName: string;
  provider: string;
  expiresAt: string;
  createdAt: string;
  sslExpiresAt?: string | null;
  sslStatus?: string | null;
}

interface DashboardStatsProps {
  refreshTrigger: number;
}

export function DashboardStats({ refreshTrigger }: DashboardStatsProps) {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDomains();
  }, [refreshTrigger]);

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

  const getDaysUntilExpiry = (expiresAt: string) => {
    const expiryDate = new Date(expiresAt);
    const now = new Date();
    
    expiryDate.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    
    const diffTime = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const stats = {
    totalDomains: domains.length,
    expiringSoon: domains.filter(d => {
      const days = getDaysUntilExpiry(d.expiresAt);
      return days <= 30 && days >= 0;
    }).length,
    expired: domains.filter(d => getDaysUntilExpiry(d.expiresAt) < 0).length,
    sslIssues: domains.filter(d => 
      d.sslStatus === 'error' || 
      (d.sslExpiresAt && getDaysUntilExpiry(d.sslExpiresAt) <= 30)
    ).length,
    providers: Array.from(new Set(domains.map(d => d.provider))).length,
    recentlyAdded: domains.filter(d => {
      const addedDate = new Date(d.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return addedDate > weekAgo;
    }).length,
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    trend, 
    description,
    variant = "default" 
  }: {
    title: string;
    value: number | string;
    icon: any;
    trend?: string;
    description: string;
    variant?: "default" | "warning" | "danger" | "success";
  }) => {
    const getVariantStyles = () => {
      switch (variant) {
        case "warning":
          return "border-orange-200 dark:border-orange-800 bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/50 dark:to-orange-900/30";
        case "danger":
          return "border-red-200 dark:border-red-800 bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/50 dark:to-red-900/30";
        case "success":
          return "border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/50 dark:to-green-900/30";
        default:
          return "border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/50 dark:to-blue-900/30";
      }
    };

    const getIconColor = () => {
      switch (variant) {
        case "warning": return "text-orange-600 dark:text-orange-400";
        case "danger": return "text-red-600 dark:text-red-400";
        case "success": return "text-green-600 dark:text-green-400";
        default: return "text-blue-600 dark:text-blue-400";
      }
    };

    return (
      <Card className={`glass-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${getVariantStyles()}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tight">
                  {loading ? "..." : value}
                </span>
                {trend && (
                  <Badge variant="secondary" className="text-xs">
                    {trend}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
            <div className={`rounded-full bg-white/50 p-3 dark:bg-gray-800/50 ${getIconColor()}`}>
              <Icon className="size-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <StatCard
        title="Total Domains"
        value={stats.totalDomains}
        icon={Icons.home}
        description="Active domains in portfolio"
        variant="success"
      />
      
      <StatCard
        title="Expiring Soon"
        value={stats.expiringSoon}
        icon={Icons.clock}
        description="Domains expiring in 30 days"
        variant={stats.expiringSoon > 0 ? "warning" : "default"}
      />
      
      <StatCard
        title="Expired"
        value={stats.expired}
        icon={Icons.warning}
        description="Domains past expiry date"
        variant={stats.expired > 0 ? "danger" : "default"}
      />
      
      <StatCard
        title="SSL Issues"
        value={stats.sslIssues}
        icon={Icons.shield}
        description="SSL certificates needing attention"
        variant={stats.sslIssues > 0 ? "warning" : "success"}
      />
      
      <StatCard
        title="Providers"
        value={stats.providers}
        icon={Icons.package}
        description="Unique domain registrars"
        variant="default"
      />
      
      <StatCard
        title="Recently Added"
        value={stats.recentlyAdded}
        icon={Icons.add}
        description="Domains added this week"
        variant="success"
        trend={stats.recentlyAdded > 0 ? "+New" : undefined}
      />
    </div>
  );
}
