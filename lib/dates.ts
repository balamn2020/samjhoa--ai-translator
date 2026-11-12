/**
 * Date utilities: compute countdown, urgency, and ISO dates.
 * All date math happens in code, never in the LLM.
 */

/**
 * Parse an ISO date string and return a Date in Asia/Kolkata.
 */
export function parseDate(iso: string): Date | null {
  const d = new Date(iso + "T00:00:00+05:30");
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Get today's date string in Asia/Kolkata timezone (YYYY-MM-DD).
 */
export function getTodayIST(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

export interface CountdownResult {
  days: number;
  label: string;
  urgency: "overdue" | "urgent" | "soon" | "normal" | "unknown";
}

/**
 * Calculate countdown from today to a deadline.
 */
export function countdown(
  deadlineIso: string | null,
  todayIso: string
): CountdownResult {
  if (!deadlineIso) {
    return { days: 0, label: "No deadline stated", urgency: "unknown" };
  }

  const deadline = parseDate(deadlineIso);
  const today = parseDate(todayIso);

  if (!deadline || !today) {
    return { days: 0, label: "Could not parse date", urgency: "unknown" };
  }

  const diffMs = deadline.getTime() - today.getTime();
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  let urgency: CountdownResult["urgency"];
  let label: string;

  if (days < 0) {
    urgency = "overdue";
    label = `${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} overdue`;
  } else if (days === 0) {
    urgency = "urgent";
    label = "Due today";
  } else if (days <= 3) {
    urgency = "urgent";
    label = `${days} day${days === 1 ? "" : "s"} left`;
  } else if (days <= 7) {
    urgency = "soon";
    label = `${days} days left`;
  } else {
    urgency = "normal";
    label = `${days} days left`;
  }

  return { days, label, urgency };
}

