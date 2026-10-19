import { describe, it, expect } from "vitest";
import { CURRICULUM_UNITS, getAllLessons } from "@/data/curriculum";

describe("Curriculum Integrity & Coverage", () => {
  it("should contain at least 10 curriculum units", () => {
    expect(CURRICULUM_UNITS.length).toBeGreaterThanOrEqual(10);
  });

  it("should contain at least 30 distinct lessons across the learning path", () => {
    const lessons = getAllLessons();
    expect(lessons.length).toBeGreaterThanOrEqual(30);

    // Verify all lesson IDs are unique
    const ids = lessons.map((l) => l.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(lessons.length);
  });

  it("should contain at least 300 individual exercise items", () => {
    const lessons = getAllLessons();
    const allExercises = lessons.flatMap((l) => l.exercises);
    expect(allExercises.length).toBeGreaterThanOrEqual(300);

    // Verify all exercise IDs are unique
    const exerciseIds = allExercises.map((e) => e.id);
    const uniqueExerciseIds = new Set(exerciseIds);
    expect(uniqueExerciseIds.size).toBe(allExercises.length);
  });

  it("should have valid prompts, answers, and explanations for every exercise", () => {
    const allExercises = getAllLessons().flatMap((l) => l.exercises);

    allExercises.forEach((ex) => {
      expect(ex.prompt).toBeDefined();
      expect(ex.prompt.length).toBeGreaterThan(0);
      expect(ex.correctAnswer).toBeDefined();
      expect(ex.explanation).toBeDefined();
      expect(ex.explanation.length).toBeGreaterThan(0);
      expect(ex.difficulty).toBeGreaterThanOrEqual(1);
    });
  });

  it("should map to JLPT N5 and N4 levels across early units", () => {
    const jlptLevels = new Set(CURRICULUM_UNITS.map((u) => u.jlpt));
    expect(jlptLevels.has("N5")).toBe(true);
    expect(jlptLevels.has("N4")).toBe(true);
  });
});
