/**
 * Grounding check: verify source_quote fields are actual substrings of the transcription.
 * Uses case-insensitive, whitespace-normalised matching with minor punctuation tolerance.
 */

function normalise(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\s]+/g, " ")          // collapse whitespace
    .replace(/[""'']/g, '"')          // normalise smart quotes
    .replace(/–/g, "-")              // en-dash → hyphen
    .replace(/—/g, "-")              // em-dash → hyphen
    .trim();
}

/**
 * Returns true if `quote` is found (fuzzy) inside `source`.
 */
export function isGrounded(quote: string, source: string): boolean {
  if (!quote || !source) return false;
  const nq = normalise(quote);
  const ns = normalise(source);
  if (ns.includes(nq)) return true;

  // Try stripping all punctuation as a last resort
  const stripPunct = (s: string) => s.replace(/[.,;:!?'"()\-\/\\]/g, "").replace(/\s+/g, " ").trim();
  return stripPunct(ns).includes(stripPunct(nq));
}

export interface GroundingWarning {
  path: string;
  quote: string;
}

/**
 * Walk the explanation object and check every source_quote.
 * Returns list of ungrounded paths and mutates confidence to "low" where applicable.
 */
export function checkGrounding(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  explanation: any,
  transcription: string
): GroundingWarning[] {
  const warnings: GroundingWarning[] = [];

  // what_they_want[].source_quote
  if (Array.isArray(explanation.what_they_want)) {
    explanation.what_they_want.forEach(
      (item: { source_quote: string; confidence: string }, i: number) => {
        if (item.source_quote && !isGrounded(item.source_quote, transcription)) {
          item.confidence = "low";
          warnings.push({ path: `what_they_want[${i}].source_quote`, quote: item.source_quote });
        }
      }
    );
  }

  // deadline.source_quote
  if (explanation.deadline?.source_quote && !isGrounded(explanation.deadline.source_quote, transcription)) {
    warnings.push({ path: "deadline.source_quote", quote: explanation.deadline.source_quote });
  }

  // money[].source_quote
  if (Array.isArray(explanation.money)) {
    explanation.money.forEach(
      (item: { source_quote: string }, i: number) => {
        if (item.source_quote && !isGrounded(item.source_quote, transcription)) {
          warnings.push({ path: `money[${i}].source_quote`, quote: item.source_quote });
        }
      }
    );
  }

  // red_flags[].source_quote
  if (Array.isArray(explanation.red_flags)) {
    explanation.red_flags.forEach(
      (item: { source_quote: string | null }, i: number) => {
        if (item.source_quote && !isGrounded(item.source_quote, transcription)) {
          warnings.push({ path: `red_flags[${i}].source_quote`, quote: item.source_quote });
        }
      }
    );
  }

  // who_to_contact[].source_quote
  if (Array.isArray(explanation.who_to_contact)) {
    explanation.who_to_contact.forEach(
      (item: { source_quote: string }, i: number) => {
        if (item.source_quote && !isGrounded(item.source_quote, transcription)) {
          warnings.push({ path: `who_to_contact[${i}].source_quote`, quote: item.source_quote });
        }
      }
    );
  }

  return warnings;
}

