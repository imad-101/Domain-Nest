"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";
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
  lastSslCheck?: string | null;
}

interface SSLData {
  status: string;
  issuer: string | null;
  expiresAt: string | null;
  isValid: boolean;
  daysUntilExpiry: number | null;
}

interface DomainsGridProps {
  refreshTrigger: number;
  onDomainAdded: () => void;
}

export function DomainsGrid({ refreshTrigger, onDomainAdded }: DomainsGridProps) {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
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
      {/* Header with Add Domain button */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Your Domains</CardTitle>
            <DomainForm onDomainAdded={onDomainAdded} />
          </div>
        </CardHeader>
      </Card>

      {/* Domains List */}
      {domains.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Icons.home className="mb-4 size-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No domains yet</h3>
            <p className="text-center text-muted-foreground">
              Add your first domain to get started with monitoring and management
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {domains.map((domain) => {
            const expiryBadge = getExpiryBadge(domain.expiresAt);
            
            return (
              <Link href={`/dashboard/domains/${domain.id}`} key={domain.id}>
                <Card className="transition-shadow hover:shadow-md cursor-pointer hover:border-primary/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg hover:text-primary transition-colors">{domain.domainName}</CardTitle>
                      <Badge variant={expiryBadge.variant}>
                        {expiryBadge.text}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{domain.provider}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Added {new Date(domain.createdAt).toLocaleDateString()}
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setDomainToDelete(domain.id);
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Icons.trash className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
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
              Are you sure you want to delete this domain? This action cannot be undone.
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
