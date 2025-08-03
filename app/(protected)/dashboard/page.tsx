"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/header";
import { DomainForm } from "@/components/forms/domain-form";
import { DomainsGrid } from "@/components/dashboard/domains-grid";

export default function DashboardPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleDomainAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <>
      <DashboardHeader
        heading="Domain Nest"
        text="Manage your domain portfolio."
      />
      
      <div className="space-y-6">
        <DomainsGrid refreshTrigger={refreshTrigger} onDomainAdded={handleDomainAdded} />
      </div>
    </>
  );
}
