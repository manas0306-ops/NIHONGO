import { describe, it, expect } from "vitest";
import { classifyMistakeConcept } from "@/lib/learning/model";
import { createSRSItem } from "@/lib/spaced-repetition/sm2";

describe("Intelligent Exercise Feedback & Lesson-to-SRS Pipeline", () => {
  it("should generate detailed mistake records with pedagogical concept labels", () => {
    const prompt = "Select the correct particle for location of action: 図書館__勉強します";
    const userAnswer = "に";
    const correctAnswer = "で";
    const skill = "grammar";

    const { concept, errorType } = classifyMistakeConcept(prompt, userAnswer, correctAnswer, skill);
    expect(errorType).toBe("particle_confusion");
    expect(concept).toContain("で vs に");
  });

  it("should create valid SRS items for newly learned lesson content", () => {
    const item = createSRSItem("vocabulary", "lex_u1_l1_e8", "あい", "ai", "Love");
    expect(item.id).toBe("srs_vocabulary_lex_u1_l1_e8");
    expect(item.japanese).toBe("あ い".replace(" ", ""));
    expect(item.intervalDays).toBe(0);
    expect(item.repetitions).toBe(0);
    expect(item.easeFactor).toBe(2.5);
    expect(item.masteryLevel).toBe("learning");
  });

  it("should create valid SRS items for pair-matching exercises", () => {
    const pairItem = createSRSItem("vocabulary", "pair_p1", "あ", "a", "sound 'a'");
    expect(pairItem.key).toBe("pair_p1");
    expect(pairItem.japanese).toBe("あ");
    expect(pairItem.type).toBe("vocabulary");
  });
});
