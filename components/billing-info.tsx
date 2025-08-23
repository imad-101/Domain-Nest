"use client";

import * as React from "react";
import { UserSubscriptionPlan } from "types";
import { env } from "@/env.mjs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Icons } from "@/components/shared/icons";

interface BillingInfoProps {
  subscriptionPlan: UserSubscriptionPlan;
}

export function BillingInfo({ subscriptionPlan }: BillingInfoProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);

    try {
      // Create checkout session
      const response = await fetch("/api/lemonsqueezy/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          variantId: env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_ID,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Lifetime Access</CardTitle>
        <CardDescription>
          One-time payment for unlimited access
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-4xl font-bold">$29</div>
          <div className="text-sm text-muted-foreground">One-time payment</div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Icons.check className="mr-2 h-4 w-4 text-green-500" />
            Unlimited domains
          </div>
          <div className="flex items-center text-sm">
            <Icons.check className="mr-2 h-4 w-4 text-green-500" />
            Real-time SSL monitoring
          </div>
          <div className="flex items-center text-sm">
            <Icons.check className="mr-2 h-4 w-4 text-green-500" />
            DNS management
          </div>
          <div className="flex items-center text-sm">
            <Icons.check className="mr-2 h-4 w-4 text-green-500" />
            Health monitoring
          </div>
          <div className="flex items-center text-sm">
            <Icons.check className="mr-2 h-4 w-4 text-green-500" />
            Priority support
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <form className="w-full" onSubmit={onSubmit}>
          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={isLoading}
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Get Lifetime Access - $29
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
