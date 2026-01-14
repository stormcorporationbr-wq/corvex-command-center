"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Handshake,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Clients", href: "/clients", icon: Users },
  { name: "Partners", href: "/partners", icon: Handshake },
  { name: "Sales", href: "/sales", icon: Zap },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Desktop Floating Sidebar */}
      <aside
        className={cn(
          "hidden lg:block fixed top-4 left-4 bottom-4 z-40 transition-all duration-300",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className="h-full glass-glow border border-primary/20 rounded-2xl flex flex-col shadow-2xl shadow-primary/10 overflow-hidden">
          {/* Logo */}
          <div className="p-6 border-b border-border/50">
            <div className={cn(
              "flex items-center transition-all duration-300",
              isCollapsed ? "justify-center" : "gap-3"
            )}>
              {/* C0RVEX "O" Logo in CSS */}
              <div className="relative w-10 h-10 flex-shrink-0">
                <div className="absolute inset-0 rounded-full border-2 border-primary animate-glow"></div>
                <div className="absolute inset-2 rounded-full bg-primary/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-primary font-bold text-xl">0</span>
                </div>
              </div>

              {!isCollapsed && (
                <div className="overflow-hidden">
                  <h1 className="text-xl font-bold text-text-main tracking-tight whitespace-nowrap">
                    C0RVEX
                  </h1>
                  <p className="text-xs text-text-muted whitespace-nowrap">Command Center</p>
                </div>
              )}
            </div>
          </div>

          {/* Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "absolute -right-3 top-24 w-6 h-6 rounded-full bg-primary/20 border border-primary/30",
              "flex items-center justify-center hover:bg-primary/30 transition-all duration-300",
              "shadow-lg shadow-primary/20 hover:shadow-primary/40 z-50"
            )}
          >
            {isCollapsed ? (
              <ChevronRight className="text-primary" size={14} strokeWidth={2.5} />
            ) : (
              <ChevronLeft className="text-primary" size={14} strokeWidth={2.5} />
            )}
          </button>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  title={isCollapsed ? item.name : undefined}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                    "hover:bg-primary/10 hover:text-primary hover:scale-105",
                    isActive && "bg-primary/20 text-primary shadow-lg shadow-primary/30 border-l-2 border-primary",
                    isCollapsed && "justify-center px-2"
                  )}
                >
                  <Icon
                    size={20}
                    strokeWidth={isActive ? 2 : 1.5}
                    className={cn(
                      "transition-all duration-300 flex-shrink-0",
                      isActive && "animate-pulse-slow"
                    )}
                  />
                  {!isCollapsed && (
                    <span className="font-medium whitespace-nowrap">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border/50">
            <div className={cn(
              "glass-glow p-3 rounded-xl border border-primary/10",
              isCollapsed && "text-center"
            )}>
              {!isCollapsed ? (
                <>
                  <p className="text-xs text-text-muted">System Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse-slow shadow-lg shadow-primary/50"></div>
                    <span className="text-sm text-text-main">Online</span>
                  </div>
                </>
              ) : (
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse-slow shadow-lg shadow-primary/50 mx-auto"></div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Spacer for Desktop */}
      <div className={cn(
        "hidden lg:block transition-all duration-300",
        isCollapsed ? "w-28" : "w-72"
      )} />

      {/* Mobile Bottom Navigation Bar (Floating) */}
      <nav className="lg:hidden fixed bottom-4 left-4 right-4 z-50">
        <div className="glass-glow rounded-2xl border border-primary/20 shadow-2xl shadow-primary/20 p-2">
          <div className="flex items-center justify-around">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center gap-1 px-4 py-3 rounded-xl transition-all duration-300",
                    "hover:bg-primary/10 active:scale-95",
                    isActive
                      ? "bg-primary/20 text-primary shadow-lg shadow-primary/30"
                      : "text-text-muted hover:text-primary"
                  )}
                >
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2 : 1.5}
                    className={cn(
                      "transition-all duration-300",
                      isActive && "animate-pulse-slow"
                    )}
                  />
                  <span className={cn(
                    "text-[10px] font-medium transition-all duration-300",
                    isActive ? "opacity-100" : "opacity-70"
                  )}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
