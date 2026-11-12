"use client";

import { type SupportedLanguage, LANGUAGE_NAMES } from "@/lib/schemas";

interface Props {
  selected: SupportedLanguage | null;
  onSelect: (lang: SupportedLanguage) => void;
}

const languages: SupportedLanguage[] = ["en", "hi", "ta", "te", "bn"];

export default function LanguagePicker({ selected, onSelect }: Props) {
  return (
    <div className="w-full">
      <p className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">
        Choose your language / अपनी भाषा चुनें
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {languages.map((lang) => (
          <button
            key={lang}
            onClick={() => onSelect(lang)}
            className={`px-6 py-4 rounded-xl text-lg font-bold transition-all
              ${selected === lang
                ? "bg-blue-600 text-white shadow-lg scale-105"
                : "bg-white dark:bg-neutral-950 text-gray-900 dark:text-gray-100 border-2 border-gray-200 dark:border-neutral-800 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-neutral-900"
              }`}
          >
            {LANGUAGE_NAMES[lang]}
          </button>
        ))}
      </div>
    </div>
  );
}

