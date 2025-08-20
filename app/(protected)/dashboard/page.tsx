"use client";

import { useState } from "react";
import { DomainsTable } from "@/components/dashboard/domains-table";
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

  const handleDomainAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-8 p-8">
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
