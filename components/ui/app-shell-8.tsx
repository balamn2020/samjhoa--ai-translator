"use client";

import React, { useState } from "react";
import {
  FileText,
  Sparkles,
  ShieldCheck,
  Lock,
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
  badge?: string;
  badgeColor?: string;
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
  onOpenSettings?: () => void;
  onOpenAbout?: () => void;
}

export const DEFAULT_SHELL_TABS: AppShellTabItem[] = [
  {
    id: "explain",
    label: "Explainer",
    labelHi: "समझाओ",
    icon: FileText,
    badge: "Core",
    badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300",
    description: "Read & simplify official notices, bills and agreements",
  },
  {
    id: "samples",
    label: "Samples",
    labelHi: "नमूने",
    icon: Sparkles,
    badge: "Interactive",
    badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300",
    description: "Try real-world bank, utility, and notice examples",
  },
  {
    id: "safety",
    label: "Safety & Scams",
    labelHi: "सुरक्षा",
    icon: ShieldCheck,
    badge: "Protection",
    badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300",
    description: "Learn how Samjhao detects phishing and fake notices",
  },
  {
    id: "privacy",
    label: "Privacy",
    labelHi: "गोपनीयता",
    icon: Lock,
    badge: "Zero-Store",
    badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300",
    description: "100% ephemeral: documents are analyzed once & erased",
  },
  {
    id: "about",
    label: "About",
    labelHi: "परिचय",
    icon: Info,
    badge: "Mission",
    badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300",
    description: "Learn about the mission, features, and creators of Samjhao",
  },
];

export default function AppShell8({
  children,
  activeTab = "explain",
  onTabChange,
  items = DEFAULT_SHELL_TABS,
  brandName = "समझाओ",
  brandTagline = "Understand any official document",
  className,
  onOpenSettings,
  onOpenAbout,
}: AppShell8Props) {
  const [currentTab, setCurrentTab] = useState<string>(activeTab);
  const [modalTab, setModalTab] = useState<AppShellTabItem | null>(null);
  const { resolvedTheme, toggleTheme } = useTheme();

  const handleSelectTab = (tabId: string) => {
    setCurrentTab(tabId);
    onTabChange?.(tabId);

    if (tabId === "about") {
      onOpenAbout?.();
      return;
    }

    if (tabId === "safety" || tabId === "privacy") {
      const item = items.find((i) => i.id === tabId);
      setModalTab(item || null);
    } else {
      setModalTab(null);
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
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-blue-500/20">
                स
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-xl font-bold tracking-tight text-gray-950 dark:text-white font-serif">
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
            </div>

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
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleSelectTab(tab.id)}
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

                  {tab.badge && (
                    <span
                      className={cn(
                        "text-[10px] font-semibold px-2 py-0.5 rounded-full border",
                        isActive
                          ? "bg-blue-700/80 text-white border-blue-500"
                          : tab.badgeColor || "bg-gray-100 dark:bg-neutral-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-neutral-800"
                      )}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer info & Settings Bar trigger */}
        <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-neutral-800">
          {/* Settings Bar Button */}
          {onOpenSettings && (
            <button
              type="button"
              onClick={onOpenSettings}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-neutral-800 bg-gray-50/80 dark:bg-neutral-950/80 hover:bg-gray-100 dark:hover:bg-neutral-900 text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Sliders className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Settings Bar</span>
              </div>
              <span className="text-xs text-gray-400">Configure →</span>
            </button>
          )}

          <div className="rounded-xl bg-gradient-to-br from-blue-50/80 to-indigo-50/50 dark:from-neutral-950 dark:to-neutral-950 p-3.5 border border-blue-100/80 dark:border-neutral-800 text-xs text-gray-600 dark:text-gray-300 space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-blue-900 dark:text-blue-200">
              <Lock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Zero-Retention Guarantee</span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
              Documents are processed directly in RAM and immediately erased. No database, no training logs.
            </p>
          </div>

          <div className="flex items-center justify-between px-2 text-[11px] text-gray-400 dark:text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Gemini 3.5 AI Online
            </span>
            <span>v1.0</span>
          </div>
        </div>
      </aside>

      {/* ── Main Content Area ─────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 pb-24 md:pb-8">
        {/* Mobile Header (small screens only) */}
        <header className="md:hidden sticky top-0 z-20 flex items-center justify-between border-b border-gray-200/80 dark:border-neutral-800 bg-white/90 dark:bg-black/90 backdrop-blur-md px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
              स
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-950 dark:text-white font-serif leading-none">
                {brandName}
              </h1>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight mt-0.5">
                {brandTagline}
              </p>
            </div>
          </div>

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

            {/* Settings trigger */}
            {onOpenSettings && (
              <button
                type="button"
                onClick={onOpenSettings}
                title="Open settings"
                className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-900 transition-colors"
              >
                <Sliders className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </button>
            )}
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
            <button
              key={tab.id}
              type="button"
              onClick={() => handleSelectTab(tab.id)}
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
            </button>
          );
        })}
      </nav>

      {/* ── Modal for Safety / Privacy Info Tab ────────────────────────── */}
      {modalTab && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/85 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-neutral-950 text-gray-900 dark:text-gray-100 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 dark:border-neutral-800 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-neutral-900 text-blue-600 dark:text-blue-400">
                  <modalTab.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">
                    {modalTab.label}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{modalTab.description}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalTab(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
              >
                ✕
              </button>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2.5 leading-relaxed bg-gray-50 dark:bg-neutral-900 p-4 rounded-xl border border-gray-100 dark:border-neutral-800">
              {modalTab.id === "safety" ? (
                <>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    🛡️ How Samjhao protects you against scams:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-xs text-gray-600 dark:text-gray-300">
                    <li>Flags fake lottery, prize notices, and impersonation.</li>
                    <li>Warns against unsolicited OTP, PIN, and CVV requests.</li>
                    <li>Detects pressure tactics and fake legal threats.</li>
                    <li>Always recommends verifying with official branch helplines.</li>
                  </ul>
                </>
              ) : (
                <>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    🔒 Zero Data Retention Policy:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-xs text-gray-600 dark:text-gray-300">
                    <li>Documents are analyzed exclusively in temporary memory.</li>
                    <li>No database storage or cloud bucket archival.</li>
                    <li>Your document text is never used to train public models.</li>
                    <li>Always mask Aadhaar / PAN numbers if possible for privacy.</li>
                  </ul>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => setModalTab(null)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
