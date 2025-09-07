import { NavBar } from "@/components/layout/navbar";

import { NavMobile } from "@/components/layout/mobile-nav";
import CallToActionSection from "@/components/layout/CTA";
interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <NavMobile />
      <NavBar scroll={true} />
      <main className="flex-1">{children}</main>
 
      <CallToActionSection />
    </div>
  );
}
