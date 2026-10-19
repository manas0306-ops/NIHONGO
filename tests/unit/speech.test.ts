import { describe, it, expect } from "vitest";
import { normalizeJapaneseText, compareSpeechRecognition } from "@/lib/audio/speech";

describe("Speech Synthesis & Recognition Utilities", () => {
  it("should normalize Japanese text by removing punctuation and whitespace", () => {
    expect(normalizeJapaneseText("こんにちは、世界！")).toBe("こんにちは世界");
    expect(normalizeJapaneseText(" 私 は　学生 です。 ")).toBe("私は学生です");
    expect(normalizeJapaneseText("水 を のみます？")).toBe("水をのみます");
  });

  it("should evaluate exact speech match as 100% score", () => {
    const res = compareSpeechRecognition("おはようございます", "おはようございます");
    expect(res.isMatch).toBe(true);
    expect(res.score).toBe(100);
  });

  it("should evaluate close speech pronunciation with Levenshtein similarity", () => {
    // 9 out of 10 matching characters
    const res = compareSpeechRecognition("おはようございま", "おはようございます");
    expect(res.score).toBeGreaterThanOrEqual(80);
    expect(res.isMatch).toBe(true);
  });

  it("should reject completely divergent speech recognition text", () => {
    const res = compareSpeechRecognition("さようなら", "おはようございます");
    expect(res.isMatch).toBe(false);
    expect(res.score).toBeLessThan(50);
  });
});
