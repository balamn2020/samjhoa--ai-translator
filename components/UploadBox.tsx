"use client";

import { useState, useCallback } from "react";
import type { SupportedLanguage } from "@/lib/schemas";
import PromptInput7, { type PromptMode } from "./PromptInput7";

interface Props {
  language?: SupportedLanguage | null;
  onLanguageChange?: (lang: SupportedLanguage) => void;
  onFile: (file: File) => void;
  onText: (text: string, language?: SupportedLanguage) => void;
  disabled?: boolean;
}

/**
 * Client-side image resize to max ~1600px before upload.
 */
function resizeImage(file: File, maxDim: number): Promise<File> {
  return new Promise((resolve) => {
    if (!file.type.startsWith("image/")) {
      resolve(file);
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const { width, height } = img;

      if (width <= maxDim && height <= maxDim) {
        resolve(file);
        return;
      }

      const scale = maxDim / Math.max(width, height);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(new File([blob], file.name, { type: "image/jpeg" }));
          } else {
            resolve(file);
          }
        },
        "image/jpeg",
        0.85
      );
    };
    img.onerror = () => resolve(file);
    img.src = url;
  });
}

export default function UploadBox({
  language,
  onLanguageChange,
  onFile,
  onText,
  disabled,
}: Props) {
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      const resized = await resizeImage(file, 1600);
      onFile(resized);
    },
    [onFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handlePromptSubmit = (
    promptText: string,
    promptMode: PromptMode,
    files: File[],
    selectedLang?: SupportedLanguage
  ) => {
    if (selectedLang && onLanguageChange) {
      onLanguageChange(selectedLang);
    }
    if (files.length > 0) {
      handleFile(files[0]);
      return;
    }

    // Adapt mode to instructions if needed
    let finalPrompt = promptText;
    if (promptMode === "ask") {
      finalPrompt = `[Question/Ask Mode]: ${promptText}`;
    }

    onText(finalPrompt, selectedLang);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className={`w-full transition-all rounded-2xl ${
        dragOver ? "ring-4 ring-blue-400 bg-blue-50/50" : ""
      }`}
    >
      <div className="space-y-2">
        {/* Unified Chatbox: Prompt Input 7 with Ask/Agent, Language Selector & Document Attachments */}
        <PromptInput7
          initialMode="agent"
          disabled={disabled}
          language={language}
          onLanguageChange={onLanguageChange}
          onFileSelect={handleFile}
          onSubmit={handlePromptSubmit}
        />
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-300 px-1 font-medium">
          <span>
            Type, paste text, or click <strong className="text-gray-900 dark:text-white">📎</strong> to attach any document or photo
          </span>
          <span className="hidden sm:inline text-gray-500 dark:text-gray-400">PDF, JPG, PNG (max 5MB)</span>
        </div>
      </div>
    </div>
  );
}
