import { SubscriptionPlan } from "types";

export const pricingData: SubscriptionPlan[] = [
  {
    title: "Free",
    description: "Limited access to get started",
    benefits: [
      "Limited domain management",
      "Basic SSL monitoring",
      "Community support",
    ],
    limitations: [
      "Up to 1 domain",
      "Basic features only",
      "Limited monitoring",
    ],
    prices: {
      monthly: 0,
      yearly: 0,
    },
    lemonSqueezyIds: {
      variantId: null,
      productId: null,
    },
  },
  {
    title: "Lifetime",
    description: "One-time payment for lifetime access",
    benefits: [
      "Unlimited domain management",
      "Real-time SSL monitoring",
      "DNS management & monitoring", 
      "Health check monitoring",
      "Priority support",
      "Advanced analytics",
      "Lifetime access",
    ],
    limitations: [],
    prices: {
      monthly: 29,
      yearly: 29,
    },
    lemonSqueezyIds: {
      variantId: process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_ID || null,
      productId: process.env.NEXT_PUBLIC_LEMONSQUEEZY_STORE_ID || null,
    },
  },
];
