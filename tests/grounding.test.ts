import { isGrounded, checkGrounding } from "../lib/grounding";

describe("isGrounded", () => {
  const source = "Your EMI of Rs. 12,500 is due on 15-Dec-2025. Please pay before the due date to avoid penalty charges of Rs. 500.";

  test("exact substring match", () => {
    expect(isGrounded("Rs. 12,500", source)).toBe(true);
  });

  test("case insensitive match", () => {
    expect(isGrounded("rs. 12,500", source)).toBe(true);
    expect(isGrounded("RS. 12,500", source)).toBe(true);
  });

  test("whitespace normalised match", () => {
    expect(isGrounded("Rs.  12,500", source)).toBe(true);
  });

  test("returns false for fabricated quote", () => {
    expect(isGrounded("Rs. 25,000", source)).toBe(false);
  });

  test("returns false for empty quote", () => {
    expect(isGrounded("", source)).toBe(false);
  });

  test("returns false for empty source", () => {
    expect(isGrounded("test", "")).toBe(false);
  });

  test("handles smart quotes", () => {
    const smartSource = 'Please pay "immediately"';
    expect(isGrounded('"immediately"', smartSource)).toBe(true);
  });

  test("handles punctuation-stripped fallback", () => {
    expect(isGrounded("penalty charges of Rs 500", source)).toBe(true);
  });
});

describe("checkGrounding", () => {
  const transcription = "Your account 1234 has a balance of Rs. 5,000. Pay by 31-Jan-2026. Contact: SBI helpline 1800-425-3800.";

  test("marks ungrounded what_they_want as low confidence", () => {
    const explanation = {
      what_they_want: [
        { action: "Pay balance", source_quote: "balance of Rs. 5,000", confidence: "high" },
        { action: "Visit branch", source_quote: "visit your nearest branch", confidence: "high" },
      ],
      deadline: { date_iso: "2026-01-31", description: "Pay by Jan 31", source_quote: "Pay by 31-Jan-2026" },
      money: [],
      red_flags: [],
      who_to_contact: [],
    };

    const warnings = checkGrounding(explanation, transcription);
    expect(warnings).toHaveLength(1);
    expect(warnings[0].path).toBe("what_they_want[1].source_quote");
    expect(explanation.what_they_want[1].confidence).toBe("low");
    expect(explanation.what_they_want[0].confidence).toBe("high");
  });

  test("returns empty warnings when all grounded", () => {
    const explanation = {
      what_they_want: [
        { action: "Pay", source_quote: "balance of Rs. 5,000", confidence: "high" },
      ],
      deadline: { date_iso: null, description: "Not stated", source_quote: null },
      money: [{ label: "Balance", amount: "5000", due: null, source_quote: "Rs. 5,000" }],
      red_flags: [],
      who_to_contact: [{ name: "SBI", detail: "1800-425-3800", source_quote: "SBI helpline 1800-425-3800" }],
    };

    const warnings = checkGrounding(explanation, transcription);
    expect(warnings).toHaveLength(0);
  });
});

