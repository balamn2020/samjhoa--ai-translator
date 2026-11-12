"use client";

import React, { useState } from "react";
import {
  Sun,
  Moon,
  Laptop,
  Languages,
  Volume2,
  Lock,
  Info,
  X,
  Check,
  RotateCcw,
  Sliders,
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import type { SupportedLanguage } from "@/lib/schemas";
import { cn } from "@/lib/utils";

interface SettingsBarProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage?: SupportedLanguage | null;
  onLanguageChange?: (lang: SupportedLanguage) => void;
  onOpenAbout?: () => void;
  onResetApp?: () => void;
}

const LANGUAGES: { id: SupportedLanguage; label: string; native: string }[] = [
  { id: "hi", label: "Hindi", native: "हिन्दी" },
  { id: "en", label: "English", native: "English" },
  { id: "ta", label: "Tamil", native: "தமிழ்" },
  { id: "te", label: "Telugu", native: "తెలుగు" },
  { id: "bn", label: "Bengali", native: "বাংলা" },
];

export default function SettingsBar({
  isOpen,
  onClose,
  currentLanguage = "hi",
  onLanguageChange,
  onOpenAbout,
  onResetApp,
}: SettingsBarProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [speechSpeed, setSpeechSpeed] = useState<"0.8" | "1.0" | "1.2">("1.0");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 dark:bg-black/85 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-black text-gray-900 dark:text-gray-100 w-full max-w-md h-full shadow-2xl border-l border-gray-200 dark:border-neutral-800 flex flex-col justify-between animate-in slide-in-from-right duration-300">
        {/* Top Header */}
        <div className="p-5 border-b border-gray-100 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-neutral-900 text-blue-600 dark:text-blue-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Settings & Preferences</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Customize appearance, language & audio
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Settings Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* 1. Theme / Appearance */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold flex items-center gap-2">
                {resolvedTheme === "dark" ? (
                  <Moon className="w-4 h-4 text-blue-500" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-500" />
                )}
                Appearance / Theme
              </label>
              <span className="text-xs text-gray-500 capitalize">
                Currently: {theme}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 p-1 bg-gray-100 dark:bg-neutral-950 rounded-xl border border-gray-200/60 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={cn(
                  "flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-medium transition-all",
                  theme === "light"
                    ? "bg-white dark:bg-neutral-850 text-gray-900 dark:text-white shadow-xs font-semibold"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
                )}
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Light</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={cn(
                  "flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-medium transition-all",
                  theme === "dark"
                    ? "bg-white dark:bg-neutral-850 text-gray-900 dark:text-white shadow-xs font-semibold"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
                )}
              >
                <Moon className="w-3.5 h-3.5 text-blue-500" />
                <span>Dark</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme("system")}
                className={cn(
                  "flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-medium transition-all",
                  theme === "system"
                    ? "bg-white dark:bg-neutral-850 text-gray-900 dark:text-white shadow-xs font-semibold"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
                )}
              >
                <Laptop className="w-3.5 h-3.5 text-gray-500" />
                <span>System</span>
              </button>
            </div>
          </div>

          {/* 2. Default Language */}
          <div className="space-y-3">
            <label className="text-sm font-semibold flex items-center gap-2">
              <Languages className="w-4 h-4 text-purple-600" />
              Default Explanation Language
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {LANGUAGES.map((l) => {
                const isSelected = (currentLanguage || "hi") === l.id;
                return (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => onLanguageChange?.(l.id)}
                    className={cn(
                      "flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium transition-all text-left",
                      isSelected
                        ? "bg-blue-50 dark:bg-neutral-900 border-blue-500 text-blue-700 dark:text-blue-300 font-semibold"
                        : "border-gray-200 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-950 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-neutral-700"
                    )}
                  >
                    <div>
                      <div className="font-semibold">{l.native}</div>
                      <div className="text-[10px] text-gray-400">({l.label})</div>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Audio / Read Aloud Speed */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-emerald-600" />
                Speech Synthesis Speed
              </label>
              <span className="text-xs text-gray-500">{speechSpeed}x</span>
            </div>

            <div className="grid grid-cols-3 gap-2 p-1 bg-gray-100 dark:bg-neutral-950 rounded-xl border border-gray-200/60 dark:border-neutral-800">
              {(["0.8", "1.0", "1.2"] as const).map((spd) => (
                <button
                  key={spd}
                  type="button"
                  onClick={() => setSpeechSpeed(spd)}
                  className={cn(
                    "py-2 rounded-lg text-xs font-medium transition-all text-center",
                    speechSpeed === spd
                      ? "bg-white dark:bg-neutral-850 text-gray-900 dark:text-white shadow-xs font-semibold"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
                  )}
                >
                  {spd === "0.8" ? "Gentle (0.8x)" : spd === "1.0" ? "Normal (1.0x)" : "Fast (1.2x)"}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Privacy & Ephemeral Mode */}
          <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-neutral-950 border border-emerald-100 dark:border-neutral-800 space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-emerald-900 dark:text-emerald-300 text-xs">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Strict Privacy Active</span>
            </div>
            <p className="text-[11px] text-emerald-800/80 dark:text-emerald-400 leading-relaxed">
              Every document you upload or text you paste is analyzed strictly in temporary memory and never logged, indexed, or saved to any database.
            </p>
          </div>

          {/* 5. Quick Links */}
          <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-neutral-800">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAbout?.();
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-900 text-sm font-medium transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <Info className="w-4 h-4 text-blue-600" />
                <span>About this website</span>
              </div>
              <span className="text-xs text-gray-400">Read overview →</span>
            </button>

            {onResetApp && (
              <button
                type="button"
                onClick={() => {
                  onResetApp();
                  onClose();
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-neutral-800 hover:bg-red-50 dark:hover:bg-neutral-900 text-sm font-medium text-red-600 dark:text-red-400 transition-colors text-left"
              >
                <div className="flex items-center gap-2.5">
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset & Start Over</span>
                </div>
                <span className="text-xs text-red-400">Clear view</span>
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-neutral-800 text-center text-xs text-gray-400">
          समझाओ (Samjhao) • Powered by Gemini AI
        </div>
      </div>
    </div>
  );
}
