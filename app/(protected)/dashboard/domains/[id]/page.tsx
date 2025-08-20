import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";
import Link from "next/link";

export const metadata = constructMetadata({
  title: "Domain Settings – Domain Nest",
  description: "Manage individual domain settings and configuration.",
});

interface DomainSettingsPageProps {
  params: {
    id: string;
  };
}

export default async function DomainSettingsPage({ params }: DomainSettingsPageProps) {
  const user = await getCurrentUser();

  if (!user?.id) redirect("/login");

  // Fetch the domain
  const domain = await prisma.domain.findFirst({
    where: {
      id: params.id,
      userId: user.id,
    },
    include: {
      uptimeChecks: {
        orderBy: { timestamp: "desc" },
        take: 5,
      },
      performanceMetrics: {
        orderBy: { timestamp: "desc" },
        take: 5,
      },
    },
  });

  if (!domain) {
    redirect("/dashboard");
  }

  const getDaysUntilExpiry = (expiresAt: Date | string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    return Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getSSLStatus = () => {
    if (!domain.sslStatus) return { text: "Unknown", color: "secondary" };
    
    if (domain.sslStatus === "valid") {
      const sslDays = domain.sslExpiresAt ? getDaysUntilExpiry(domain.sslExpiresAt) : 0;
      if (sslDays > 30) return { text: "Valid", color: "default" };
      if (sslDays > 7) return { text: "Expires Soon", color: "secondary" };
      return { text: "Critical", color: "destructive" };
    }
    
    return { text: "Invalid", color: "destructive" };
  };

  const daysUntilExpiry = getDaysUntilExpiry(domain.expiresAt);
  const sslStatus = getSSLStatus();

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
              <div>
                <label className="text-sm font-medium text-muted-foreground">SSL Status</label>
                <Badge variant={sslStatus.color as "default" | "secondary" | "destructive"}>
                  {sslStatus.text}
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4 pt-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Domain Expires</label>
                <p className="text-lg">{new Date(domain.expiresAt).toLocaleDateString()}</p>
              </div>
              {domain.sslExpiresAt && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">SSL Expires</label>
                  <p className="text-lg">{new Date(domain.sslExpiresAt).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Monitoring Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Monitoring Settings</CardTitle>
            <CardDescription>
              Configure monitoring and alerts for this domain
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Health Monitoring</h4>
                <p className="text-sm text-muted-foreground">
                  Monitor domain uptime and performance
                </p>
              </div>
              <Badge variant={domain.isMonitored ? "default" : "secondary"}>
                {domain.isMonitored ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            
            {domain.lastHealthCheck && (
              <div>
                <h4 className="font-medium">Last Health Check</h4>
                <p className="text-sm text-muted-foreground">
                  {new Date(domain.lastHealthCheck).toLocaleString()}
                </p>
              </div>
            )}

            {domain.healthScore && (
              <div>
                <h4 className="font-medium">Health Score</h4>
                <div className="flex items-center gap-2">
                  <div className="h-2 flex-1 rounded-full bg-muted">
                    <div 
                      className={`h-2 rounded-full ${
                        domain.healthScore >= 90 ? 'bg-green-500' :
                        domain.healthScore >= 70 ? 'bg-yellow-500' :
                        domain.healthScore >= 50 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${domain.healthScore}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{Math.round(domain.healthScore)}/100</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

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
              <Link href={`/dashboard/ssl?domain=${domain.domainName}`}>
                <Button variant="outline">
                  <Icons.shield className="mr-2 size-4" />
                  SSL Certificate
                </Button>
              </Link>
              <Link href={`/dashboard/health?domain=${domain.domainName}`}>
                <Button variant="outline">
                  <Icons.clock className="mr-2 size-4" />
                  Health Analytics
                </Button>
              </Link>
              <Button variant="outline" disabled>
                <Icons.settings className="mr-2 size-4" />
                DNS Settings (Coming Soon)
              </Button>
              <Button variant="outline" disabled>
                <Icons.refresh className="mr-2 size-4" />
                Force Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        {domain.uptimeChecks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Uptime Checks</CardTitle>
              <CardDescription>
                Latest uptime monitoring results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {domain.uptimeChecks.map((check) => (
                  <div key={check.id} className="flex items-center justify-between rounded border p-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={check.isUp ? "default" : "destructive"}>
                        {check.isUp ? "Up" : "Down"}
                      </Badge>
                      <span className="text-sm">
                        {new Date(check.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {check.responseTime && `${check.responseTime}ms`}
                      {check.statusCode && ` • ${check.statusCode}`}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
