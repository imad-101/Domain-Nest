import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import { BillingInfo } from "@/components/billing-info";

export const metadata = constructMetadata({
  title: "Payment – Domain Nest",
  description: "Complete your payment to get lifetime access to Domain Nest.",
});

export default async function PaymentPage() {
  const user = await getCurrentUser();

  if (!user || !user.id) {
    redirect("/login");
  }

  const subscriptionPlan = await getUserSubscriptionPlan(user.id);

  // If user already has paid access, redirect to dashboard
  if (subscriptionPlan.isPaid) {
    redirect("/dashboard");
  }

  return (
    <div className="container max-w-4xl py-16">
      <DashboardHeader
        heading="Get Lifetime Access"
        text="One-time payment of $29 for unlimited access to all Domain Nest features."
      />
      
      <div className="grid gap-8 md:grid-cols-2 mt-8">
        {/* Left side - Features */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">What you get with lifetime access:</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Unlimited domain management</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Real-time SSL certificate monitoring</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>DNS management & monitoring</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Health check & uptime monitoring</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Advanced analytics & reporting</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Priority support</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-muted/50 p-6 rounded-lg">
            <h4 className="font-semibold text-lg mb-2">Why choose lifetime access?</h4>
            <p className="text-muted-foreground text-sm">
              Pay once, use forever. No monthly fees, no hidden costs. 
              Perfect for domain professionals and businesses who want 
              long-term domain management without recurring charges.
            </p>
          </div>
        </div>

        {/* Right side - Payment */}
        <div>
          <BillingInfo subscriptionPlan={subscriptionPlan} />
        </div>
      </div>
    </div>
  );
}
