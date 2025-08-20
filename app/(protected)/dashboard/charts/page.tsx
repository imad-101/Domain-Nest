import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";

export default function ChartsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Charts" text="Visualize your domain data." />
      <div className="grid gap-4">
        <p className="text-muted-foreground">Charts and analytics coming soon.</p>
      </div>
    </DashboardShell>
  );
}