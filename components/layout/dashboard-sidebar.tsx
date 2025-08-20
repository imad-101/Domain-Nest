"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NavItem, SidebarNavItem } from "@/types";
import { Menu, PanelLeftClose, PanelRightClose } from "lucide-react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Icons } from "@/components/shared/icons";
import { SupportModal } from "@/components/modals/support-modal";

interface DashboardSidebarProps {
  links: SidebarNavItem[];
}

export function DashboardSidebar({ links }: DashboardSidebarProps) {
  const path = usePathname();
  const [supportModalOpen, setSupportModalOpen] = useState(false);

  // NOTE: Use this if you want save in local storage -- Credits: Hosna Qasmei
  //
  // const [isSidebarExpanded, setIsSidebarExpanded] = useState(() => {
  //   if (typeof window !== "undefined") {
  //     const saved = window.localStorage.getItem("sidebarExpanded");
  //     return saved !== null ? JSON.parse(saved) : true;
  //   }
  //   return true;
  // });

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     window.localStorage.setItem(
  //       "sidebarExpanded",
  //       JSON.stringify(isSidebarExpanded),
  //     );
  //   }
  // }, [isSidebarExpanded]);

  const { isTablet } = useMediaQuery();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(!isTablet);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  useEffect(() => {
    setIsSidebarExpanded(!isTablet);
  }, [isTablet]);

  return (
    <TooltipProvider delayDuration={200}>
      <div className="relative z-40">
        <div className="sticky top-0 h-screen">
          <ScrollArea className="h-full overflow-y-auto border-r border-border">
            <aside
              className={cn(
                "relative z-40 hidden h-screen border-r bg-background transition-all duration-500 ease-in-out md:block",
                isSidebarExpanded ? "w-[240px] xl:w-[280px]" : "w-[80px]",
              )}
            >
            <div className="flex h-full max-h-screen flex-1 flex-col gap-3">
              <div className="flex h-16 items-center border-b border-border p-5 lg:h-[70px]">
                {isSidebarExpanded && (
                  <Link href="/" className="flex items-center gap-2 transition-all duration-200 hover:opacity-80">
                    <Image
                      src="/DomNest.png"
                      alt="Domain Nest Logo"
                      width={160}
                      height={40}
                      className="h-9 w-auto max-w-[160px] transition-all duration-200"
                    />
                  </Link>
                ) }

                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-auto size-10 transition-all duration-200 ease-out hover:scale-105 hover:bg-secondary/10 active:scale-95 lg:size-9"
                  onClick={toggleSidebar}
                >
                  {isSidebarExpanded ? (
                    <PanelLeftClose
                      size={20}
                      className="stroke-muted-foreground transition-all duration-200"
                    />
                  ) : (
                    <PanelRightClose
                      size={20}
                      className="stroke-muted-foreground transition-all duration-200"
                    />
                  )}
                  <span className="sr-only">Toggle Sidebar</span>
                </Button>
              </div>

              <nav className="flex flex-1 flex-col gap-10 px-5 pt-5">
                {links.map((section) => (
                  <section
                    key={section.title}
                    className="flex flex-col gap-1"
                  >
                    {isSidebarExpanded ? (
                      <p className="px-1 text-sm font-medium text-muted-foreground transition-all delay-75 duration-200">
                        {section.title}
                      </p>
                    ) : (
                      <div className="h-5" />
                    )}
                    {section.items.map((item, index) => {
                      const Icon = Icons[item.icon || "arrowRight"];
                      const isActive = path === item.href;
                      const isSupport = item.href === "#" && item.title === "Support";
                      
                      const handleClick = isSupport 
                        ? () => setSupportModalOpen(true)
                        : undefined;

                      const itemProps = {
                        className: cn(
                          "group relative flex w-full items-center gap-4 rounded-lg font-medium",
                          "transform-gpu transition-all duration-200 ease-out",
                          "hover:translate-x-1 active:translate-x-0",
                          isSidebarExpanded ? "p-4 text-base" : "justify-center py-4 text-sm",
                          isActive
                            ? "translate-x-1 border border-secondary/30 bg-secondary/15 text-secondary shadow-sm"
                            : "hover:bg-secondary/8 text-muted-foreground hover:border hover:border-secondary/25 hover:text-foreground",
                          item.disabled &&
                            "cursor-not-allowed opacity-50 hover:translate-x-0 hover:bg-transparent hover:text-muted-foreground",
                        ),
                        style: {
                          transitionDelay: isSidebarExpanded ? `${index * 25}ms` : '0ms'
                        }
                      };

                      const ItemContent = () => (
                        <>
                          <span className={cn(
                            "flex shrink-0 items-center justify-center transition-all duration-200",
                            isSidebarExpanded ? "size-6" : "size-6"
                          )}>
                            <Icon className="size-5" />
                          </span>
                          {isSidebarExpanded && (
                            <div className="delay-50 flex w-full items-center justify-between overflow-hidden transition-all duration-200">
                              <span className="truncate transition-all duration-200">{item.title}</span>
                              {item.badge && (
                                <Badge className="ml-auto flex size-6 shrink-0 items-center justify-center rounded-full text-xs transition-all duration-200">
                                  {item.badge}
                                </Badge>
                              )}
                            </div>
                          )}
                        </>
                      );

                      if (isSidebarExpanded) {
                        return isSupport ? (
                          <button
                            key={item.title}
                            onClick={handleClick}
                            {...itemProps}
                          >
                            <ItemContent />
                          </button>
                        ) : (
                          <Link
                            key={item.title}
                            href={item.disabled ? "#" : item.href}
                            {...itemProps}
                          >
                            <ItemContent />
                          </Link>
                        );
                      } else {
                        return (
                          <Tooltip key={item.title} delayDuration={200}>
                            <TooltipTrigger asChild>
                              {isSupport ? (
                                <button
                                  onClick={handleClick}
                                  {...itemProps}
                                >
                                  <ItemContent />
                                </button>
                              ) : (
                                <Link
                                  href={item.disabled ? "#" : item.href}
                                  {...itemProps}
                                >
                                  <ItemContent />
                                </Link>
                              )}
                            </TooltipTrigger>
                            <TooltipContent 
                              side="right" 
                              className="z-50 rounded-md border bg-popover px-3 py-2 text-sm font-medium text-popover-foreground shadow-md"
                              sideOffset={10}
                            >
                              {item.title}
                              {item.badge && (
                                <span className="ml-2 inline-flex size-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                                  {item.badge}
                                </span>
                              )}
                            </TooltipContent>
                          </Tooltip>
                        );
                      }
                    })}
                  </section>
                ))}
              </nav>

            </div>
          </aside>
        </ScrollArea>
        <SupportModal 
          open={supportModalOpen} 
          onOpenChange={setSupportModalOpen} 
        />
      </div>
      </div>
    </TooltipProvider>
  );
}

export function MobileSheetSidebar({ links }: DashboardSidebarProps) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const { isSm, isMobile } = useMediaQuery();

  if (isSm || isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="size-10 shrink-0 transition-all duration-200 ease-out hover:scale-105 active:scale-95 md:hidden"
          >
            <Menu className="size-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0">
          <ScrollArea className="h-full overflow-y-auto">
            <div className="flex h-screen flex-col">
              <nav className="flex flex-1 flex-col gap-y-10 p-7 text-lg font-medium">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-xl font-semibold transition-all duration-200 hover:opacity-80"
                >
                  <Image
                    src="/DomNest.png"
                    alt="Domain Nest Logo"
                    width={160}
                    height={40}
                    className="h-9 w-auto max-w-[160px]"
                  />
                </Link>

                {links.map((section, sectionIndex) => (
                  <section
                    key={section.title}
                    className="flex flex-col gap-1"
                    style={{ animationDelay: `${sectionIndex * 50}ms` }}
                  >
                    <p className="mb-2 text-sm font-medium text-muted-foreground">
                      {section.title}
                    </p>

                    {section.items.map((item, itemIndex) => {
                      const Icon = Icons[item.icon || "arrowRight"];
                      const isActive = path === item.href;
                      const isSupport = item.href === "#" && item.title === "Support";
                      
                      const handleClick = isSupport 
                        ? () => {
                            setSupportModalOpen(true);
                            setOpen(false);
                          }
                        : () => {
                            if (!item.disabled) setOpen(false);
                          };

                      const itemProps = {
                        className: cn(
                          "flex w-full items-center gap-4 rounded-lg p-3 text-left font-medium",
                          "transform-gpu transition-all duration-200 ease-out",
                          "hover:translate-x-1 active:translate-x-0",
                          "hover:bg-muted hover:text-accent-foreground",
                          isActive
                            ? "translate-x-1 bg-muted text-foreground"
                            : "text-muted-foreground",
                          item.disabled &&
                            "cursor-not-allowed opacity-80 hover:translate-x-0 hover:bg-transparent hover:text-muted-foreground",
                        ),
                        style: { animationDelay: `${itemIndex * 25}ms` }
                      };

                      const ItemContent = () => (
                        <>
                          <Icon className="size-6 shrink-0" />
                          <span className="truncate text-base">{item.title}</span>
                          {item.badge && (
                            <Badge className="ml-auto flex size-6 shrink-0 items-center justify-center rounded-full text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      );

                      return isSupport ? (
                        <button
                          key={item.title}
                          onClick={handleClick}
                          {...itemProps}
                        >
                          <ItemContent />
                        </button>
                      ) : (
                        <Link
                          key={item.title}
                          onClick={handleClick}
                          href={item.disabled ? "#" : item.href}
                          {...itemProps}
                        >
                          <ItemContent />
                        </Link>
                      );
                    })}
                  </section>
                ))}

           
              </nav>
            </div>
          </ScrollArea>
          <SupportModal 
            open={supportModalOpen} 
            onOpenChange={setSupportModalOpen} 
          />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="flex size-9 animate-pulse rounded-lg bg-muted md:hidden" />
  );
}