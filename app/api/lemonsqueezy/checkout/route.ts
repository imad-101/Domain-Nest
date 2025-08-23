import { NextResponse } from "next/server";
import { createCheckout } from "@lemonsqueezy/lemonsqueezy.js";
import { getCurrentUser } from "@/lib/session";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import { configureLemonSqueezy } from "@/lib/lemonsqueezy";
import { prisma } from "@/lib/db";
import { env } from "@/env.mjs";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user || !user.email || !user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const subscriptionPlan = await getUserSubscriptionPlan(user.id);

    // If user already has paid access, return error
    if (subscriptionPlan.isPaid) {
      return new NextResponse("User already has paid access", { status: 400 });
    }

    const { variantId } = await request.json();

    if (!variantId) {
      return new NextResponse("Variant ID is required", { status: 400 });
    }

    // Check if we have valid Lemon Squeezy credentials
    if (!env.LEMONSQUEEZY_API_KEY || 
        env.LEMONSQUEEZY_API_KEY === "your_lemonsqueezy_api_key_here" ||
        env.LEMONSQUEEZY_API_KEY === "temp_api_key" ||
        env.LEMONSQUEEZY_API_KEY.startsWith("temp_")) {
      // Development mode: simulate successful payment for testing
      console.log("Development mode: Simulating payment for user", user.id);
      
      // For development, directly grant access
      await prisma.user.update({
        where: { id: user.id },
        data: {
          lemonSqueezyCustomerId: "dev_customer_" + user.id,
          lemonSqueezyVariantId: variantId,
          lemonSqueezyCurrentPeriodEnd: new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000), // 100 years
        } as any,
      });

      return NextResponse.json({ 
        url: `${env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success&dev=true`,
        checkoutId: "dev_checkout_" + Date.now()
      });
    }

    configureLemonSqueezy();

    // Create checkout session
    const checkout = await createCheckout(
      env.NEXT_PUBLIC_LEMONSQUEEZY_STORE_ID,
      variantId,
      {
        checkoutOptions: {
          embed: false,
          media: false,
          logo: true,
        },
        checkoutData: {
          email: user.email,
          name: user.name || undefined,
          custom: {
            user_id: user.id,
          },
        },
        productOptions: {
          name: "Domain Nest Lifetime Access",
          description: "Unlimited domain management with lifetime access",
          media: [`${env.NEXT_PUBLIC_APP_URL}/main.png`],
          redirectUrl: `${env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
          receiptButtonText: "Go to Dashboard",
          receiptThankYouNote: "Thank you for purchasing Domain Nest! You now have lifetime access to all features.",
        },
      }
    );

    if (!checkout?.data) {
      throw new Error("Failed to create checkout session");
    }

    // Extract URL from the response
    const checkoutUrl = (checkout as any).data?.attributes?.url;
    const checkoutId = (checkout as any).data?.id;

    if (!checkoutUrl) {
      throw new Error("No checkout URL returned");
    }

    return NextResponse.json({ 
      url: checkoutUrl,
      checkoutId: checkoutId 
    });
  } catch (error) {
    console.error("Lemon Squeezy checkout error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
