"use client";

import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  FileText,
  ShieldCheck,
  AlertTriangle,
  Languages,
  Info,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface Mobile5NavItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ElementType;
  badge?: string;
  href?: string;
  onClick?: () => void;
}

export interface Mobile5Props {
  title?: string;
  subtitle?: string;
  className?: string;
  items?: Mobile5NavItem[];
  onActionClick?: () => void;
  actionLabel?: string;
}

const DEFAULT_NAV_ITEMS: Mobile5NavItem[] = [
  {
    id: "reader",
    label: "Document Explainer",
    description: "Upload and analyze notices, bills & agreements",
    icon: FileText,
    badge: "Core",
  },
  {
    id: "languages",
    label: "Supported Languages",
    description: "English, हिन्दी, தமிழ், తెలుగు, বাংলা",
    icon: Languages,
  },
  {
    id: "redflags",
    label: "Scam & Red Flag Guide",
    description: "How Samjhao flags phishing, threats & fraud",
    icon: AlertTriangle,
    badge: "Security",
  },
  {
    id: "privacy",
    label: "Privacy & Data Safety",
    description: "No data stored. Processed and immediately discarded.",
    icon: ShieldCheck,
  },
  {
    id: "disclaimer",
    label: "Legal Disclaimer",
    description: "AI summary assistance, not formal legal advice",
    icon: Info,
  },
];

export default function Mobile5({
  title = "समझाओ",
  subtitle = "Samjhao",
  className,
  items = DEFAULT_NAV_ITEMS,
  actionLabel = "Analyze Document",
  onActionClick,
}: Mobile5Props) {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent background scrolling when full-screen menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle ESC key to close menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <>
      {/* ── Top Bar ────────────────────────────────────────── */}
      <header
        className={cn(
          "sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 border-b border-gray-100 transition-all",
          className
        )}
      >
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo / Brand */}
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-sm shadow-blue-200">
              सं
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold text-lg text-gray-900 tracking-tight">
                {title}
              </span>
              <span className="text-xs text-gray-500 font-medium hidden sm:inline">
                {subtitle}
              </span>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60 ml-1">
              AI Explainer
            </span>
          </div>

          {/* Hamburger Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isOpen}
            className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 active:scale-95"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* ── Full-Screen Menu Overlay ────────────────────────── */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex flex-col bg-white/95 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200"
        >
          {/* Menu Top Bar */}
          <div className="h-14 px-4 max-w-lg mx-auto w-full flex items-center justify-between border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-blue-600 text-white font-bold text-sm">
                सं
              </span>
              <span className="font-bold text-lg text-gray-900">
                {title} {subtitle && `· ${subtitle}`}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
              className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto px-4 py-6 max-w-lg mx-auto w-full space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 px-3 mb-2">
              Navigation & Resources
            </p>

            {items.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    item.onClick?.();
                    setIsOpen(false);
                  }}
                  className="group flex items-center justify-between p-3.5 rounded-2xl hover:bg-blue-50/60 border border-transparent hover:border-blue-100 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 text-gray-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-semibold text-gray-900 group-hover:text-blue-900">
                          {item.label}
                        </span>
                        {item.badge && (
                          <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-700">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                </div>
              );
            })}

            {/* Privacy Box inside menu */}
            <div className="mt-6 p-4 rounded-2xl bg-green-50 border border-green-200/80">
              <div className="flex items-center gap-2 text-green-900 font-semibold text-sm">
                <ShieldCheck className="w-4 h-4 text-green-700" />
                <span>Zero Data Retention</span>
              </div>
              <p className="text-xs text-green-800/90 mt-1 leading-relaxed">
                Documents are processed in memory and discarded immediately. No logs, no account required.
              </p>
            </div>
          </div>

          {/* Menu Bottom Action Drawer */}
          <div className="p-4 border-t border-gray-100 max-w-lg mx-auto w-full space-y-3">
            <button
              type="button"
              onClick={() => {
                onActionClick?.();
                setIsOpen(false);
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-base shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{actionLabel}</span>
            </button>
            <p className="text-center text-[11px] text-gray-400">
              Samjhao v0.1 · Built for clear document accessibility
            </p>
          </div>
        </div>
      )}
    </>
  );
}
