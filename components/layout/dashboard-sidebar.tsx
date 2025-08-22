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
                "relative z-40 hidden h-screen border-r border-border bg-card/50 transition-all duration-500 ease-in-out md:block",
                isSidebarExpanded ? "w-[260px] xl:w-[280px]" : "w-[72px]",
              )}
            >
            <div className="flex h-full max-h-screen flex-1 flex-col">
              {/* Header */}
              <div className="flex h-16 items-center border-b border-border px-4 lg:h-[70px] lg:px-6">
                {isSidebarExpanded && (
                  <Link 
                    href="/" 
                    className="flex items-center gap-2 transition-all duration-300 hover:opacity-80"
                  >
                    <Image
                      src="/DomNest.png"
                      alt="Domain Nest Logo"
                      width={160}
                      height={40}
                      className="h-9 w-auto max-w-[160px] transition-all duration-200"
                    />
                  </Link>
                )}

                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "size-9 transition-all duration-200 hover:bg-muted/50 hover:text-foreground",
                    !isSidebarExpanded && "mx-auto",
                    isSidebarExpanded ? "ml-auto" : ""
                  )}
                  onClick={toggleSidebar}
                >
                  {isSidebarExpanded ? (
                    <PanelLeftClose
                      size={18}
                      className="stroke-foreground/60 transition-colors duration-200"
                    />
                  ) : (
                    <PanelRightClose
                      size={18}
                      className="stroke-foreground/60 transition-colors duration-200"
                    />
                  )}
                </Button>
              </div>

              {/* Navigation */}
              <nav className="flex flex-1 flex-col gap-8 px-3 py-6">
                {links.map((section, sectionIndex) => (
                  <section
                    key={section.title}
                    className="flex flex-col gap-2"
                  >
                    {isSidebarExpanded ? (
                      <p className="px-3 text-xs font-semibold text-foreground/80 uppercase tracking-wide transition-all delay-75 duration-200">
                        {section.title}
                      </p>
                    ) : (
                      <div className="h-4" />
                    )}
                    
                    <div className="space-y-1">
                      {section.items.map((item, index) => {
                        const Icon = Icons[item.icon || "arrowRight"];
                        const isActive = path === item.href;
                        const isSupport = item.href === "#" && item.title === "Support";
                        
                        const handleClick = isSupport 
                          ? () => setSupportModalOpen(true)
                          : undefined;

                        const itemProps = {
                          className: cn(
                            "group relative flex w-full items-center gap-3 rounded-lg font-medium",
                            "transition-all duration-200 ease-out border border-transparent",
                            isSidebarExpanded ? "px-3 py-2.5 text-sm" : "justify-center py-3 text-sm",
                            isActive
                              ? "text-primary border-primary/20 bg-primary/5" 
                              : "text-foreground/70 hover:text-foreground hover:border-border/50",
                            item.disabled &&
                              "cursor-not-allowed opacity-50 hover:border-transparent hover:text-foreground/70",
                          ),
                          style: {
                            transitionDelay: isSidebarExpanded ? `${index * 20}ms` : '0ms'
                          }
                        };

                        const ItemContent = () => (
                          <>
                            {/* Active indicator */}
                            {isActive && (
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r-full" />
                            )}
                            
                            <span className={cn(
                              "flex shrink-0 items-center justify-center transition-all duration-200",
                              isSidebarExpanded ? "size-5" : "size-5"
                            )}>
                              <Icon className={cn(
                                "size-4 transition-colors duration-200", 
                                isActive ? "text-primary" : ""
                              )} />
                            </span>
                            
                            {isSidebarExpanded && (
                              <div className="flex w-full items-center justify-between overflow-hidden transition-all duration-200">
                                <span className="truncate transition-all duration-200">{item.title}</span>
                                {item.badge && (
                                  <Badge className="ml-auto flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-all duration-200">
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
                                sideOffset={12}
                              >
                                {item.title}
                                {item.badge && (
                                  <span className="ml-2 inline-flex size-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground font-medium">
                                    {item.badge}
                                  </span>
                                )}
                              </TooltipContent>
                            </Tooltip>
                          );
                        }
                      })}
                    </div>
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
            className="size-10 shrink-0 transition-all duration-200 hover:bg-secondary/10 md:hidden"
          >
            <Menu className="size-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0">
          <ScrollArea className="h-full overflow-y-auto">
            <div className="flex h-screen flex-col">
              <nav className="flex flex-1 flex-col gap-y-8 p-6 text-lg font-medium">
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
                    className="flex flex-col gap-2"
                  >
                    <p className="px-1 text-xs font-semibold text-foreground/80 uppercase tracking-wide">
                      {section.title}
                    </p>

                    <div className="space-y-1">
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
                            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left font-medium text-base",
                            "transition-all duration-200 ease-out border border-transparent",
                            isActive
                              ? "text-primary border-primary/20 bg-primary/5"
                              : "text-foreground/70 hover:text-foreground hover:border-border/50",
                            item.disabled &&
                              "cursor-not-allowed opacity-50 hover:border-transparent hover:text-foreground/70",
                          )
                        };

                        const ItemContent = () => (
                          <>
                            {isActive && (
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-primary rounded-r-full" />
                            )}
                            <Icon className="size-5 shrink-0" />
                            <span className="truncate">{item.title}</span>
                            {item.badge && (
                              <Badge className="ml-auto flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-medium">
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
                    </div>
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