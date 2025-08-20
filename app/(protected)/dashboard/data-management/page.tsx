import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import { DataRefreshManager } from "@/components/dashboard/data-refresh-manager";

export const metadata = constructMetadata({
  title: "Data Management – Domain Nest",
  description: "Manage cached data and monitor system performance with hybrid caching.",
});

export default function DataManagementPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <DashboardHeader
        heading="Data Management"
        text="Monitor and manage your hybrid caching system with advanced controls."
      />
      
      <div className="space-y-8">
        <DataRefreshManager />
      </div>
    </div>
  );
}
