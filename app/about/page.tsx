"use client";

import Link from "next/link";
import AppShell8 from "@/components/AppShell8";
import {
  FileText,
  ShieldCheck,
  Lock,
  Languages,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Heart,
  ArrowLeft,
  PhoneCall,
  EyeOff,
  Flame,
  Scale,
  Volume2,
} from "lucide-react";

export default function AboutPage() {
  return (
    <AppShell8 activeTab="about">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
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
        <div className="flex items-start gap-4 pb-4 border-b border-gray-200 dark:border-neutral-800">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-blue-500/25 shrink-0">
            स
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-3xl sm:text-4xl font-bold font-calligraphy text-gray-950 dark:text-white">
                About Samjhao (समझाओ)
              </h1>
              <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-neutral-900 dark:text-blue-300 border border-blue-200 dark:border-neutral-800">
                v1.0
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Empowering everyday citizens to understand official documents with clarity, privacy, and safety.
            </p>
          </div>
        </div>

        {/* Mission Statement */}
        <section className="space-y-3 bg-white dark:bg-neutral-950 p-6 rounded-2xl border border-gray-200/80 dark:border-neutral-800 shadow-xs">
          <h2 className="text-base font-bold text-gray-950 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Our Mission
          </h2>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Every year, millions of Indian citizens receive official letters from banks, tax authorities, electricity boards, municipal corporations, and courts. These notices are packed with dense legal jargon, intimidating penalty clauses, and fine print that cause immediate stress and anxiety.
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            <strong>Samjhao (समझाओ)</strong> was created to give power back to everyday people. By uploading a photo or PDF of any confusing notice, you receive an instant, objective, and plain-language explanation in your native language — without confusing legal terminology.
          </p>
        </section>

        {/* 🛡️ Safety & Scam Protection (Merged Section) */}
        <section className="space-y-4 bg-gradient-to-br from-amber-50/70 to-orange-50/40 dark:from-neutral-950 dark:to-neutral-950 p-6 rounded-2xl border border-amber-200/70 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center gap-2.5 text-amber-900 dark:text-amber-300">
            <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h2 className="text-base font-bold">Safety & Scam Protection</h2>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Scammers frequently forge official bank logos, court seals, and government stamps to frighten victims into transferring money or surrendering sensitive credentials. Samjhao actively checks every document for known scam indicators:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-4 rounded-xl bg-white/90 dark:bg-neutral-900 border border-amber-100 dark:border-neutral-800 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Fake Lottery & Prize Notices
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Flags notices claiming you won millions (KBC, RBI, custom rewards) where you must first pay a &quot;processing fee&quot; or &quot;clearance tax&quot;.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/90 dark:bg-neutral-900 border border-amber-100 dark:border-neutral-800 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-red-900 dark:text-red-200">
                <Flame className="w-4 h-4 text-red-600" />
                Credential & OTP Demands
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Warns against any notice requesting your OTP, ATM PIN, CVV, internet banking password, or transfers to personal UPI handles.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/90 dark:bg-neutral-900 border border-amber-100 dark:border-neutral-800 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-200">
                <Scale className="w-4 h-4 text-amber-600" />
                Pressure Tactics & Fake Threats
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Detects urgent threats of immediate arrest, electricity cut-off within 2 hours, or police raids designed to bypass rational thinking.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/90 dark:bg-neutral-900 border border-amber-100 dark:border-neutral-800 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900 dark:text-blue-200">
                <PhoneCall className="w-4 h-4 text-blue-600" />
                Verification Guidance
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Always advises verifying suspicious letters using official branch phone numbers from your passbook or verified government portals.
              </p>
            </div>
          </div>
        </section>

        {/* 🔒 Zero-Retention Privacy Policy (Merged Section) */}
        <section className="space-y-4 bg-gradient-to-br from-emerald-50/70 to-teal-50/40 dark:from-neutral-950 dark:to-neutral-950 p-6 rounded-2xl border border-emerald-200/70 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center gap-2.5 text-emerald-900 dark:text-emerald-300">
            <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-base font-bold">Privacy & Zero-Retention Guarantee</h2>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Your legal agreements, loan statements, and personal bills are private. We operate with a strict zero-retention guarantee:
          </p>

          <ul className="space-y-2.5 text-xs text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-2.5 bg-white/90 dark:bg-neutral-900 p-3 rounded-xl border border-emerald-100 dark:border-neutral-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>100% In-Memory RAM Processing:</strong> Uploaded documents and texts are analyzed directly inside ephemeral server memory and erased immediately after the explanation is returned.
              </span>
            </li>
            <li className="flex items-start gap-2.5 bg-white/90 dark:bg-neutral-900 p-3 rounded-xl border border-emerald-100 dark:border-neutral-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Zero Database Storage:</strong> We do not keep user accounts, document databases, file buckets, or archival histories of what you upload.
              </span>
            </li>
            <li className="flex items-start gap-2.5 bg-white/90 dark:bg-neutral-900 p-3 rounded-xl border border-emerald-100 dark:border-neutral-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>No Public Model Training:</strong> Your documents are processed via enterprise API endpoints and are never used to train public foundation models.
              </span>
            </li>
            <li className="flex items-start gap-2.5 bg-white/90 dark:bg-neutral-900 p-3 rounded-xl border border-emerald-100 dark:border-neutral-800">
              <EyeOff className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Privacy Tip:</strong> You can obscure or black out your 12-digit Aadhaar number, PAN number, and bank account numbers prior to uploading for maximum personal privacy.
              </span>
            </li>
          </ul>
        </section>

        {/* Core Principles */}
        <section className="space-y-4 bg-white dark:bg-neutral-950 p-6 rounded-2xl border border-gray-200/80 dark:border-neutral-800 shadow-xs">
          <h2 className="text-base font-bold text-gray-950 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Core Capabilities
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 space-y-1">
              <div className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                1-Line Plain Summary
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Get an immediate one-sentence answer on what the document is demanding or stating.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 space-y-1">
              <div className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Exact Verbatim Grounding
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Extracted deadlines and monetary amounts include direct verbatim quotes copied from your document.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 space-y-1">
              <div className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                <Languages className="w-3.5 h-3.5 text-purple-600" />
                5 Indian Languages
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Read explanations in Hindi (हिन्दी), English, Tamil (தமிழ்), Telugu (తెలుగు), or Bengali (বাংলা).
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 space-y-1">
              <div className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                Audio Voice Narration
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Listen to the explanation spoken aloud with clear Indian-accent voice synthesis.
              </p>
            </div>
          </div>
        </section>

        {/* Tech & Credits */}
        <div className="p-4 rounded-xl bg-gray-50 dark:bg-neutral-950 border border-gray-200/80 dark:border-neutral-800 text-xs text-gray-600 dark:text-gray-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="flex items-center gap-1.5">
            Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Indian citizens
          </span>
          <span>Next.js 16 • React 19 • Gemini AI • Tailwind CSS</span>
        </div>

        {/* CTA Button */}
        <div className="pt-2">
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm shadow-blue-600/25"
          >
            ← Try Explaining a Document Now
          </Link>
        </div>
      </div>
    </AppShell8>
  );
}
