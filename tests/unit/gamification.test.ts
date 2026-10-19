import { describe, it, expect } from "vitest";
import {
  updateStreak,
  calculateLevel,
  INITIAL_GAMIFICATION_STATE,
  getLocalDateString,
} from "@/lib/gamification/engine";

describe("Gamification Engine", () => {
  it("should initialize streak to 1 on first active day", () => {
    const res = updateStreak(INITIAL_GAMIFICATION_STATE, "2026-10-19");
    expect(res.newStreak).toBe(1);
    expect(res.streakFreezeUsed).toBe(false);
  });

  it("should not increment streak twice on the same day", () => {
    const state = {
      ...INITIAL_GAMIFICATION_STATE,
      streak: 5,
      lastActiveDate: "2026-10-19",
    };
    const res = updateStreak(state, "2026-10-19");
    expect(res.newStreak).toBe(5);
  });

  it("should increment streak on consecutive calendar day", () => {
    const state = {
      ...INITIAL_GAMIFICATION_STATE,
      streak: 5,
      lastActiveDate: "2026-10-18",
    };
    const res = updateStreak(state, "2026-10-19");
    expect(res.newStreak).toBe(6);
    expect(res.streakFreezeUsed).toBe(false);
  });

  it("should use streak freeze when one day is missed", () => {
    const state = {
      ...INITIAL_GAMIFICATION_STATE,
      streak: 5,
      lastActiveDate: "2026-10-17",
      streakFreeze: 1,
    };
    const res = updateStreak(state, "2026-10-19");
    expect(res.newStreak).toBe(6);
    expect(res.streakFreezeUsed).toBe(true);
    expect(res.updatedStreakFreeze).toBe(0);
  });

  it("should reset streak to 1 when multiple days are missed without freeze", () => {
    const state = {
      ...INITIAL_GAMIFICATION_STATE,
      streak: 5,
      lastActiveDate: "2026-10-10",
      streakFreeze: 0,
    };
    const res = updateStreak(state, "2026-10-19");
    expect(res.newStreak).toBe(1);
    expect(res.streakFreezeUsed).toBe(false);
  });

  it("should calculate progressive user levels from XP", () => {
    expect(calculateLevel(0)).toBe(1);
    expect(calculateLevel(50)).toBe(2);
    expect(calculateLevel(200)).toBe(3);
    expect(calculateLevel(450)).toBe(4);
    expect(calculateLevel(800)).toBe(5);
  });

  it("should format date correctly using local timezone", () => {
    const date = new Date("2026-10-19T23:00:00Z");
    const formatted = getLocalDateString(date, "UTC");
    expect(formatted).toBe("2026-10-19");
  });
});
