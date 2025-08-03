"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DomainForm } from "@/components/forms/domain-form";
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

interface DomainsGridProps {
  refreshTrigger: number;
  onDomainAdded: () => void;
}

export function DomainsGrid({ refreshTrigger, onDomainAdded }: DomainsGridProps) {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
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

  const getDaysUntilExpiry = (expiresAt: string) => {
    const expiryDate = new Date(expiresAt);
    const now = new Date();
    
    expiryDate.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    
    const diffTime = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExpiryBadge = (expiresAt: string) => {
    const days = getDaysUntilExpiry(expiresAt);
    
    if (days < 0) {
      return { variant: "destructive" as const, text: "Expired" };
    } else if (days <= 30) {
      return { variant: "secondary" as const, text: `${days} days` };
    } else if (days <= 365) {
      return { variant: "default" as const, text: `${Math.floor(days / 30)} months` };
    } else {
      return { variant: "default" as const, text: `${Math.floor(days / 365)} years` };
    }
  };

  const getSSLStatus = (domain: Domain) => {
    if (!domain.sslStatus || domain.sslStatus === 'unknown') {
      return { variant: "outline" as const, text: "SSL Unknown" };
    }
    
    if (domain.sslStatus === 'error') {
      return { variant: "destructive" as const, text: "SSL Error" };
    }

    if (domain.sslExpiresAt) {
      const days = getDaysUntilExpiry(domain.sslExpiresAt);
      
      if (days < 0) {
        return { variant: "destructive" as const, text: "SSL Expired" };
      } else if (days <= 30) {
        return { variant: "secondary" as const, text: `SSL ${days}d` };
      } else {
        return { variant: "default" as const, text: "SSL Valid" };
      }
    }
    
    return { variant: "outline" as const, text: "No SSL" };
  };

  const getDomainIcon = (domainName: string) => {
    const domain = domainName.toLowerCase();
    
    if (domain.includes('github')) return "🐙";
    if (domain.includes('google') || domain.includes('gmail')) return "🔍";
    if (domain.includes('twitter')) return "🐦";
    if (domain.includes('facebook')) return "📘";
    if (domain.includes('youtube')) return "📺";
    if (domain.includes('amazon')) return "📦";
    if (domain.includes('cloudflare')) return "🌤️";
    if (domain.includes('microsoft')) return "🪟";
    if (domain.includes('apple')) return "🍎";
    if (domain.includes('bbc')) return "📰";
    if (domain.includes('duck')) return "🦆";
    if (domain.includes('gitlab')) return "🦊";
    if (domain.includes('web')) return "🌐";
    if (domain.includes('love') || domain.includes('holiday')) return "☀️";
    if (domain.includes('privacy')) return "🔒";
    if (domain.includes('game')) return "🎮";
    if (domain.includes('awesome')) return "🚀";
    
    // Default icons based on TLD
    if (domain.endsWith('.com')) return "🌐";
    if (domain.endsWith('.org')) return "🏛️";
    if (domain.endsWith('.net')) return "💻";
    if (domain.endsWith('.tech')) return "⚡";
    if (domain.endsWith('.xyz')) return "🌟";
    if (domain.endsWith('.io')) return "💾";
    
    return "🌍";
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
        await fetchDomains();
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
        onDomainAdded(); // Refresh parent component
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

  const filteredDomains = domains.filter(domain =>
    domain.domainName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    domain.provider.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedDomains = [...filteredDomains].sort((a, b) => {
    switch (sortBy) {
      case "expiry":
        return new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime();
      case "created":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "provider":
        return a.provider.localeCompare(b.provider);
      default:
        return a.domainName.localeCompare(b.domainName);
    }
  });

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Domains</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <Icons.spinner className="size-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Icons.home className="size-5" />
                Domains
              </CardTitle>
            </div>
            
            <div className="flex items-center gap-3">
              <Input
                placeholder="Search domains..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-32"
              />
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Fields" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Domain Name, Registrar, Expiry Date</SelectItem>
                  <SelectItem value="expiry">Expiry Date</SelectItem>
                  <SelectItem value="created">Date Added</SelectItem>
                  <SelectItem value="provider">Registrar</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value="created" onValueChange={() => {}}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created">Date Added</SelectItem>
                  <SelectItem value="expiry">Expiry Date</SelectItem>
                  <SelectItem value="name">Domain Name</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value="grid" onValueChange={() => {}}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grid">Layout</SelectItem>
                  <SelectItem value="list">List</SelectItem>
                </SelectContent>
              </Select>
              
              <DomainForm onDomainAdded={onDomainAdded} />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Domains Grid */}
      {sortedDomains.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Icons.search className="size-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No domains found</h3>
            <p className="text-muted-foreground text-center">
              {searchTerm ? "Try adjusting your search terms" : "Add your first domain to get started"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedDomains.map((domain) => {
            const expiryBadge = getExpiryBadge(domain.expiresAt);
            const sslStatus = getSSLStatus(domain);
            const icon = getDomainIcon(domain.domainName);
            
            return (
              <Card key={domain.id} className="group hover:shadow-lg transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{icon}</div>
                      <div>
                        <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">
                          {domain.domainName}
                        </h3>
                        <p className="text-sm text-muted-foreground">{domain.provider}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <Badge 
                        variant={expiryBadge.variant}
                        className={`
                          ${expiryBadge.variant === 'default' ? 'bg-green-600 text-white hover:bg-green-700' : ''}
                          ${expiryBadge.variant === 'secondary' ? 'bg-orange-600 text-white hover:bg-orange-700' : ''}
                          ${expiryBadge.variant === 'destructive' ? 'bg-red-600 text-white hover:bg-red-700' : ''}
                        `}
                      >
                        {expiryBadge.text}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Added {new Date(domain.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(`/dashboard/ssl?domain=${domain.domainName}`, '_blank')}
                        className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                        title="View SSL Certificate"
                      >
                        <Icons.shield className="size-4" />
                      </Button>
                      <Link href={`/dashboard/domains/${domain.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
                          title="Domain Settings"
                        >
                          <Icons.settings className="size-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDomainToDelete(domain.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        title="Delete Domain"
                      >
                        <Icons.trash className="size-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

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
    </div>
  );
}
