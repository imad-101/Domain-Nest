import { redirect } from "next/navigation";
import Image from "next/image";

import { sidebarLinks } from "@/config/dashboard";
import { getCurrentUser } from "@/lib/session";
import {
  DashboardSidebar,
  MobileSheetSidebar,
} from "@/components/layout/dashboard-sidebar";
import { UserAccountNav } from "@/components/layout/user-account-nav";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default async function Dashboard({ children }: ProtectedLayoutProps) {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  return (
    <div className="relative flex min-h-screen w-full bg-background">
      <DashboardSidebar links={sidebarLinks} />

      <div className="relative z-10 flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 border-b border-border bg-background/98 px-2 sm:px-4 backdrop-blur-sm supports-[backdrop-filter]:bg-background/95 lg:h-[60px] xl:px-8">
          <MaxWidthWrapper className="flex max-w-7xl items-center gap-x-2 sm:gap-x-3 px-0">
            <MobileSheetSidebar links={sidebarLinks} />

            {/* Logo for mobile/header */}
            <div className="flex items-center gap-2 md:hidden">
              <Image
                src="/DomNest.png"
                alt="Domain Nest Logo"
                width={120}
                height={32}
                className="h-8 w-auto max-w-[120px]"
              />
             
            </div>

            <div className="w-full flex-1">
              {/* Empty space - removed SearchCommand */}
            </div>

            <UserAccountNav />
          </MaxWidthWrapper>
        </header>

        <main className="relative z-0 flex-1 p-2 sm:p-4 xl:px-8 bg-muted/20">
          <MaxWidthWrapper className="relative z-0 flex h-full max-w-7xl flex-col gap-4 px-0 lg:gap-6">
            {children}
          </MaxWidthWrapper>
        </main>
      </div>
    </div>
  );
}
