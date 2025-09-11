import { SubscriptionPlan } from "types";

export const pricingData: SubscriptionPlan[] = [
  {
    title: "Free",
    description: "Get started with basic domain management",
    benefits: [
      "Up to 3 domains",
      "Basic SSL monitoring",
      "Email notifications",
    ],
    limitations: [
      "Limited to 3 domains",
      "Basic support only",
      "No advanced analytics",
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
    description: "One-time payment for unlimited access to all features",
    benefits: [
      "Unlimited domains",
      "Real-time SSL monitoring",
      "DNS management & monitoring", 
      "Health check & uptime monitoring",
      "Advanced analytics & reporting",
      "Priority support",
      "Bulk operations",
      "WHOIS lookup",
      "Domain expiry alerts",
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

export const plansColumns = ["Free", "Lifetime"] as const;
