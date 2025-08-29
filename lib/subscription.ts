// @ts-nocheck
// TODO: Fix this when we turn strict mode on.
import { pricingData } from "@/config/subscriptions";
import { prisma } from "@/lib/db";
import { UserSubscriptionPlan } from "types";

export async function getUserSubscriptionPlan(
  userId: string
): Promise<UserSubscriptionPlan> {
  if(!userId) throw new Error("Missing parameters");

  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripePriceId: true,
      lemonSqueezyCustomerId: true,
      lemonSqueezySubscriptionId: true,
      lemonSqueezyVariantId: true,
      lemonSqueezyCurrentPeriodEnd: true,
    },
  })

  if (!user) {
    // Instead of throwing an error, return a default free plan
    console.warn(`User ${userId} not found in database, returning free plan`);
    return {
      ...pricingData[0], // Free plan
      stripeSubscriptionId: null,
      stripeCurrentPeriodEnd: null,
      stripeCustomerId: null,
      isPaid: false,
      isSubscribed: false,
      isCanceled: false,
      interval: "month",
    };
  }

  // Check if user has lifetime access (Lemon Squeezy or legacy Stripe)
  const hasLifetimeAccess = user.lemonSqueezyVariantId || (user.stripePriceId && user.stripeCurrentPeriodEnd);
  
  // Check if user is on a paid plan
  const isPaid = hasLifetimeAccess || (
    user.lemonSqueezyCurrentPeriodEnd?.getTime() + 86_400_000 > Date.now()
  );

  // Find the pricing data corresponding to the user's plan
  const userPlan = pricingData.find((plan) => 
    plan.lemonSqueezyIds.variantId === user.lemonSqueezyVariantId
  );

  const plan = isPaid && userPlan ? userPlan : pricingData[0]

  // Determine interval
  const interval = isPaid && userPlan
    ? userPlan.title === "Lifetime" 
      ? "lifetime"
      : "month" // Default for Lemon Squeezy
    : null;

  // For Lemon Squeezy, we don't have cancellation status in the same way
  const isCanceled = false;

  return {
    ...plan,
    ...user,
    stripeCurrentPeriodEnd: user.stripeCurrentPeriodEnd?.getTime() || user.lemonSqueezyCurrentPeriodEnd?.getTime(),
    isPaid,
    interval,
    isCanceled,
    lemonSqueezyCustomerId: user.lemonSqueezyCustomerId,
    lemonSqueezySubscriptionId: user.lemonSqueezySubscriptionId,
  }
}
