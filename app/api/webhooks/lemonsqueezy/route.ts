import { headers } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { env } from "@/env.mjs";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get("X-Signature") as string;

    // Verify webhook signature
    const hmac = crypto.createHmac('sha256', env.LEMONSQUEEZY_WEBHOOK_SECRET);
    hmac.update(body);
    const digest = hmac.digest('hex');

    if (signature !== digest) {
      console.error("Invalid webhook signature");
      return new NextResponse("Invalid signature", { status: 400 });
    }

    const event = JSON.parse(body);
    console.log("Lemon Squeezy webhook event:", event.meta.event_name);

    switch (event.meta.event_name) {
      case "order_created": {
        const order = event.data;
        const customData = order.attributes.first_order_item?.product_options?.custom;
        const userId = customData?.user_id;

        if (!userId) {
          console.error("No userId in order custom data");
          break;
        }

        // Update user with payment information for lifetime access
        await prisma.user.update({
          where: { id: userId },
          data: {
            lemonSqueezyCustomerId: order.attributes.customer_id.toString(),
            lemonSqueezyVariantId: order.attributes.first_order_item?.variant_id.toString(),
            lemonSqueezyCurrentPeriodEnd: new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000), // 100 years for lifetime
          },
        } as any);

        console.log(`User ${userId} granted lifetime access via Lemon Squeezy`);
        break;
      }

      case "subscription_created":
      case "subscription_updated": {
        const subscription = event.data;
        const customData = subscription.attributes.custom_data;
        const userId = customData?.user_id;

        if (!userId) {
          console.error("No userId in subscription custom data");
          break;
        }

        await prisma.user.update({
          where: { id: userId },
          data: {
            lemonSqueezyCustomerId: subscription.attributes.customer_id.toString(),
            lemonSqueezySubscriptionId: subscription.id,
            lemonSqueezyVariantId: subscription.attributes.variant_id.toString(),
            lemonSqueezyCurrentPeriodEnd: new Date(subscription.attributes.renews_at),
          },
        } as any);

        console.log(`Subscription updated for user ${userId}`);
        break;
      }

      case "subscription_cancelled": {
        const subscription = event.data;
        
        await prisma.user.update({
          where: {
            lemonSqueezySubscriptionId: subscription.id,
          } as any,
          data: {
            lemonSqueezySubscriptionId: null,
            lemonSqueezyVariantId: null,
            lemonSqueezyCurrentPeriodEnd: null,
          },
        } as any);

        console.log(`Subscription cancelled: ${subscription.id}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.meta.event_name}`);
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("Lemon Squeezy webhook error:", error);
    return new NextResponse("Webhook handler failed", { status: 500 });
  }
}
