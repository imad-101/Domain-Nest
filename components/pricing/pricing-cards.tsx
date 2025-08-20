"use client";

import { useContext } from "react";
import { UserSubscriptionPlan } from "@/types";

import { lifetimePlan } from "@/config/subscriptions";
import { Button } from "@/components/ui/button";
import { ModalContext } from "@/components/modals/providers";
import { HeaderSection } from "@/components/shared/header-section";
import { Icons } from "@/components/shared/icons";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

interface PricingCardsProps {
  userId?: string;
  subscriptionPlan?: UserSubscriptionPlan;
}

export function PricingCards({ userId, subscriptionPlan }: PricingCardsProps) {
  const { setShowSignInModal } = useContext(ModalContext);

  return (
    <MaxWidthWrapper>
      <section className="flex flex-col items-center py-20 text-center">
        <HeaderSection 
          label="Pricing" 
          title="Simple, transparent pricing"
        />
        
        <div className="mb-16 mt-6 max-w-2xl">
          <p className="text-lg leading-relaxed text-muted-foreground">
            One-time payment. Lifetime access. No hidden fees or subscriptions.
          </p>
        </div>

        {/* Clean, centered pricing section */}
        <div className="mx-auto w-full max-w-md space-y-12">
          
          {/* Pricing display */}
          <div className="space-y-4 text-center">
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-3">
                <span className="text-sm text-muted-foreground line-through">
                  ${lifetimePlan.originalPrice}
                </span>
                <span className="text-5xl font-bold text-foreground">
                  ${lifetimePlan.price}
                </span>
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                One-time payment • Lifetime access
              </p>
            </div>
            
            <p className="mx-auto max-w-sm text-base text-muted-foreground">
              {lifetimePlan.description}
            </p>
          </div>

          {/* Features list */}
          <div className="space-y-4">
            <h3 className="mb-6 text-lg font-semibold text-foreground">What&apos;s included:</h3>
            <ul className="space-y-4 text-left">
              {lifetimePlan.benefits.map((feature) => (
                <li className="flex items-start gap-3" key={feature}>
                  <Icons.check className="mt-0.5 size-5 shrink-0 text-green-600" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA section */}
          <div className="space-y-6">
            {userId && subscriptionPlan ? (
              <Button 
                size="lg" 
                className="h-12 w-full text-base font-medium"
                disabled={subscriptionPlan.title === "Lifetime"}
              >
                {subscriptionPlan.title === "Lifetime" ? "Current Plan" : "Upgrade to Lifetime"}
              </Button>
            ) : (
              <Button
                size="lg"
                className="h-12 w-full text-base font-medium"
                onClick={() => setShowSignInModal(true)}
              >
                Get Lifetime Access
              </Button>
            )}
            
            <div className="space-y-3 text-center">
              <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Icons.shield className="size-4" />
                  <span>30-day refund</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icons.lock className="size-4" />
                  <span>Secure payment</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Support info */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            Have questions? Email{" "}
            <a
              className="font-medium text-foreground hover:underline"
              href="mailto:support@domainnest.com"
            >
              support@domainnest.com
            </a>
          </p>
        </div>
      </section>
    </MaxWidthWrapper>
  );
}