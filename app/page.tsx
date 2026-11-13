"use client";

import { useState, useCallback } from "react";
import { type SupportedLanguage, type Explanation, LANGUAGE_NAMES } from "@/lib/schemas";
import type { GroundingWarning } from "@/lib/grounding";
import LanguagePicker from "@/components/LanguagePicker";
import UploadBox from "@/components/UploadBox";
import ResultView from "@/components/ResultView";
import AppShell8 from "@/components/AppShell8";
import SettingsBar from "@/components/SettingsBar";
import AboutModal from "@/components/AboutModal";
import TiltedTiles, { type TiltedTileItem } from "@/components/TiltedTiles";
import { sampleDocs } from "@/data/sample-docs";

type Stage = "input" | "processing" | "result" | "error";

const progressMessages = [
  "Reading your document... 📖",
  "Understanding it... 🧠",
  "Writing it simply... ✍️",
];

export default function Home() {
  const [language, setLanguage] = useState<SupportedLanguage | null>(null);
  const [stage, setStage] = useState<Stage>("input");
  const [progressIdx, setProgressIdx] = useState(0);
  const [explanation, setExplanation] = useState<Explanation | null>(null);
  const [groundingWarnings, setGroundingWarnings] = useState<GroundingWarning[]>([]);
  const [error, setError] = useState<string>("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [today] = useState(() =>
    new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" })
  );

  const handleExplain = useCallback(
    async (
      body: FormData | { text: string; language: string; today: string },
      overrideLang?: SupportedLanguage
    ) => {
      const activeLang =
        overrideLang ||
        (body instanceof FormData ? language : (body.language as SupportedLanguage)) ||
        language ||
        "hi";

      setLanguage(activeLang);
      setStage("processing");
      setProgressIdx(0);
      setError("");

      // Cycle through progress messages
      const interval = setInterval(() => {
        setProgressIdx((prev) => Math.min(prev + 1, progressMessages.length - 1));
      }, 3000);

      try {
        let res: Response;

        if (body instanceof FormData) {
          body.set("language", activeLang);
          body.set("today", today);
          res = await fetch("/api/explain", { method: "POST", body });
        } else {
          res = await fetch("/api/explain", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...body, language: activeLang, today }),
          });
        }

        clearInterval(interval);

        if (!res.ok) {
          const err = await res.json().catch(() => ({ message: "Something went wrong" }));
          setError(err.message || `Error ${res.status}`);
          setStage("error");
          return;
        }

        const data = await res.json();
        setExplanation(data.explanation);
        setGroundingWarnings(data.grounding_warnings || []);
        setStage("result");
      } catch {
        clearInterval(interval);
        setError("Could not connect. Please check your internet and try again.");
        setStage("error");
      }
    },
    [language, today]
  );

  const handleFile = useCallback(
    (file: File) => {
      const activeLang = language || "hi";
      setLanguage(activeLang);
      const formData = new FormData();
      formData.set("file", file);
      handleExplain(formData, activeLang);
    },
    [handleExplain, language]
  );

  const handleText = useCallback(
    (text: string, customLang?: SupportedLanguage) => {
      const chosen = customLang || language || "hi";
      setLanguage(chosen);
      handleExplain({ text, language: chosen, today }, chosen);
    },
    [handleExplain, language, today]
  );

  const handleTileClick = useCallback(
    (tile: TiltedTileItem) => {
      const doc =
        sampleDocs.find((d) => d.id === tile.id) ||
        sampleDocs.find((d) => d.title.toLowerCase().includes(tile.title.toLowerCase())) ||
        sampleDocs[0];
      const selectedLang = language || "hi";
      setLanguage(selectedLang);
      handleExplain({ text: doc.text, language: selectedLang, today }, selectedLang);
    },
    [handleExplain, language, today]
  );

  const reset = () => {
    setStage("input");
    setExplanation(null);
    setGroundingWarnings([]);
    setError("");
    setProgressIdx(0);
  };

  const handleTabChange = (tabId: string) => {
    if (tabId === "explain") {
      reset();
    } else if (tabId === "samples") {
      if (stage !== "input") {
        setStage("input");
      }
      setTimeout(() => {
        document.getElementById("samples-section")?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    } else if (tabId === "about") {
      setAboutOpen(true);
    }
  };

  return (
    <>
      <AppShell8
        onTabChange={handleTabChange}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenAbout={() => setAboutOpen(true)}
      >
        <div className="max-w-xl mx-auto px-4 py-6 space-y-6">
          {/* Header */}
          <div className="text-center pt-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-serif">
              Samjhao
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
              Understand any official document
            </p>
          </div>

          {stage === "error" && (
            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-2xl p-6 text-center">
                <p className="text-4xl mb-3">😕</p>
                <p className="text-lg text-red-800 dark:text-red-200 font-medium">{error}</p>
              </div>
              <button
                onClick={reset}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-lg font-medium transition-colors"
              >
                ← Try Again
              </button>
            </div>
          )}

          {stage === "result" && explanation && (
            <ResultView
              explanation={explanation}
              language={language!}
              today={today}
              groundingWarnings={groundingWarnings}
              onBack={reset}
            />
          )}

          {(stage === "input" || stage === "processing") && (
            <>
              {/* Inline processing banner when reading document */}
              {stage === "processing" && (
                <div className="bg-blue-50/90 dark:bg-neutral-950 border border-blue-200 dark:border-neutral-800 rounded-2xl p-5 text-center space-y-3 shadow-xs animate-in fade-in">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-3 border-blue-200 dark:border-neutral-800 border-t-blue-600 dark:border-t-blue-400" />
                  <p className="text-base text-blue-900 dark:text-blue-100 font-semibold animate-pulse">
                    {progressMessages[progressIdx]}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    Reading and simplifying your document in {language ? LANGUAGE_NAMES[language] : "your chosen language"}...
                  </p>
                </div>
              )}

              {/* Language picker */}
              <LanguagePicker selected={language} onSelect={setLanguage} />

              {/* Upload box with Prompt / Chatbox & Language Selector */}
              <UploadBox
                disabled={stage === "processing"}
                language={language}
                onLanguageChange={setLanguage}
                onFile={handleFile}
                onText={handleText}
              />

              {/* Tilted Tiles Showcase */}
              <div id="samples-section" className="pt-2 scroll-mt-20">
                <div className="mb-3 px-1">
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    Try with a real sample document
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Click any card to instantly see how Samjhao explains it
                  </p>
                </div>
                <TiltedTiles onTileClick={handleTileClick} height={280} />
              </div>
            </>
          )}
        </div>
      </AppShell8>

      {/* Settings Bar Drawer */}
      <SettingsBar
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        currentLanguage={language}
        onLanguageChange={setLanguage}
        onOpenAbout={() => {
          setSettingsOpen(false);
          setAboutOpen(true);
        }}
        onResetApp={reset}
      />

      {/* About Modal */}
      <AboutModal
        isOpen={aboutOpen}
        onClose={() => setAboutOpen(false)}
      />
    </>
  );
}
