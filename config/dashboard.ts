import { SidebarNavItem } from "types";

export const sidebarLinks: SidebarNavItem[] = [
  {
    title: "MENU",
    items: [
      { href: "/dashboard", icon: "dashboard", title: "Dashboard" },
      {
        href: "/dashboard/ssl",
        icon: "shield",
        title: "SSL Monitor",
      },
      {
        href: "/dashboard/health",
        icon: "clock",
        title: "Health & Analytics",
      },
   
   
      
     
    ],
  },
  {
    title: "OPTIONS",
    items: [
      { href: "/", icon: "home", title: "Homepage" },
      { href: "/dashboard/settings", icon: "settings", title: "Settings" },
      
      {
        href: "#",
        icon: "messages",
        title: "Support",
        disabled: false,
      },
    ],
  },
];
