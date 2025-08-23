import { SidebarNavItem, SiteConfig } from "types";
import { env } from "@/env.mjs";

const site_url = env.NEXT_PUBLIC_APP_URL;

export const siteConfig: SiteConfig = {
  name: "Domain Nest",
  description:
    "Professional domain management platform with DNS monitoring, SSL certificates, domain transfers, and comprehensive analytics. Keep your online presence secure and optimized.",
  url: site_url,
  ogImage: `${site_url}/_static/og.jpg`,
  links: {
    twitter: "https://x.com/imaduddin_101",
    github: "https://github.com/imad-101",
  },
  mailSupport: "support@domnest.app",
};

export const footerLinks: SidebarNavItem[] = [
  {
    title: "Company",
    items: [
      { title: "About", href: "/about" },
      { title: "Terms", href: "/terms" },
      { title: "Privacy", href: "/privacy" },
    ],
  },
  {
    title: "Products",
    items: [
      { title: "Domain Management", href: "/dashboard" },
      { title: "SSL Monitoring", href: "/dashboard" },
      { title: "Health Check", href: "/dashboard" },
    ],
  },
];
