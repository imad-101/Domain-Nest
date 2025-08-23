import Link from "next/link";


import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";

export default function HeroLanding() {

  return (
    <section className="space-y-6 py-12 sm:py-20 lg:py-20 ">
      <div className="container flex max-w-5xl flex-col items-center gap-5 text-center">
        <Link
          href="/login"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm", rounded: "full" }),
            "px-4",
          )}
        >
          <span className="mr-3">🚀</span>
          <span className="hidden md:flex">Try&nbsp;</span> Domain Nest Free
        </Link>

        <h1 className="tracking-light text-balance text-4xl font-extrabold sm:text-5xl md:text-6xl lg:text-[66px]">
          All Your Domains. One Dashboard.{" "}
          <span className="font-extrabold text-[#ee6c4d]">
            Zero Stress.
          </span>
        </h1>

        <p
          className="max-w-2xl text-balance leading-normal text-muted-foreground sm:text-xl sm:leading-8"
          style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
        >
          Track renewals, manage DNS, SSL, and transfers effortlessly — and never lose control of your online presence again.
        </p>

        <div
          className="flex justify-center space-x-2 md:space-x-4"
          style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
        >
          <Link
            href="/login"
            prefetch={true}
            className={cn(
              buttonVariants({ size: "lg", rounded: "full" }),
              "gap-2",
            )}
          >
            <span>Get Started</span>
            <Icons.arrowRight className="size-4" />
          </Link>
          <Link
            href="/dashboard"
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "lg",
                rounded: "full",
              }),
              "px-5",
            )}
          >
            <Icons.dashboard className="mr-2 size-4" />
            <p>
              <span className="hidden sm:inline-block">View</span> Dashboard{" "}
              <span className="font-semibold">Demo</span>
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
}
