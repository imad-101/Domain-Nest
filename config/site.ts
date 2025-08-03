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
    twitter: "https://twitter.com/domainnest",
    github: "https://github.com/domainnest",
  },
  mailSupport: "support@domnest.app",
};

export const footerLinks: SidebarNavItem[] = [
  {
    title: "Company",
    items: [
      { title: "About", href: "#" },
      { title: "Enterprise", href: "#" },
      { title: "Terms", href: "/terms" },
      { title: "Privacy", href: "/privacy" },
    ],
  },
  {
    title: "Product",
    items: [
      { title: "DNS Management", href: "#" },
      { title: "SSL Monitoring", href: "#" },
      { title: "Domain Transfer", href: "#" },
      { title: "Uptime Monitoring", href: "#" },
    ],
  },
  {
    title: "Support",
    items: [
      { title: "Help Center", href: "#" },
      { title: "API Reference", href: "#" },
      { title: "Status Page", href: "#" },
      { title: "Contact", href: "#" },
    ],
  },
];
