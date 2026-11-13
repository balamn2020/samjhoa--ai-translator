"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  HelpCircle,
  Bot,
  Paperclip,
  ArrowUp,
  X,
  ChevronDown,
  FileText,
  Languages,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { SupportedLanguage } from "@/lib/schemas";

export type PromptMode = "ask" | "agent";

export const PROMPT_LANGUAGES: {
  id: SupportedLanguage;
  label: string;
  native: string;
}[] = [
  { id: "hi", label: "Hindi", native: "हिन्दी" },
  { id: "en", label: "English", native: "English" },
  { id: "ta", label: "Tamil", native: "தமிழ்" },
  { id: "te", label: "Telugu", native: "తెలుగు" },
  { id: "bn", label: "Bengali", native: "বাংলা" },
];

export interface PromptInput7Props {
  initialMode?: PromptMode;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  language?: SupportedLanguage | null;
  onLanguageChange?: (lang: SupportedLanguage) => void;
  onFileSelect?: (file: File) => void;
  onSubmit?: (
    text: string,
    mode: PromptMode,
    files: File[],
    language?: SupportedLanguage
  ) => void;
}

const MODES = [
  {
    id: "ask" as PromptMode,
    label: "Ask",
    icon: HelpCircle,
    color: "bg-blue-50 dark:bg-blue-950/70 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/60",
    activeColor: "bg-blue-600 text-white border-blue-600",
    placeholder: "Ask anything about this document... (e.g. 'What is the due date?')",
  },
  {
    id: "agent" as PromptMode,
    label: "Agent",
    icon: Bot,
    color: "bg-purple-50 dark:bg-purple-950/70 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/60",
    activeColor: "bg-purple-600 text-white border-purple-600",
    placeholder: "Run autonomous analysis: transcribe, check scams, extract money & dates...",
  },
] as const;

export default function PromptInput7({
  initialMode = "agent",
  disabled = false,
  className,
  language,
  onLanguageChange,
  onSubmit,
  onFileSelect,
}: PromptInput7Props) {
  const [mode, setMode] = useState<PromptMode>(initialMode);
  const [internalLang, setInternalLang] = useState<SupportedLanguage>("hi");
  const activeLang = language || internalLang;

  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  const activeModeConfig = MODES.find((m) => m.id === mode) || MODES[0];
  const activeLangConfig =
    PROMPT_LANGUAGES.find((l) => l.id === activeLang) || PROMPT_LANGUAGES[0];

  // Auto-resize textarea as user types
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        220
      )}px`;
    }
  }, [text]);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(event.target as Node)
      ) {
        setLangDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if ((!text.trim() && files.length === 0) || disabled) return;
    onSubmit?.(text.trim(), mode, files, activeLang);
    setText("");
    setFiles([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFiles((prev) => [...prev, selected]);
      onFileSelect?.(selected);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div
      className={cn(
        "relative w-full rounded-2xl border-2 border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-3 shadow-sm transition-all focus-within:border-blue-500 dark:focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50 dark:focus-within:ring-blue-950/50",
        disabled && "opacity-60 pointer-events-none",
        className
      )}
    >
      {/* Attached Files List */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2 pb-2 border-b border-gray-100 dark:border-neutral-800">
          {files.map((file, idx) => (
            <div
              key={`${file.name}-${idx}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-100 dark:bg-neutral-900 text-xs font-medium text-gray-700 dark:text-gray-300"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="max-w-[150px] truncate">{file.name}</span>
              <button
                type="button"
                onClick={() => removeFile(idx)}
                className="text-gray-400 hover:text-red-500 transition-colors ml-1"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Main Textarea */}
      <textarea
        ref={textareaRef}
        rows={2}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={activeModeConfig.placeholder}
        disabled={disabled}
        className="w-full resize-none border-none bg-transparent p-1 text-base font-normal text-gray-950 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-0 leading-relaxed"
      />

      {/* Footer Controls */}
      <div className="flex items-center justify-between pt-2 mt-1 border-t border-gray-100 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          {/* Mode Selector Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
                activeModeConfig.color
              )}
            >
              <activeModeConfig.icon className="w-3.5 h-3.5" />
              <span>{activeModeConfig.label}</span>
              <ChevronDown className="w-3 h-3 opacity-70 ml-0.5" />
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 bottom-full mb-2 w-56 rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-1.5 shadow-lg z-50">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 px-2 py-1">
                  Select Mode
                </div>
                {MODES.map((m) => {
                  const Icon = m.icon;
                  const isActive = m.id === mode;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setMode(m.id);
                        setDropdownOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-left transition-colors",
                        isActive
                          ? "bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 font-semibold"
                          : "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-900"
                      )}
                    >
                      <span
                        className={cn(
                          "p-1 rounded-md",
                          isActive ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-neutral-900 text-gray-600 dark:text-gray-300"
                        )}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </span>
                      <div className="flex flex-col">
                        <span>{m.label} Mode</span>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 font-normal leading-tight">
                          {m.id === "ask" && "Ask questions"}
                          {m.id === "agent" && "Full document analysis"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Language Selector Dropdown */}
          <div className="relative" ref={langDropdownRef}>
            <button
              type="button"
              onClick={() => setLangDropdownOpen((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium border border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:border-blue-300 transition-all shadow-xs"
              title="Select explanation language"
            >
              <Languages className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="font-semibold text-gray-950 dark:text-gray-100">{activeLangConfig.native}</span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 font-normal">({activeLangConfig.label})</span>
              <ChevronDown className="w-3 h-3 opacity-70 ml-0.5" />
            </button>

            {langDropdownOpen && (
              <div className="absolute left-0 bottom-full mb-2 w-52 rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-1.5 shadow-lg z-50">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 px-2 py-1">
                  Response Language
                </div>
                {PROMPT_LANGUAGES.map((l) => {
                  const isSelected = l.id === activeLang;
                  return (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => {
                        setInternalLang(l.id);
                        onLanguageChange?.(l.id);
                        setLangDropdownOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors text-left",
                        isSelected
                          ? "bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 font-semibold"
                          : "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-900 font-normal"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-950 dark:text-white">{l.native}</span>
                        <span className="text-[11px] text-gray-500 dark:text-gray-400">({l.label})</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Attach Document / Image Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Attach photo or PDF"
            className="inline-flex items-center justify-center w-8 h-8 rounded-full text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-neutral-900 transition-colors"
          >
            <Paperclip className="w-4 h-4" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Right side: Send button */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:inline">
            Press Enter ↵
          </span>
          <button
            type="button"
            onClick={handleSend}
            disabled={(!text.trim() && files.length === 0) || disabled}
            className={cn(
              "inline-flex items-center justify-center w-9 h-9 rounded-xl font-medium transition-all shadow-sm",
              text.trim() || files.length > 0
                ? "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105"
                : "bg-gray-100 dark:bg-neutral-900 text-gray-400 dark:text-neutral-500 cursor-not-allowed"
            )}
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
