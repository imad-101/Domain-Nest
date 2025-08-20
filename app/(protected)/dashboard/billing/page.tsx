import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = constructMetadata({
  title: "Billing – Domain Nest",
  description: "Manage billing and your subscription plan.",
});

export default async function BillingPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <DashboardHeader
        heading="Billing"
        text="Manage billing and your subscription plan."
      />
      
      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>
              You are currently on the Free plan.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Free Plan</p>
              <p className="text-sm text-muted-foreground">
                Access to basic domain management features.
              </p>
            </div>
            <Button>
              Upgrade to Pro
            </Button>
          </CardContent>
        </Card>

        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Important Note</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Domain Nest app is a demo app using a Stripe test environment. You
              can find a list of test card numbers on the{" "}
              <a
                className="font-medium text-primary underline underline-offset-8"
                href="https://stripe.com/docs/testing#cards"
                target="_blank"
                rel="noopener noreferrer"
              >
                Stripe docs
              </a>
              .
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
