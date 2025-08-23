import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { getUserSubscriptionPlan } from "@/lib/subscription";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user || !user.id) {
      return NextResponse.json({ isPaid: false }, { status: 401 });
    }

    const subscriptionPlan = await getUserSubscriptionPlan(user.id);

    return NextResponse.json({
      isPaid: subscriptionPlan.isPaid,
      plan: subscriptionPlan,
    });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json({ isPaid: false }, { status: 500 });
  }
}
