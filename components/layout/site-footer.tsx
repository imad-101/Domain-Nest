import * as React from "react";
import Link from "next/link";

import { footerLinks, siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

import { Icons } from "../shared/icons";

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn("border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", className)}>
      <div className="container max-w-6xl py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
          {/* Brand Section */}
          <div className="col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3">
            <div className="flex items-center space-x-2">
             
              <span className="text-xl font-bold">{siteConfig.name}</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              Professional domain management platform with comprehensive monitoring and analytics.
            </p>
            <div className="mt-6 flex items-center space-x-4">
           
              <Link
                href={siteConfig.links.twitter}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icons.twitter className="size-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section) => (
            <div key={section.title} className="col-span-1">
              <h3 className="text-sm font-semibold text-foreground mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.items?.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-12 border-t pt-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              © 2025 {siteConfig.name}. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Made with ❤️ for domain professionals
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
