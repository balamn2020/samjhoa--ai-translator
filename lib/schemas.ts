import { z } from "zod";

// ── Step 1: Transcribe & Classify ──────────────────────────────────────────
export const TranscriptionResultSchema = z.object({
  readable: z.boolean().default(true),
  doc_type: z.string().default("other"),
  original_language: z.string().default("en"),
  transcription: z.string().default(""),
});
export type TranscriptionResult = z.infer<typeof TranscriptionResultSchema>;

// ── Step 2: Explanation ────────────────────────────────────────────────────
const ConfidenceSchema = z
  .preprocess(
    (val) =>
      typeof val === "string" && ["high", "medium", "low"].includes(val)
        ? val
        : "medium",
    z.enum(["high", "medium", "low"])
  )
  .default("medium");

const ActionItemSchema = z.object({
  action: z.string(),
  source_quote: z.string().default(""),
  confidence: ConfidenceSchema,
});

const DeadlineSchema = z.object({
  date_iso: z.string().nullable().optional().default(null),
  description: z.string().default("None"),
  source_quote: z.string().nullable().optional().default(null),
});

const MoneyItemSchema = z.object({
  label: z.string(),
  amount: z.string(),
  due: z.string().nullable().optional().default(null),
  source_quote: z.string().default(""),
});

const RedFlagSchema = z.object({
  flag: z.string(),
  why: z.string(),
  source_quote: z.string().nullable().optional().default(null),
  severity: z
    .preprocess(
      (val) =>
        typeof val === "string" && ["info", "caution", "high"].includes(val)
          ? val
          : "caution",
      z.enum(["info", "caution", "high"])
    )
    .default("caution"),
});

const ContactSchema = z.object({
  name: z.string(),
  detail: z.string(),
  source_quote: z.string().default(""),
});

export const ExplanationSchema = z.object({
  one_line_summary: z.string(),
  doc_type: z.string().default("Notice"),
  what_they_want: z.array(ActionItemSchema).default([]),
  deadline: DeadlineSchema.default({ date_iso: null, description: "Not stated", source_quote: null }),
  if_you_ignore: z.array(z.string()).default([]),
  money: z.array(MoneyItemSchema).default([]),
  red_flags: z.array(RedFlagSchema).default([]),
  who_to_contact: z.array(ContactSchema).default([]),
  not_stated: z.array(z.string()).default([]),
});
export type Explanation = z.infer<typeof ExplanationSchema>;

// ── API Request ────────────────────────────────────────────────────────────
export const SupportedLanguageSchema = z.enum(["en", "hi", "ta", "te", "bn"]);
export type SupportedLanguage = z.infer<typeof SupportedLanguageSchema>;

export const ExplainRequestSchema = z.object({
  text: z.string().max(10000).optional(),
  language: SupportedLanguageSchema,
  today: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

// ── API Response ───────────────────────────────────────────────────────────
export const ExplainResponseSchema = z.object({
  transcription_used: z.string(),
  explanation: ExplanationSchema,
});
export type ExplainResponse = z.infer<typeof ExplainResponseSchema>;

export const ErrorResponseSchema = z.object({
  message: z.string(),
});

// Language display names
export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  en: "English",
  hi: "हिन्दी",
  ta: "தமிழ்",
  te: "తెలుగు",
  bn: "বাংলা",
};

// BCP 47 tags for speech synthesis
export const LANGUAGE_SPEECH_TAGS: Record<SupportedLanguage, string> = {
  en: "en-IN",
  hi: "hi-IN",
  ta: "ta-IN",
  te: "te-IN",
  bn: "bn-IN",
};

