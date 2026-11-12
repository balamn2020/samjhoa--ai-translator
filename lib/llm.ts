/**
 * LLM adapter — provider-swappable via env vars with automatic multi-provider fallback.
 * Supports: gemini, openai-compatible.
 * Supports automatic fallback across providers or backup keys if one fails.
 * Uses JSON/structured-output mode, temperature 0.1.
 */

export type LLMProvider = "gemini" | "openai";

export interface ProviderConfig {
  provider: LLMProvider;
  apiKey: string;
  model: string;
  baseUrl?: string;
}

/**
 * Build the prioritized list of LLM providers/keys.
 * If one fails (quota, rate-limit, network, auth), the next one is automatically tried.
 */
export function getProviderConfigs(): ProviderConfig[] {
  const configs: ProviderConfig[] = [];

  const addKeys = (
    keysStr: string | undefined,
    provider: LLMProvider,
    model: string,
    baseUrl?: string
  ) => {
    if (!keysStr) return;
    const keys = keysStr.split(",").map((k) => k.trim()).filter(Boolean);
    for (const key of keys) {
      if (!configs.some((c) => c.apiKey === key && c.provider === provider)) {
        configs.push({ provider, apiKey: key, model, baseUrl });
      }
    }
  };

  const primaryProvider = (process.env.LLM_PROVIDER || "gemini") as LLMProvider;
  const primaryModel =
    process.env.LLM_MODEL ||
    (primaryProvider === "gemini" ? "gemini-3.5-flash-lite" : "gpt-4o");
  const primaryBaseUrl = process.env.LLM_BASE_URL;

  // 1. Primary keys
  addKeys(process.env.LLM_API_KEY, primaryProvider, primaryModel, primaryBaseUrl);

  // 2. Backup key for same provider
  addKeys(
    process.env.LLM_BACKUP_API_KEY || process.env.BACKUP_API_KEY,
    primaryProvider,
    primaryModel,
    primaryBaseUrl
  );

  // 3. Fallback provider & key
  const fallbackProvider = process.env.LLM_FALLBACK_PROVIDER as LLMProvider | undefined;
  if (fallbackProvider) {
    const fallbackModel =
      process.env.LLM_FALLBACK_MODEL ||
      (fallbackProvider === "gemini" ? "gemini-3.5-flash-lite" : "gpt-4o");
    const fallbackBaseUrl = process.env.LLM_FALLBACK_BASE_URL;
    addKeys(
      process.env.LLM_FALLBACK_API_KEY,
      fallbackProvider,
      fallbackModel,
      fallbackBaseUrl
    );
  }

  // 4. Convenience direct env vars (GEMINI_API_KEY, OPENAI_API_KEY)
  if (process.env.GEMINI_API_KEY) {
    addKeys(process.env.GEMINI_API_KEY, "gemini", "gemini-3.5-flash-lite");
  }
  if (process.env.OPENAI_API_KEY) {
    addKeys(process.env.OPENAI_API_KEY, "openai", "gpt-4o");
  }

  if (configs.length === 0) {
    throw new Error(
      "No LLM API keys configured. Please set LLM_API_KEY in your .env.local file."
    );
  }

  return configs;
}

export interface LLMMessage {
  role: "system" | "user";
  content: string;
}

export interface LLMCallOptions {
  messages: LLMMessage[];
  /** base64-encoded image data (for multimodal) */
  imageBase64?: string;
  /** MIME type of the image */
  imageMime?: string;
}

/**
 * Call the LLM with automatic fallback:
 * If the primary provider/key fails, automatically falls back to the next one and vice versa.
 */
export async function callLLM(options: LLMCallOptions): Promise<string> {
  const configs = getProviderConfigs();
  const errors: string[] = [];

  for (let i = 0; i < configs.length; i++) {
    const config = configs[i];
    const keyPreview =
      config.apiKey.length > 8
        ? `${config.apiKey.slice(0, 4)}...${config.apiKey.slice(-4)}`
        : "***";

    try {
      console.log(
        `[LLM] Attempt ${i + 1}/${configs.length}: trying ${config.provider} (${config.model}, key: ${keyPreview})`
      );

      if (config.provider === "gemini") {
        return await callGemini(config.apiKey, config.model, options);
      } else if (config.provider === "openai") {
        return await callOpenAI(config.apiKey, config.model, options, config.baseUrl);
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.warn(
        `[LLM] Provider ${config.provider} (${config.model}) failed: ${errMsg}`
      );
      errors.push(`${config.provider} (${config.model}): ${errMsg}`);

      if (i < configs.length - 1) {
        console.log(`[LLM] Falling back to next available provider...`);
      }
    }
  }

  throw new Error(`All LLM providers failed:\n${errors.join("\n")}`);
}

// ── Gemini ──────────────────────────────────────────────────────────────────

async function callGemini(
  apiKey: string,
  model: string,
  options: LLMCallOptions
): Promise<string> {
  const candidateModels = Array.from(
    new Set([model, "gemini-3.5-flash-lite", "gemini-3.5-flash", "gemini-3.8-flash"])
  );

  const systemInstruction = options.messages.find((m) => m.role === "system");
  const userMessage = options.messages.find((m) => m.role === "user");

  // Build parts for the user turn
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parts: any[] = [];

  if (options.imageBase64 && options.imageMime) {
    parts.push({
      inlineData: {
        mimeType: options.imageMime,
        data: options.imageBase64,
      },
    });
  }

  if (userMessage) {
    parts.push({ text: userMessage.content });
  }

  const body = {
    systemInstruction: systemInstruction
      ? { parts: [{ text: systemInstruction.content }] }
      : undefined,
    contents: [{ role: "user", parts }],
    generationConfig: {
      temperature: 0.1,
      responseMimeType: "application/json",
    },
  };

  let lastErr = "";

  for (const m of candidateModels) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${apiKey}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      lastErr = `Gemini API error ${res.status}: ${errText}`;
      // If 404 (retired model) or 503 (high demand), try the next Gemini candidate model
      if (res.status === 404 || res.status === 503) {
        console.warn(`[Gemini] Model ${m} returned ${res.status}. Retrying with alternate Gemini model...`);
        continue;
      }
      throw new Error(lastErr);
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error("No text in Gemini response");
    }

    return text;
  }

  throw new Error(lastErr || "Failed to get response from Gemini");
}

// ── OpenAI-compatible ───────────────────────────────────────────────────────

async function callOpenAI(
  apiKey: string,
  model: string,
  options: LLMCallOptions,
  baseUrlParam?: string
): Promise<string> {
  const baseUrl = baseUrlParam || process.env.LLM_BASE_URL || "https://api.openai.com/v1";
  const url = `${baseUrl}/chat/completions`;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const messages: any[] = [];

  for (const msg of options.messages) {
    if (msg.role === "system") {
      messages.push({ role: "system", content: msg.content });
    } else {
      if (options.imageBase64 && options.imageMime) {
        messages.push({
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: `data:${options.imageMime};base64,${options.imageBase64}`,
              },
            },
            { type: "text", text: msg.content },
          ],
        });
      } else {
        messages.push({ role: "user", content: msg.content });
      }
    }
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.1,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI API error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}
