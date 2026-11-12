import { countdown, getTodayIST, parseDate } from "../lib/dates";

describe("parseDate", () => {
  test("parses valid ISO date", () => {
    const d = parseDate("2025-12-15");
    expect(d).not.toBeNull();
    expect(d!.getFullYear()).toBe(2025);
  });

  test("returns null for invalid date", () => {
    expect(parseDate("not-a-date")).toBeNull();
    expect(parseDate("")).toBeNull();
  });
});

describe("getTodayIST", () => {
  test("returns YYYY-MM-DD format", () => {
    const today = getTodayIST();
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("countdown", () => {
  const today = "2025-12-10";

  test("normal deadline in the future", () => {
    const result = countdown("2025-12-25", today);
    expect(result.days).toBe(15);
    expect(result.urgency).toBe("normal");
    expect(result.label).toBe("15 days left");
  });

  test("urgent deadline (3 days)", () => {
    const result = countdown("2025-12-13", today);
    expect(result.days).toBe(3);
    expect(result.urgency).toBe("urgent");
  });

  test("due today", () => {
    const result = countdown("2025-12-10", today);
    expect(result.days).toBe(0);
    expect(result.urgency).toBe("urgent");
    expect(result.label).toBe("Due today");
  });

  test("overdue", () => {
    const result = countdown("2025-12-05", today);
    expect(result.days).toBe(-5);
    expect(result.urgency).toBe("overdue");
    expect(result.label).toContain("overdue");
  });

  test("soon (5 days)", () => {
    const result = countdown("2025-12-15", today);
    expect(result.days).toBe(5);
    expect(result.urgency).toBe("soon");
  });

  test("null deadline", () => {
    const result = countdown(null, today);
    expect(result.urgency).toBe("unknown");
    expect(result.label).toBe("No deadline stated");
  });

  test("singular day label", () => {
    const result = countdown("2025-12-11", today);
    expect(result.days).toBe(1);
    expect(result.label).toBe("1 day left");
  });

  test("1 day overdue singular", () => {
    const result = countdown("2025-12-09", today);
    expect(result.days).toBe(-1);
    expect(result.label).toBe("1 day overdue");
  });
});

