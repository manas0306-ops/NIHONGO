import { describe, it, expect } from "vitest";
import { calculateSM2, getDueItems, createSRSItem } from "@/lib/spaced-repetition/sm2";
import { SRSItem } from "@/types";

describe("SM-2 Spaced Repetition Engine", () => {
  it("should initialize interval to 1 on first successful review (grade 5)", () => {
    const res = calculateSM2(5, 0, 0, 2.5, new Date("2026-10-19T12:00:00Z"));
    expect(res.repetitions).toBe(1);
    expect(res.intervalDays).toBe(1);
    expect(res.masteryLevel).toBe("learning");
    expect(res.easeFactor).toBeGreaterThanOrEqual(2.5);
  });

  it("should advance interval to 6 on second successful review (grade 4)", () => {
    const res = calculateSM2(4, 1, 1, 2.5, new Date("2026-10-19T12:00:00Z"));
    expect(res.repetitions).toBe(2);
    expect(res.intervalDays).toBe(6);
    expect(res.masteryLevel).toBe("reviewing");
  });

  it("should multiply interval by ease factor on subsequent reviews", () => {
    const res = calculateSM2(4, 2, 6, 2.5, new Date("2026-10-19T12:00:00Z"));
    expect(res.repetitions).toBe(3);
    expect(res.intervalDays).toBe(15);
  });

  it("should mark item as mastered when interval reaches 21 days or more", () => {
    const res = calculateSM2(5, 3, 15, 2.5, new Date("2026-10-19T12:00:00Z"));
    expect(res.intervalDays).toBeGreaterThanOrEqual(21);
    expect(res.masteryLevel).toBe("mastered");
  });

  it("should reset repetitions to 0 and interval to 1 on failure (grade < 3)", () => {
    const res = calculateSM2(2, 5, 30, 2.6, new Date("2026-10-19T12:00:00Z"));
    expect(res.repetitions).toBe(0);
    expect(res.intervalDays).toBe(1);
    expect(res.masteryLevel).toBe("learning");
  });

  it("should never let ease factor drop below 1.3", () => {
    let ef = 1.35;
    for (let i = 0; i < 5; i++) {
      const res = calculateSM2(0, 0, 1, ef);
      ef = res.easeFactor;
    }
    expect(ef).toBeGreaterThanOrEqual(1.3);
  });

  it("should accurately filter due items", () => {
    const pastItem: SRSItem = {
      ...createSRSItem("kana", "a", "あ", "a", "a"),
      dueDate: "2026-10-01T00:00:00Z",
    };
    const futureItem: SRSItem = {
      ...createSRSItem("kana", "i", "い", "i", "i"),
      dueDate: "2026-12-01T00:00:00Z",
    };

    const due = getDueItems([pastItem, futureItem], new Date("2026-10-19T12:00:00Z"));
    expect(due.length).toBe(1);
    expect(due[0].key).toBe("a");
  });
});
