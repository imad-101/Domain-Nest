"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown, Grid, List, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  onDomainAdded: () => void;
}

export function DomainsTable({ refreshTrigger, onDomainAdded }: DomainsTableProps) {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
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

  const filteredDomains = domains.filter(domain =>
    domain.domainName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    domain.provider.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedDomains = [...filteredDomains].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case "expiry":
        aValue = new Date(a.expiresAt).getTime();
        bValue = new Date(b.expiresAt).getTime();
        break;
      case "registrar":
        aValue = a.provider.toLowerCase();
        bValue = b.provider.toLowerCase();
        break;
      case "domain":
      default:
        aValue = a.domainName.toLowerCase();
        bValue = b.domainName.toLowerCase();
        break;
    }
    
    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icons.spinner className="size-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <label className="mb-3 block text-sm font-medium text-muted-foreground">Filter</label>
            <Input
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-11 w-72"
            />
          </div>
          
          <div>
            <label className="mb-3 block text-sm font-medium text-muted-foreground">Fields</label>
            <Select value="domain-registrar-expiry" onValueChange={() => {}}>
              <SelectTrigger className="h-11 w-72">
                <SelectValue placeholder="Domain Name, Registrar, Expiry Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="domain-registrar-expiry">Domain Name, Registrar, Expiry Date</SelectItem>
                <SelectItem value="domain">Domain Name</SelectItem>
                <SelectItem value="registrar">Registrar</SelectItem>
                <SelectItem value="expiry">Expiry Date</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
        
        </div>
        
        <DomainForm onDomainAdded={onDomainAdded} />
      </div>

      {/* Domains Table */}
      {sortedDomains.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Icons.search className="mb-6 size-16 text-muted-foreground" />
          <h3 className="mb-3 text-xl font-semibold">No domains found</h3>
          <p className="text-base text-muted-foreground">
            {searchTerm ? "Try adjusting your search terms" : "Add your first domain to get started"}
          </p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="h-14">
                <TableHead className="w-16"></TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("domain")}
                    className="h-auto p-0 text-base font-semibold hover:bg-transparent"
                  >
                    Domain
                    <ArrowUpDown className="ml-2 size-5" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("registrar")}
                    className="h-auto p-0 text-base font-semibold hover:bg-transparent"
                  >
                    Registrar
                    <ArrowUpDown className="ml-2 size-5" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("expiry")}
                    className="h-auto p-0 text-base font-semibold hover:bg-transparent"
                  >
                    Expiry
                    <ArrowUpDown className="ml-2 size-5" />
                  </Button>
                </TableHead>
                <TableHead className="w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedDomains.map((domain) => {
                const expiryBadge = getExpiryBadge(domain.expiresAt);
                const domainIcon = domain.domainName.charAt(0).toUpperCase();
                
                return (
                  <TableRow key={domain.id} className="h-16 hover:bg-muted/50">
                    <TableCell className="py-4">
                      <div className="flex size-10 items-center justify-center overflow-hidden rounded-full text-sm font-medium">
                        <img
                          src={`https://www.google.com/s2/favicons?domain=${domain.domainName}&sz=32`}
                          alt={`${domain.domainName} favicon`}
                          className="size-8 rounded"
                          onError={(e) => {
                            // Fallback to letter if favicon fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = domainIcon;
                              parent.className = "w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-sm font-medium";
                            }
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-base font-medium">
                      {domain.domainName}
                    </TableCell>
                    <TableCell className="py-4 text-base text-muted-foreground">
                      {domain.provider}
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-base text-muted-foreground">
                          {new Date(domain.expiresAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                        <Badge variant={expiryBadge.variant} className="px-3 py-1 text-sm">
                          {expiryBadge.text}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="default" className="size-10 p-0">
                            <MoreHorizontal className="size-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/domains/${domain.id}`}>
                              <Icons.settings className="mr-2 size-4" />
                              Settings
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDomainToDelete(domain.id)}
                            className="text-red-600"
                          >
                            <Icons.trash className="mr-2 size-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Summary */}
      <div className="py-2 text-base text-muted-foreground">
        Viewing {sortedDomains.length} of {domains.length} domains, with 3 fields visible in list
      </div>

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