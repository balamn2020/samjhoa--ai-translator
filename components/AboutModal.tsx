"use client";

import React from "react";
import {
  FileText,
  ShieldCheck,
  Lock,
  Languages,
  Sparkles,
  AlertTriangle,
  X,
  CheckCircle2,
  Heart,
} from "lucide-react";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/85 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-black text-gray-900 dark:text-gray-100 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 dark:border-neutral-800 p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-gray-100 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
              स
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-serif">About समझाओ (Samjhao)</h2>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-neutral-900 dark:text-blue-300 border border-blue-200 dark:border-neutral-800">
                  v1.0
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Understand any official document in simple words
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mission Statement */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            Our Mission
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            Every year, millions of Indian citizens receive official letters from banks, tax authorities, electricity boards, and courts. These documents are packed with dense legal jargon, intimidating clauses, and fine print that cause unnecessary stress.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            <strong>समझाओ</strong> is built to empower everyday citizens by breaking down complex documents into clear, everyday language in their mother tongue with zero technical jargon.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-neutral-950 border border-blue-100 dark:border-neutral-800 space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-900 dark:text-blue-200">
              <FileText className="w-4 h-4 text-blue-600" />
              1-Line Plain Summary
            </div>
            <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-snug">
              Instant breakdown of what the letter really wants you to know.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-neutral-950 border border-emerald-100 dark:border-neutral-800 space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 dark:text-emerald-200">
              <Lock className="w-4 h-4 text-emerald-600" />
              100% Zero-Store Privacy
            </div>
            <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-snug">
              Processed in ephemeral server RAM and discarded. No database, no training logs.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-neutral-950 border border-amber-100 dark:border-neutral-800 space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Scam & Threat Detection
            </div>
            <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-snug">
              Flags fake lottery prizes, demands for OTP/PIN, and personal UPI requests.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-purple-50/70 dark:bg-neutral-950 border border-purple-100 dark:border-neutral-800 space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-900 dark:text-purple-200">
              <Languages className="w-4 h-4 text-purple-600" />
              5 Indian Languages
            </div>
            <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-snug">
              Read and listen in Hindi, English, Tamil, Telugu, and Bengali.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="space-y-2.5 pt-1">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Guiding Principles
          </h3>
          <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Grounding in Source Text:</strong> Every extracted deadline, amount, or action includes verbatim quotes copied directly from your original document.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>No Legal Advice:</strong> Samjhao clarifies text rather than prescribing legal or financial actions. Official contacts from the document are always surfaced for verification.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Voice Synthesis:</strong> Includes Indian accent text-to-speech for individuals with visual challenges or limited reading literacy.
              </span>
            </li>
          </ul>
        </div>

        {/* Tech & Credits */}
        <div className="p-3 rounded-xl bg-gray-50 dark:bg-neutral-950 border border-gray-100 dark:border-neutral-800 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for India
          </span>
          <span>Next.js 16 • React 19 • Gemini AI</span>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
