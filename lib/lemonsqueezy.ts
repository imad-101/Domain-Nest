import { lemonSqueezySetup } from "@lemonsqueezy/lemonsqueezy.js";

import { env } from "@/env.mjs";

// Configure Lemon Squeezy
export const configureLemonSqueezy = () => {
  lemonSqueezySetup({
    apiKey: env.LEMONSQUEEZY_API_KEY,
    onError: (error) => console.error("Lemon Squeezy error:", error),
  });
};

// Call setup function
configureLemonSqueezy();
