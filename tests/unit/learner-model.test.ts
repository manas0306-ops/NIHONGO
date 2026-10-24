import { describe, it, expect } from "vitest";
import {
  classifyMistakeConcept,
  computeSkillMastery,
  identifyWeakAreas,
  INITIAL_LEARNER_MODEL,
} from "@/lib/learning/model";
import { MistakeRecord, SRSItem } from "@/types";

describe("Learner Model & Error-Driven Adaptive Learning", () => {
  it("should initialize with 0 mastery and separate progress from XP", () => {
    expect(INITIAL_LEARNER_MODEL.overallMastery).toBe(0);
    expect(INITIAL_LEARNER_MODEL.progressPercentage).toBe(0);
    expect(INITIAL_LEARNER_MODEL.skills.vocabulary.level).toBe(0);
    expect(INITIAL_LEARNER_MODEL.mistakes.length).toBe(0);
  });

  it("should classify particle confusion concepts automatically", () => {
    const classification = classifyMistakeConcept(
      "Choose the correct particle: 学校__行きます",
      "で",
      "に",
      "grammar"
    );
    expect(classification.errorType).toBe("particle_confusion");
    expect(classification.concept).toContain("で vs に");
  });

  it("should classify verb conjugation errors", () => {
    const classification = classifyMistakeConcept(
      "Convert 食べる to te-form:",
      "食べって",
      "食べて",
      "grammar"
    );
    expect(classification.errorType).toBe("verb_conjugation");
    expect(classification.concept).toContain("食べて");
  });

  it("should compute skill mastery from demonstrated SRS retention rather than XP", () => {
    const mockSRSItems: SRSItem[] = [
      {
        id: "srs_1",
        type: "vocabulary",
        key: "neko",
        japanese: "猫",
        reading: "ねこ",
        meaning: "Cat",
        intervalDays: 25,
        repetitions: 4,
        easeFactor: 2.6,
        dueDate: "2026-11-01T00:00:00.000Z",
        correctCount: 4,
        incorrectCount: 0,
        masteryLevel: "mastered",
      },
      {
        id: "srs_2",
        type: "vocabulary",
        key: "inu",
        japanese: "犬",
        reading: "いぬ",
        meaning: "Dog",
        intervalDays: 22,
        repetitions: 3,
        easeFactor: 2.5,
        dueDate: "2026-11-01T00:00:00.000Z",
        correctCount: 3,
        incorrectCount: 0,
        masteryLevel: "mastered",
      },
    ];

    const result = computeSkillMastery(mockSRSItems, [], 5, 30);
    expect(result.skills.vocabulary.itemsMastered).toBe(2);
    expect(result.skills.vocabulary.accuracy).toBe(100);
    expect(result.skills.vocabulary.level).toBeGreaterThan(0);
    // Progress percentage should be 5/30 = 17%
    expect(result.progressPercentage).toBe(17);
  });

  it("should extract top weak areas from unresolved mistakes", () => {
    const mistakes: MistakeRecord[] = [
      {
        id: "m1",
        skill: "grammar",
        concept: "助詞 (で vs に)",
        questionId: "q1",
        prompt: "学校__行きます",
        userAnswer: "で",
        correctAnswer: "に",
        errorType: "particle_confusion",
        timestamp: "2026-10-24T10:00:00.000Z",
        severity: "medium",
        resolved: false,
        reviewCount: 0,
      },
      {
        id: "m2",
        skill: "grammar",
        concept: "助詞 (で vs に)",
        questionId: "q2",
        prompt: "東京__着きました",
        userAnswer: "で",
        correctAnswer: "に",
        errorType: "particle_confusion",
        timestamp: "2026-10-24T11:00:00.000Z",
        severity: "medium",
        resolved: false,
        reviewCount: 0,
      },
      {
        id: "m3",
        skill: "kana",
        concept: "仮名 (さ / き)",
        questionId: "q3",
        prompt: "Which is 'sa'?",
        userAnswer: "き",
        correctAnswer: "さ",
        errorType: "kana_confusion",
        timestamp: "2026-10-24T09:00:00.000Z",
        severity: "low",
        resolved: false,
        reviewCount: 0,
      },
    ];

    const weakAreas = identifyWeakAreas(mistakes);
    expect(weakAreas.length).toBe(2);
    // Top weak area should be "助詞 (で vs に)" because it occurred 2 times
    expect(weakAreas[0].concept).toBe("助詞 (で vs に)");
    expect(weakAreas[0].errorCount).toBe(2);
    expect(weakAreas[1].concept).toBe("仮名 (さ / き)");
    expect(weakAreas[1].errorCount).toBe(1);
  });

  it("should exclude resolved mistakes from active weak areas", () => {
    const mistakes: MistakeRecord[] = [
      {
        id: "m1",
        skill: "grammar",
        concept: "助詞 (で vs に)",
        questionId: "q1",
        prompt: "学校__行きます",
        userAnswer: "で",
        correctAnswer: "に",
        errorType: "particle_confusion",
        timestamp: "2026-10-24T10:00:00.000Z",
        severity: "medium",
        resolved: true, // Marked resolved!
        reviewCount: 1,
      },
    ];

    const weakAreas = identifyWeakAreas(mistakes);
    expect(weakAreas.length).toBe(0);
  });
});
