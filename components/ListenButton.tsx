"use client";

import { LANGUAGE_SPEECH_TAGS, type SupportedLanguage } from "@/lib/schemas";
import { useState, useEffect, useCallback, useRef } from "react";
import { Gauge, Play, Pause, Square } from "lucide-react";

interface Props {
  text: string;
  language: SupportedLanguage;
}

const SPEED_OPTIONS = [
  { value: 0.75, label: "0.75x", title: "Slow" },
  { value: 1.0, label: "1.0x", title: "Normal" },
  { value: 1.25, label: "1.25x", title: "Fast" },
  { value: 1.5, label: "1.5x", title: "Faster" },
];

export default function ListenButton({ text, language }: Props) {
  const [status, setStatus] = useState<"idle" | "playing" | "paused">("idle");
  const [speed, setSpeed] = useState<number>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("samjhao_speech_speed");
        if (saved) {
          const parsed = parseFloat(saved);
          if (!isNaN(parsed) && parsed > 0) return parsed;
        }
      } catch {
        // ignore
      }
    }
    return 1.0;
  });
  const [voiceAvailable, setVoiceAvailable] = useState<boolean | null>(() => {
    if (typeof window !== "undefined" && !("speechSynthesis" in window)) {
      return false;
    }
    return null;
  });

  const speedRef = useRef(speed);
  speedRef.current = speed;

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    const checkVoices = () => {
      const voices = speechSynthesis.getVoices();
      const tag = LANGUAGE_SPEECH_TAGS[language];
      const langPrefix = tag.split("-")[0]; // e.g. "hi"
      const found = voices.some(
        (v) =>
          v.lang === tag ||
          v.lang.startsWith(langPrefix + "-") ||
          v.lang === langPrefix
      );
      setVoiceAvailable(found);
    };

    checkVoices();
    speechSynthesis.addEventListener("voiceschanged", checkVoices);
    return () => {
      speechSynthesis.removeEventListener("voiceschanged", checkVoices);
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        speechSynthesis.cancel();
      }
    };
  }, [language]);

  const speakWithRate = useCallback(
    (targetRate: number) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      const tag = LANGUAGE_SPEECH_TAGS[language];
      const langPrefix = tag.split("-")[0];
      const voices = speechSynthesis.getVoices();
      const voice =
        voices.find((v) => v.lang === tag) ||
        voices.find((v) => v.lang.startsWith(langPrefix + "-")) ||
        voices.find((v) => v.lang === langPrefix);

      if (voice) utterance.voice = voice;
      utterance.lang = tag;
      utterance.rate = targetRate;
      utterance.onend = () => setStatus("idle");
      utterance.onerror = () => setStatus("idle");

      speechSynthesis.speak(utterance);
      setStatus("playing");
    },
    [text, language]
  );

  const handleStart = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (status === "paused") {
      speechSynthesis.resume();
      setStatus("playing");
      return;
    }

    speakWithRate(speedRef.current);
  }, [status, speakWithRate]);

  const handlePause = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (status === "playing") {
      speechSynthesis.pause();
      setStatus("paused");
    }
  }, [status]);

  const handleStop = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    speechSynthesis.cancel();
    setStatus("idle");
  }, []);

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    try {
      localStorage.setItem("samjhao_speech_speed", String(newSpeed));
    } catch {
      // ignore
    }

    if (status === "playing") {
      speakWithRate(newSpeed);
    }
  };

  if (voiceAvailable === false) {
    return (
      <p className="text-sm text-gray-600 dark:text-gray-300 italic">
        🔇 Voice narration not available for this language on your browser.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2.5 p-2.5 rounded-2xl bg-white dark:bg-neutral-900 border border-gray-200/80 dark:border-neutral-800 shadow-xs">
      {/* If Idle: Start Button */}
      {status === "idle" && (
        <button
          type="button"
          onClick={handleStart}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xs cursor-pointer hover:scale-102"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Start</span>
        </button>
      )}

      {/* If Playing: Pause Button (placed on the left side of Stop button) */}
      {status === "playing" && (
        <button
          type="button"
          onClick={handlePause}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-white transition-all shadow-xs cursor-pointer hover:scale-102"
        >
          <Pause className="w-3.5 h-3.5 fill-current" />
          <span>Pause</span>
        </button>
      )}

      {/* If Paused: Resume Button (placed on the left side of Stop button) */}
      {status === "paused" && (
        <button
          type="button"
          onClick={handleStart}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xs cursor-pointer hover:scale-102"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Resume</span>
        </button>
      )}

      {/* Stop Button (next to Pause/Resume when audio is active) */}
      {status !== "idle" && (
        <button
          type="button"
          onClick={handleStop}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-red-500 hover:bg-red-600 text-white transition-all shadow-xs cursor-pointer hover:scale-102"
        >
          <Square className="w-3.5 h-3.5 fill-current" />
          <span>Stop</span>
        </button>
      )}

      {/* Sound Speed Selector */}
      <div className="flex items-center gap-1.5 pl-2 border-l border-gray-200 dark:border-neutral-800">
        <span className="flex items-center gap-1 text-[11px] font-semibold text-gray-500 dark:text-gray-400 mr-0.5">
          <Gauge className="w-3.5 h-3.5 text-blue-500" />
          <span className="hidden sm:inline">Speed:</span>
        </span>
        <div className="flex items-center gap-1 p-0.5 bg-gray-100 dark:bg-neutral-950 rounded-xl border border-gray-200/60 dark:border-neutral-800">
          {SPEED_OPTIONS.map((opt) => {
            const isSelected = speed === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSpeedChange(opt.value)}
                title={`${opt.title} (${opt.label})`}
                className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
