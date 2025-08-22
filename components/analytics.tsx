"use client";

import Script from "next/script";
import { env } from "@/env.mjs";

interface PlausibleAnalyticsProps {
  domain: string;
  customDomain?: string;
  trackLocalhost?: boolean;
  enabled?: boolean;
}

export function PlausibleAnalytics({ 
  domain, 
  customDomain,
  trackLocalhost = false,
  enabled = true 
}: PlausibleAnalyticsProps) {
  // Don't load analytics in development unless specifically enabled
  if (!enabled || (process.env.NODE_ENV === "development" && !trackLocalhost)) {
    return null;
  }

  const scriptSrc = customDomain 
    ? `${customDomain}/js/script.js`
    : "https://plausible.io/js/script.js";

  return (
    <Script
      defer
      data-domain={domain}
      src={scriptSrc}
      strategy="afterInteractive"
    />
  );
}

// Simple wrapper for easy usage with environment variables
export function Analytics() {
  const domain = env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || "domnest.app";
  const customDomain = env.NEXT_PUBLIC_PLAUSIBLE_CUSTOM_DOMAIN;
  
  return (
    <PlausibleAnalytics 
      domain={domain}
      customDomain={customDomain}
      enabled={process.env.NODE_ENV === "production"}
    />
  );
}
