"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DomainsTable } from "@/components/dashboard/domains-table";
import { toast } from "sonner";
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";

export default function DashboardPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const response = await fetch("/api/user/subscription");
        const data = await response.json();
        
        if (!data.isPaid) {
          // User hasn't paid, redirect to payment page
          router.push("/payment");
          return;
        }
        
        // Check for payment success message
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('payment') === 'success') {
          toast.success("Payment successful! Welcome to Domain Nest!");
          // Clean up URL
          router.replace('/dashboard');
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking payment status:", error);
        setIsLoading(false);
      }
    };

    checkPaymentStatus();
  }, [router]);

  const handleDomainAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 bg-background/50">
      {/* Breadcrumb Navigation
      // <Breadcrumb>
      //   <BreadcrumbList>
      //     <BreadcrumbItem>
      //       <BreadcrumbLink href="/dashboard" className="flex items-center gap-2">
      //         <Home className="h-4 w-4" />
      //         Home
      //       </BreadcrumbLink>
      //     </BreadcrumbItem>
      //     <BreadcrumbSeparator />
      //     <BreadcrumbItem>
      //       <BreadcrumbPage>Domains</BreadcrumbPage>
      //     </BreadcrumbItem>
      //   </BreadcrumbList>
      // </Breadcrumb> */}
      
      {/* Domains Table */}
      <DomainsTable refreshTrigger={refreshTrigger} onDomainAdded={handleDomainAdded} />
    </div>
  );
}
