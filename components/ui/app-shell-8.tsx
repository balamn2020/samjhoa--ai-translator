"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FileText,
  Sparkles,
  Info,
  Sun,
  Moon,
  Sliders,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/ThemeProvider";

export interface AppShellTabItem {
  id: string;
  label: string;
  labelHi?: string;
  icon: React.ElementType;
  href: string;
  description?: string;
}

export interface AppShell8Props {
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  items?: AppShellTabItem[];
  brandName?: string;
  brandTagline?: string;
  className?: string;
}

export const DEFAULT_SHELL_TABS: AppShellTabItem[] = [
  {
    id: "explain",
    label: "Explainer",
    labelHi: "समझाओ",
    icon: FileText,
    href: "/",
    description: "Read & simplify official notices, bills and agreements",
  },
  {
    id: "samples",
    label: "Samples",
    labelHi: "नमूने",
    icon: Sparkles,
    href: "/#samples-section",
    description: "Try real-world bank, utility, and notice examples",
  },
  {
    id: "about",
    label: "About",
    labelHi: "परिचय",
    icon: Info,
    href: "/about",
    description: "Learn about mission, scam protection, and privacy",
  },
  {
    id: "settings",
    label: "Settings",
    labelHi: "सेटिंग्स",
    icon: Sliders,
    href: "/settings",
    description: "Customize theme, language, and audio preferences",
  },
];

export default function AppShell8({
  children,
  activeTab,
  onTabChange,
  items = DEFAULT_SHELL_TABS,
  brandName = "Samjhao",
  brandTagline = "Understand any official document",
  className,
}: AppShell8Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, toggleTheme } = useTheme();

  // Determine active tab based on activeTab prop or current pathname
  const currentTab =
    activeTab ||
    (pathname === "/about"
      ? "about"
      : pathname === "/settings"
      ? "settings"
      : "explain");

  const handleTabClick = (e: React.MouseEvent, tab: AppShellTabItem) => {
    onTabChange?.(tab.id);

    if (tab.id === "samples" && pathname === "/") {
      e.preventDefault();
      document.getElementById("samples-section")?.scrollIntoView({ behavior: "smooth" });
    } else if (tab.id === "explain" && pathname === "/") {
      // already on home page, allow callback to reset view
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen bg-gradient-to-b from-blue-50/60 via-white to-gray-50 dark:from-black dark:via-black dark:to-black flex flex-col md:flex-row text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200",
        className
      )}
    >
      {/* ── Desktop & Tablet Sidebar (md and above) ───────────────────── */}
      <aside className="hidden md:flex md:w-64 lg:w-72 flex-col justify-between border-r border-gray-200/80 dark:border-neutral-800 bg-white/95 dark:bg-black backdrop-blur-md p-5 sticky top-0 h-screen z-30 shadow-xs">
        {/* Brand / Logo */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-1">
            <Link
              href="/"
              className="flex items-center gap-3 group transition-opacity hover:opacity-90"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                स
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-2xl font-bold tracking-tight text-gray-950 dark:text-white font-calligraphy">
                    {brandName}
                  </h1>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-blue-50 dark:bg-neutral-900 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-neutral-700">
                    AI
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                  {brandTagline}
                </p>
              </div>
            </Link>

            {/* Quick theme toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              title={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
              className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-900 transition-colors"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-gray-600" />
              )}
            </button>
          </div>

          {/* Nav items */}
          <nav className="space-y-1.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 px-3 pb-1">
              Navigation
            </div>
            {items.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  onClick={(e) => handleTabClick(e, tab)}
                  className={cn(
                    "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group",
                    isActive
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20 font-semibold"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-neutral-900 hover:text-gray-950 dark:hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        "w-4 h-4 transition-transform group-hover:scale-110",
                        isActive ? "text-white" : "text-gray-500 dark:text-gray-400"
                      )}
                    />
                    <span>{tab.label}</span>
                    {tab.labelHi && (
                      <span
                        className={cn(
                          "text-xs opacity-75 font-normal",
                          isActive ? "text-blue-100" : "text-gray-400 dark:text-gray-500"
                        )}
                      >
                        ({tab.labelHi})
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer - Settings Page Link */}
        <div className="pt-4 border-t border-gray-100 dark:border-neutral-800">
          <Link
            href="/settings"
            className={cn(
              "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border transition-colors text-sm font-medium",
              currentTab === "settings"
                ? "bg-blue-600 text-white border-blue-600 shadow-sm font-semibold"
                : "border-gray-200 dark:border-neutral-800 bg-gray-50/80 dark:bg-neutral-950/80 hover:bg-gray-100 dark:hover:bg-neutral-900 text-gray-700 dark:text-gray-200"
            )}
          >
            <div className="flex items-center gap-2.5">
              <Sliders className={cn("w-4 h-4", currentTab === "settings" ? "text-white" : "text-blue-600 dark:text-blue-400")} />
              <span>Settings Bar</span>
            </div>
            <span className={cn("text-xs", currentTab === "settings" ? "text-blue-100" : "text-gray-400")}>
              Configure →
            </span>
          </Link>
        </div>
      </aside>

      {/* ── Main Content Area ─────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 pb-24 md:pb-8">
        {/* Mobile Header (small screens only) */}
        <header className="md:hidden sticky top-0 z-20 flex items-center justify-between border-b border-gray-200/80 dark:border-neutral-800 bg-white/90 dark:bg-black/90 backdrop-blur-md px-4 py-3">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
              स
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-950 dark:text-white font-calligraphy leading-none">
                {brandName}
              </h1>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight mt-0.5">
                {brandTagline}
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-1.5">
            {/* Quick theme toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              title={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
              className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-900 transition-colors"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-gray-600" />
              )}
            </button>

            {/* Settings Link */}
            <Link
              href="/settings"
              title="Open settings"
              className={cn(
                "p-2 rounded-xl transition-colors",
                currentTab === "settings"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-900"
              )}
            >
              <Sliders className={cn("w-4 h-4", currentTab === "settings" ? "text-white" : "text-blue-600 dark:text-blue-400")} />
            </Link>
          </div>
        </header>

        {/* Content body */}
        <main className="flex-1 w-full">{children}</main>
      </div>

      {/* ── Mobile Adaptive Bottom Tab Bar (sm screens only) ───────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-lg border-t border-gray-200/90 dark:border-neutral-800 shadow-lg px-2 py-1.5 flex items-center justify-around safe-bottom">
        {items.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <Link
              key={tab.id}
              href={tab.href}
              onClick={(e) => handleTabClick(e, tab)}
              className={cn(
                "flex-1 flex flex-col items-center justify-center py-1 px-1.5 rounded-xl text-[11px] font-medium transition-all relative",
                isActive
                  ? "text-blue-600 dark:text-blue-400 font-bold"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              )}
            >
              <div
                className={cn(
                  "p-1.5 rounded-xl transition-all mb-0.5",
                  isActive
                    ? "bg-blue-100/80 dark:bg-neutral-900 text-blue-700 dark:text-blue-300 scale-110"
                    : "text-gray-500 dark:text-gray-400"
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="truncate max-w-[65px] text-[10px] leading-tight">
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 mt-0.5 animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
