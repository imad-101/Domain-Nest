"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/shared/icons";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

interface DomainsTableProps {
  refreshTrigger: number;
}

export function DomainsTable({ refreshTrigger }: DomainsTableProps) {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [domainToDelete, setDomainToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const refreshDomainsData = async () => {
    setRefreshing(true);
    try {
      const response = await fetch("/api/domains/refresh", {
        method: "POST",
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log("Refresh result:", result);
        // Fetch domains again to get updated data
        await fetchDomains();
      } else {
        console.error("Failed to refresh domains");
      }
    } catch (error) {
      console.error("Error refreshing domains:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const getDaysUntilExpiry = (expiresAt: string) => {
    const expiryDate = new Date(expiresAt);
    const now = new Date();
    
    // Set time to midnight for both dates to compare just the date part
    expiryDate.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    
    const diffTime = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExpiryStatus = (expiresAt: string) => {
    const daysUntilExpiry = getDaysUntilExpiry(expiresAt);
    
    if (daysUntilExpiry < 0) {
      return { status: "expired", color: "destructive", text: "Expired" };
    } else if (daysUntilExpiry <= 30) {
      return { status: "warning", color: "secondary", text: `${daysUntilExpiry} days left` };
    } else {
      return { status: "active", color: "default", text: `${daysUntilExpiry} days left` };
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

  const getSSLStatus = (domain: Domain) => {
    if (!domain.sslStatus || domain.sslStatus === 'unknown') {
      return { status: "unknown", color: "outline", text: "Not checked" };
    }
    
    if (domain.sslStatus === 'error') {
      return { status: "error", color: "destructive", text: "SSL Error" };
    }

    const daysUntilExpiry = getSSLDaysUntilExpiry(domain.sslExpiresAt || null);
    
    if (daysUntilExpiry === null) {
      return { status: "unknown", color: "outline", text: "No SSL" };
    }
    
    if (daysUntilExpiry < 0) {
      return { status: "expired", color: "destructive", text: "SSL Expired" };
    } else if (daysUntilExpiry <= 30) {
      return { status: "warning", color: "secondary", text: `SSL expires in ${daysUntilExpiry} days` };
    } else {
      return { status: "valid", color: "default", text: `SSL valid (${daysUntilExpiry} days)` };
    }
  };

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
        await fetchDomains(); // Refresh domains to show updated SSL data
        toast.success("SSL check completed");
      } else {
        toast.error("Failed to check SSL");
      }
    } catch (error) {
      console.error("Error checking SSL:", error);
      toast.error("Failed to check SSL");
    }
  };

  const deleteDomain = async (domainId: string) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/domains/${domainId}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        await fetchDomains();
        toast.success("Domain deleted successfully");
        setDomainToDelete(null);
      } else {
        toast.error("Failed to delete domain");
      }
    } catch (error) {
      console.error("Error deleting domain:", error);
      toast.error("Failed to delete domain");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Domains</CardTitle>
          <CardDescription>Loading your domains...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Icons.spinner className="size-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (domains.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Domains</CardTitle>
          <CardDescription>Manage and monitor your domain portfolio.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <div className="text-center">
              <Icons.search className="mx-auto size-12 mb-4 opacity-50" />
              <p>No domains found</p>
              <p className="text-sm">Add your first domain using the form above</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Your Domains ({domains.length})</CardTitle>
            <CardDescription>Manage and monitor your domain portfolio.</CardDescription>
          </div>
          <button
            onClick={refreshDomainsData}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md transition-colors disabled:opacity-50"
          >
            <Icons.refresh className={`size-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Domain Name</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Domain Expiry</TableHead>
                            <TableHead>Domain Expiry</TableHead>
              <TableHead>SSL Status</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {domains.map((domain) => {
              const daysUntilExpiry = getDaysUntilExpiry(domain.expiresAt);
              const expiryStatus = getExpiryStatus(domain.expiresAt);
              const sslStatus = getSSLStatus(domain);
              return (
                <TableRow key={domain.id}>
                  <TableCell className="font-medium">{domain.domainName}</TableCell>
                  <TableCell>{domain.provider}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge variant={expiryStatus.color as any}>
                        {daysUntilExpiry < 0 ? "Expired" : `${daysUntilExpiry} days`}
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        Expires: {new Date(domain.expiresAt).toLocaleDateString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge variant={sslStatus.color as any}>
                        {sslStatus.text}
                      </Badge>
                      {domain.sslIssuer && (
                        <div className="text-xs text-muted-foreground">
                          Issuer: {domain.sslIssuer}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{new Date(domain.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => window.open(`/dashboard/ssl?domain=${domain.domainName}`, '_blank')}
                        className="text-green-600 hover:text-green-800"
                        title="View SSL Certificate"
                      >
                        <Icons.shield className="size-4" />
                      </button>
                      <Link href={`/dashboard/domains/${domain.id}`}>
                        <button 
                          className="text-blue-600 hover:text-blue-800"
                          title="Domain Settings"
                        >
                          <Icons.settings className="size-4" />
                        </button>
                      </Link>
                      <button 
                        onClick={() => setDomainToDelete(domain.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete Domain"
                      >
                        <Icons.trash className="size-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!domainToDelete} onOpenChange={() => setDomainToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Domain</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this domain? This action cannot be undone and will remove all associated data including SSL certificates, uptime checks, and performance metrics.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => domainToDelete && deleteDomain(domainToDelete)}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete Domain"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
} 