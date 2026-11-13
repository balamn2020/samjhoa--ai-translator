import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  TranscriptionResultSchema,
  ExplanationSchema,
  SupportedLanguageSchema,
  type SupportedLanguage,
} from "@/lib/schemas";
import { callLLM } from "@/lib/llm";
import { transcribePrompt, explainPrompt } from "@/lib/prompts";
import { checkGrounding } from "@/lib/grounding";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_TEXT_LENGTH = 10000;

function jsonError(message: string, status: number) {
  return NextResponse.json({ message }, { status });
}

/**
 * Parse JSON from LLM response, handling markdown code fences or conversational wrappers.
 */
function parseJSON(raw: string): unknown {
  let cleaned = raw.trim();
  // Strip markdown code fences if present anywhere
  const fenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (fenceMatch) {
    cleaned = fenceMatch[1].trim();
  } else {
    // If no fence, isolate outermost JSON object { ... }
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      cleaned = cleaned.slice(firstBrace, lastBrace + 1).trim();
    }
  }
  return JSON.parse(cleaned);
}

/**
 * Call LLM with Zod validation and one retry on failure.
 */
async function callAndValidate<T>(
  schema: z.ZodSchema<T>,
  messages: { role: "system" | "user"; content: string }[],
  imageBase64?: string,
  imageMime?: string
): Promise<T> {
  let lastError: string | null = null;

  for (let attempt = 0; attempt < 2; attempt++) {
    const effectiveMessages =
      attempt === 0
        ? messages
        : [
            ...messages,
            {
              role: "user" as const,
              content: `Your previous response failed validation: ${lastError}. Please fix and return valid JSON.`,
            },
          ];

    const raw = await callLLM({
      messages: effectiveMessages,
      imageBase64,
      imageMime,
    });

    try {
      const parsed = parseJSON(raw);
      return schema.parse(parsed);
    } catch (err) {
      if (err instanceof z.ZodError) {
        lastError = err.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ");
      } else if (err instanceof SyntaxError) {
        lastError = `Invalid JSON: ${err.message}`;
      } else {
        lastError = String(err);
      }
    }
  }

  throw new Error(`LLM validation failed after retry: ${lastError}`);
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";

    let text: string | undefined;
    let language: SupportedLanguage;
    let today: string;
    let fileBase64: string | undefined;
    let fileMime: string | undefined;

    // ── Parse request ──────────────────────────────────────────────────
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();

      const langVal = formData.get("language");
      const todayVal = formData.get("today");
      const textVal = formData.get("text");
      const fileVal = formData.get("file");

      if (!langVal || !todayVal) {
        return jsonError("language and today are required", 400);
      }

      language = SupportedLanguageSchema.parse(langVal.toString());
      today = todayVal.toString();

      if (textVal && typeof textVal === "string" && textVal.trim()) {
        text = textVal.trim();
      }

      if (fileVal && fileVal instanceof File && fileVal.size > 0) {
        if (fileVal.size > MAX_FILE_SIZE) {
          return jsonError("File too large (max 10 MB)", 400);
        }

        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/heic", "application/pdf"];
        if (!allowedTypes.includes(fileVal.type)) {
          return jsonError("Unsupported file type. Please upload an image (JPEG, PNG, WebP) or PDF.", 400);
        }

        const bytes = await fileVal.arrayBuffer();
        fileBase64 = Buffer.from(bytes).toString("base64");
        fileMime = fileVal.type;
      }
    } else {
      // JSON body
      const body = await request.json();
      const parsed = z
        .object({
          text: z.string().max(MAX_TEXT_LENGTH).optional(),
          language: SupportedLanguageSchema,
          today: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        })
        .safeParse(body);

      if (!parsed.success) {
        return jsonError(
          `Invalid request: ${parsed.error.issues.map((e) => e.message).join(", ")}`,
          400
        );
      }

      text = parsed.data.text?.trim();
      language = parsed.data.language;
      today = parsed.data.today;
    }

    // ── Validate we have input ─────────────────────────────────────────
    if (!text && !fileBase64) {
      return jsonError("Please provide either text or a file to explain.", 400);
    }

    if (text && text.length > MAX_TEXT_LENGTH) {
      return jsonError(`Text too long (max ${MAX_TEXT_LENGTH} characters)`, 400);
    }

    let transcription: string;

    // ── Step 1: Transcribe (images/PDFs only) ──────────────────────────
    if (fileBase64 && fileMime) {
      const prompts = transcribePrompt();

      const result = await callAndValidate(
        TranscriptionResultSchema,
        [
          { role: "system", content: prompts.system },
          { role: "user", content: prompts.user },
        ],
        fileBase64,
        fileMime
      );

      if (!result.readable) {
        return jsonError(
          "The image is not clear enough to read. Please upload a clearer photo with good lighting and no blur.",
          422
        );
      }

      if (!result.transcription || result.transcription.trim().length < 10) {
        return jsonError(
          "This doesn't look like a document. Please upload a photo of a letter, notice, or bill.",
          422
        );
      }

      transcription = result.transcription;
    } else {
      transcription = text!;
    }

    // ── Step 2: Explain ────────────────────────────────────────────────
    const prompts = explainPrompt(language, today);

    const explanation = await callAndValidate(ExplanationSchema, [
      { role: "system", content: prompts.system },
      { role: "user", content: prompts.user(transcription) },
    ]);

    // ── Grounding check ────────────────────────────────────────────────
    const groundingWarnings = checkGrounding(explanation, transcription);

    return NextResponse.json({
      transcription_used: transcription,
      explanation,
      grounding_warnings: groundingWarnings.length > 0 ? groundingWarnings : undefined,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred";

    console.error("Explain route error:", message);

    if (
      message.includes("insufficient_quota") ||
      message.includes("credit_balance_exhausted") ||
      message.includes("429")
    ) {
      return jsonError(
        "OpenAI quota exhausted: Your OpenAI account has no credits remaining. Please add credits at platform.openai.com/billing or switch to Gemini in .env.local.",
        429
      );
    }

    if (
      message.includes("401") ||
      message.includes("Incorrect API key") ||
      message.includes("API key not valid")
    ) {
      return jsonError(
        "Invalid API key. Please verify your LLM_API_KEY in .env.local.",
        401
      );
    }

    if (message.includes("LLM validation failed")) {
      return jsonError(
        "We had trouble understanding this document. Please try again or paste the text instead.",
        422
      );
    }

    if (message.includes("API error")) {
      return jsonError(
        `AI service error: ${message}`,
        502
      );
    }

    return jsonError(message, 500);
  }
}

