"use client";

import { LANGUAGE_SPEECH_TAGS, type SupportedLanguage } from "@/lib/schemas";
import { useState, useEffect, useCallback } from "react";

interface Props {
  text: string;
  language: SupportedLanguage;
}

export default function ListenButton({ text, language }: Props) {
  const [speaking, setSpeaking] = useState(false);
  const [voiceAvailable, setVoiceAvailable] = useState<boolean | null>(() => {
    if (typeof window !== "undefined" && !("speechSynthesis" in window)) {
      return false;
    }
    return null;
  });

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
    return () => speechSynthesis.removeEventListener("voiceschanged", checkVoices);
  }, [language]);

  const toggle = useCallback(() => {
    if (!window.speechSynthesis) return;

    if (speaking) {
      speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const tag = LANGUAGE_SPEECH_TAGS[language];
    const langPrefix = tag.split("-")[0];
    const voices = speechSynthesis.getVoices();
    const voice = voices.find((v) => v.lang === tag) ||
      voices.find((v) => v.lang.startsWith(langPrefix + "-")) ||
      voices.find((v) => v.lang === langPrefix);

    if (voice) utterance.voice = voice;
    utterance.lang = tag;
    utterance.rate = 0.9;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    speechSynthesis.speak(utterance);
    setSpeaking(true);
  }, [text, language, speaking]);

  if (voiceAvailable === false) {
    return (
      <p className="text-sm text-gray-600 dark:text-gray-300 italic">
        🔇 Voice not available for this language on your device.
      </p>
    );
  }

  return (
    <button
      onClick={toggle}
      className={`flex items-center gap-2 px-5 py-3 rounded-xl text-base font-semibold transition-all
        ${
          speaking
            ? "bg-red-100 dark:bg-red-950/70 text-red-800 dark:text-red-200 border-2 border-red-300 dark:border-red-800"
            : "bg-green-100 dark:bg-green-950/70 text-green-800 dark:text-green-200 border-2 border-green-300 dark:border-green-800 hover:bg-green-200 dark:hover:bg-green-900"
        }`}
    >
      {speaking ? "⏹ Stop" : "🔊 Listen"}
    </button>
  );
}

