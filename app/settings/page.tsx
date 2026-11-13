"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AppShell8 from "@/components/AppShell8";
import { useTheme } from "@/components/ThemeProvider";
import { type SupportedLanguage } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import {
  Sun,
  Moon,
  Laptop,
  Languages,
  Volume2,
  Lock,
  ArrowLeft,
  Check,
  RotateCcw,
  Sliders,
  Sparkles,
} from "lucide-react";

const LANGUAGES: { id: SupportedLanguage; label: string; native: string }[] = [
  { id: "hi", label: "Hindi", native: "हिन्दी" },
  { id: "en", label: "English", native: "English" },
  { id: "ta", label: "Tamil", native: "தமிழ்" },
  { id: "te", label: "Telugu", native: "తెలుగు" },
  { id: "bn", label: "Bengali", native: "বাংলা" },
];

export default function SettingsPage() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>("hi");
  const [speechSpeed, setSpeechSpeed] = useState<"0.8" | "1.0" | "1.2">("1.0");
  const [savedNotification, setSavedNotification] = useState(false);

  // Load language preference from localStorage if present
  useEffect(() => {
    try {
      const stored = localStorage.getItem("samjhao_default_language");
      if (stored && ["hi", "en", "ta", "te", "bn"].includes(stored)) {
        setSelectedLang(stored as SupportedLanguage);
      }
      const storedSpeed = localStorage.getItem("samjhao_speech_speed");
      if (storedSpeed && ["0.8", "1.0", "1.2"].includes(storedSpeed)) {
        setSpeechSpeed(storedSpeed as "0.8" | "1.0" | "1.2");
      }
    } catch {
      // ignore
    }
  }, []);

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setSelectedLang(lang);
    try {
      localStorage.setItem("samjhao_default_language", lang);
      setSavedNotification(true);
      setTimeout(() => setSavedNotification(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleSpeedChange = (speed: "0.8" | "1.0" | "1.2") => {
    setSpeechSpeed(speed);
    try {
      localStorage.setItem("samjhao_speech_speed", speed);
      setSavedNotification(true);
      setTimeout(() => setSavedNotification(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleResetPreferences = () => {
    setTheme("system");
    setSelectedLang("hi");
    setSpeechSpeed("1.0");
    try {
      localStorage.removeItem("samjhao_default_language");
      localStorage.removeItem("samjhao_speech_speed");
      setSavedNotification(true);
      setTimeout(() => setSavedNotification(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <AppShell8 activeTab="settings">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
        {/* Back Link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Explainer
          </Link>
        </div>

        {/* Page Header */}
        <div className="flex items-start justify-between pb-4 border-b border-gray-200 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-50 dark:bg-neutral-900 text-blue-600 dark:text-blue-400">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif text-gray-950 dark:text-white">
                Settings & Preferences (सेटिंग्स)
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Customize appearance, explanation language, and voice options
              </p>
            </div>
          </div>

          {savedNotification && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 animate-in fade-in">
              Saved ✓
            </span>
          )}
        </div>

        {/* 1. Theme / Appearance */}
        <section className="bg-white dark:bg-neutral-950 p-6 rounded-2xl border border-gray-200/80 dark:border-neutral-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
              {resolvedTheme === "dark" ? (
                <Moon className="w-4 h-4 text-blue-500" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
              Appearance / Theme
            </label>
            <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
              Active: {theme}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5 p-1 bg-gray-100 dark:bg-neutral-900 rounded-xl border border-gray-200/60 dark:border-neutral-800">
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={cn(
                "flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-medium transition-all",
                theme === "light"
                  ? "bg-white text-gray-900 shadow-sm font-semibold"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              )}
            >
              <Sun className="w-4 h-4 text-amber-500" />
              <span>Light</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={cn(
                "flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-medium transition-all",
                theme === "dark"
                  ? "bg-black text-white shadow-sm font-semibold border border-neutral-700"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              )}
            >
              <Moon className="w-4 h-4 text-blue-400" />
              <span>Dark (OLED)</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme("system")}
              className={cn(
                "flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-medium transition-all",
                theme === "system"
                  ? "bg-white dark:bg-neutral-800 text-gray-900 dark:text-white shadow-sm font-semibold"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              )}
            >
              <Laptop className="w-4 h-4 text-gray-500" />
              <span>System</span>
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Dark theme uses true `#000000` pitch black to save battery on OLED & AMOLED mobile screens.
          </p>
        </section>

        {/* 2. Default Language */}
        <section className="bg-white dark:bg-neutral-950 p-6 rounded-2xl border border-gray-200/80 dark:border-neutral-800 shadow-xs space-y-4">
          <label className="text-sm font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
            <Languages className="w-4 h-4 text-purple-600" />
            Default Explanation Language
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {LANGUAGES.map((l) => {
              const isSelected = selectedLang === l.id;
              return (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => handleLanguageChange(l.id)}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition-all text-left",
                    isSelected
                      ? "bg-blue-50 dark:bg-neutral-900 border-blue-500 text-blue-700 dark:text-blue-300 font-semibold shadow-xs"
                      : "border-gray-200 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-950 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-neutral-700"
                  )}
                >
                  <div>
                    <div className="font-bold text-sm">{l.native}</div>
                    <div className="text-[11px] opacity-75">{l.label}</div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            This will be pre-selected every time you open Samjhao to read a document.
          </p>
        </section>

        {/* 3. Text-to-Speech Voice Settings */}
        <section className="bg-white dark:bg-neutral-950 p-6 rounded-2xl border border-gray-200/80 dark:border-neutral-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
              <Volume2 className="w-4 h-4 text-blue-600" />
              Voice Reading Speed
            </label>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {speechSpeed === "0.8" ? "Slower" : speechSpeed === "1.0" ? "Normal" : "Faster"}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 p-1 bg-gray-100 dark:bg-neutral-900 rounded-xl border border-gray-200/60 dark:border-neutral-800">
            {(["0.8", "1.0", "1.2"] as const).map((spd) => (
              <button
                key={spd}
                type="button"
                onClick={() => handleSpeedChange(spd)}
                className={cn(
                  "py-2.5 rounded-lg text-xs font-medium transition-all text-center",
                  speechSpeed === spd
                    ? "bg-white dark:bg-neutral-800 text-blue-600 dark:text-blue-400 shadow-xs font-bold"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                {spd}x {spd === "1.0" ? "(Normal)" : spd === "0.8" ? "(Slow)" : "(Fast)"}
              </button>
            ))}
          </div>
        </section>

        {/* 4. Privacy & Reset */}
        <section className="bg-white dark:bg-neutral-950 p-6 rounded-2xl border border-gray-200/80 dark:border-neutral-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
            <Lock className="w-4 h-4 text-emerald-600" />
            Storage & Data Policy
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            Samjhao never stores your documents in any database or cloud disk. Only your theme and language preference are saved on your local browser.
          </p>

          <button
            type="button"
            onClick={handleResetPreferences}
            className="flex items-center gap-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:underline pt-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset all preferences to default
          </button>
        </section>

        {/* Return Button */}
        <div className="pt-2">
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm shadow-blue-600/25"
          >
            ← Back to Explainer
          </Link>
        </div>
      </div>
    </AppShell8>
  );
}
