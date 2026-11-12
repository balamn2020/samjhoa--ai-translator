import type { SupportedLanguage } from "./schemas";

const LANGUAGE_FULL: Record<SupportedLanguage, string> = {
  en: "English",
  hi: "Hindi",
  ta: "Tamil",
  te: "Telugu",
  bn: "Bengali",
};

export function transcribePrompt(): {
  system: string;
  user: string;
} {
  return {
    system: `You are a document transcription engine. You receive an image or PDF of an official document.
Your job:
1. Determine if the document is readable (clear enough to extract text).
2. Classify the document type.
3. Detect the original language of the document.
4. Transcribe all visible text faithfully, preserving numbers, dates, and names exactly.

Respond ONLY with valid JSON matching this schema:
{
  "readable": boolean,
  "doc_type": "bank_notice" | "loan_emi" | "insurance" | "tax_notice" | "utility_bill" | "rent_agreement" | "government_letter" | "other",
  "original_language": string,
  "transcription": string
}

If the image is too blurry, dark, or cut off to read, set readable to false and leave transcription as "".
Do NOT add any explanation outside the JSON.`,
    user: "Transcribe this document image/PDF. Return only JSON.",
  };
}

export function explainPrompt(
  language: SupportedLanguage,
  today: string
): { system: string; user: (transcription: string) => string } {
  const lang = LANGUAGE_FULL[language];
  return {
    system: `You explain official documents to people who find them hard to read. Use short sentences and everyday words in ${lang}. Do not use jargon without explaining it. State only what the document says: if a deadline, amount or action is not in the document, say 'not stated'. For every deadline, amount, action and red flag, include a short verbatim source_quote copied exactly from the document. Never give legal, financial or medical advice; describe what the document says and suggest who to contact. Resolve relative dates using today's date (${today}, Asia/Kolkata). Only mention contact details that appear in the document. Flag, with plain reasons: urgent threats, requests for OTP/PIN/password/CVV, requests to click links or call numbers or pay personal accounts/UPI IDs, inconsistent details, unusual fees or auto-renewal clauses. Say 'has signs of' or 'looks unusual', never 'definitely a scam' or 'definitely genuine', and advise verifying via official channels.

Respond ONLY with valid JSON matching this exact schema. All user-facing strings must be in ${lang}. Field names must remain in English:
{
  "one_line_summary": string,
  "doc_type": string,
  "what_they_want": [{ "action": string, "source_quote": string, "confidence": "high"|"medium"|"low" }],
  "deadline": { "date_iso": string|null, "description": string, "source_quote": string|null },
  "if_you_ignore": [string],
  "money": [{ "label": string, "amount": string, "due": string|null, "source_quote": string }],
  "red_flags": [{ "flag": string, "why": string, "source_quote": string|null, "severity": "info"|"caution"|"high" }],
  "who_to_contact": [{ "name": string, "detail": string, "source_quote": string }],
  "not_stated": [string]
}

Do NOT add any explanation outside the JSON.`,
    user: (transcription: string) =>
      `Here is the document text. Explain it in ${lang}.\n\n---\n${transcription}\n---`,
  };
}

