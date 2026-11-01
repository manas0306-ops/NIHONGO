import { describe, it, expect } from "vitest";
import { CURRICULUM_UNITS, getAllLessons } from "@/data/curriculum";
import { GRAMMAR_DATABASE } from "@/data/grammar";
import { KANJI_DATABASE } from "@/data/kanji";
import { VOCABULARY_DATABASE } from "@/data/vocabulary";
import { HIRAGANA_CHARACTERS, KATAKANA_CHARACTERS, SIMILAR_KANA_PAIRS } from "@/data/kana";
import { STORIES_DATABASE } from "@/data/stories";
import { AppDataStore } from "@/lib/database/store";

describe("Content Validation & Pedagogical Data Integrity Suite", () => {
  describe("Curriculum Exercises Integrity", () => {
    const allLessons = getAllLessons();
    const allExercises = allLessons.flatMap((l) => l.exercises);

    it("verifies every multiple_choice and listening exercise contains valid correctAnswer in its options", () => {
      allExercises.forEach((ex) => {
        if (ex.type === "multiple_choice" || ex.type === "listen_select") {
          expect(ex.options, `Exercise ${ex.id} must define options`).toBeDefined();
          expect(ex.options!.length, `Exercise ${ex.id} must have at least 2 options`).toBeGreaterThanOrEqual(2);
          const answerStr = Array.isArray(ex.correctAnswer) ? ex.correctAnswer[0] : ex.correctAnswer;
          expect(
            ex.options!.includes(answerStr),
            `Exercise ${ex.id} correctAnswer "${answerStr}" not found in options: ${ex.options!.join(", ")}`
          ).toBe(true);
        }
      });
    });

    it("verifies matching_pairs exercises have valid paired items", () => {
      allExercises.forEach((ex) => {
        if (ex.type === "match_pairs") {
          expect(ex.pairs, `Matching exercise ${ex.id} must define pairs`).toBeDefined();
          expect(ex.pairs!.length, `Matching exercise ${ex.id} must have pairs`).toBeGreaterThanOrEqual(2);
          ex.pairs!.forEach((p) => {
            expect(p.japanese.trim().length).toBeGreaterThan(0);
            expect(p.english.trim().length).toBeGreaterThan(0);
          });
        }
      });
    });

    it("verifies word_bank exercises contain valid tokenized words", () => {
      allExercises.forEach((ex) => {
        if (ex.type === "word_bank") {
          expect(ex.wordBank, `Word bank exercise ${ex.id} must define wordBank`).toBeDefined();
          expect(ex.wordBank!.length, `Word bank exercise ${ex.id} must have word chips`).toBeGreaterThanOrEqual(2);
          const answerStr = Array.isArray(ex.correctAnswer) ? ex.correctAnswer.join("") : ex.correctAnswer;
          expect(answerStr.trim().length).toBeGreaterThan(0);
        }
      });
    });

    it("verifies no duplicate exercise IDs exist across the entire curriculum", () => {
      const idMap = new Map<string, number>();
      allExercises.forEach((ex) => {
        idMap.set(ex.id, (idMap.get(ex.id) || 0) + 1);
      });

      const duplicates = Array.from(idMap.entries()).filter(([_, count]) => count > 1);
      expect(duplicates, `Found duplicate exercise IDs: ${JSON.stringify(duplicates)}`).toEqual([]);
    });

    it("verifies non-empty explanations for all exercises", () => {
      allExercises.forEach((ex) => {
        expect(ex.explanation, `Exercise ${ex.id} missing explanation`).toBeDefined();
        expect(ex.explanation.trim().length, `Exercise ${ex.id} explanation is empty`).toBeGreaterThan(5);
      });
    });
  });

  describe("Grammar Database Integrity", () => {
    it("ensures every grammar rule has unique ID, JLPT level, formation, and examples", () => {
      expect(GRAMMAR_DATABASE.length).toBeGreaterThanOrEqual(20);
      const ids = new Set<string>();
      GRAMMAR_DATABASE.forEach((entry) => {
        expect(ids.has(entry.id), `Duplicate grammar ID: ${entry.id}`).toBe(false);
        ids.add(entry.id);

        expect(entry.pattern.trim().length).toBeGreaterThan(0);
        expect(entry.formation.trim().length).toBeGreaterThan(0);
        expect(entry.meaning.trim().length).toBeGreaterThan(0);
        expect(entry.commonMistakes.trim().length).toBeGreaterThan(0);
        expect(entry.examples.length).toBeGreaterThanOrEqual(1);

        entry.examples.forEach((ex) => {
          expect(ex.japanese.trim().length).toBeGreaterThan(0);
          expect(ex.romaji.trim().length).toBeGreaterThan(0);
          expect(ex.english.trim().length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe("Kanji Database Integrity", () => {
    it("ensures all kanji items have valid characters, readings, and stroke counts", () => {
      expect(KANJI_DATABASE.length).toBeGreaterThanOrEqual(40);

      KANJI_DATABASE.forEach((kanji) => {
        expect(kanji.character.trim().length).toBe(1);
        expect(kanji.meaning.trim().length).toBeGreaterThan(0);
        expect(kanji.strokes).toBeGreaterThanOrEqual(1);
        expect(kanji.onyomi.length + kanji.kunyomi.length).toBeGreaterThanOrEqual(1);
        expect(["N5", "N4", "N3", "N2", "N1"]).toContain(kanji.jlpt);
        expect(kanji.examples.length).toBeGreaterThanOrEqual(2);
      });
    });
  });

  describe("Vocabulary Database Integrity", () => {
    it("ensures all vocabulary items have word, reading, meaning, and part of speech", () => {
      expect(VOCABULARY_DATABASE.length).toBeGreaterThanOrEqual(45);

      VOCABULARY_DATABASE.forEach((vocab) => {
        expect(vocab.id.trim().length).toBeGreaterThan(0);
        expect(vocab.japanese.trim().length).toBeGreaterThan(0);
        expect(vocab.reading.trim().length).toBeGreaterThan(0);
        expect(vocab.meaning.trim().length).toBeGreaterThan(0);
        expect(["N5", "N4", "N3", "N2", "N1"]).toContain(vocab.jlpt);
      });
    });
  });

  describe("Kana Database Coverage", () => {
    it("contains standard gojuon hiragana coverage (a through n)", () => {
      expect(HIRAGANA_CHARACTERS.length).toBeGreaterThanOrEqual(46);
      const essentialKana = ["あ", "い", "う", "え", "お", "か", "さ", "た", "な", "は", "ま", "や", "ら", "わ", "ん"];
      const kanaSet = new Set(HIRAGANA_CHARACTERS.map((k) => k.kana));
      essentialKana.forEach((k) => {
        expect(kanaSet.has(k), `Missing essential hiragana: ${k}`).toBe(true);
      });
    });

    it("contains standard katakana coverage across gojuon, dakuten, handakuten, and yoon", () => {
      expect(KATAKANA_CHARACTERS.length).toBeGreaterThanOrEqual(75);
      const essentialKatakana = ["ア", "イ", "ウ", "エ", "オ", "カ", "サ", "タ", "ナ", "ハ", "マ", "ヤ", "ラ", "ワ", "ン"];
      const katakanaSet = new Set(KATAKANA_CHARACTERS.map((k) => k.kana));
      essentialKatakana.forEach((k) => {
        expect(katakanaSet.has(k), `Missing essential katakana: ${k}`).toBe(true);
      });

      // Verify dakuten, handakuten, and yoon presence (DEFECT-01 fix)
      const categories = new Set(KATAKANA_CHARACTERS.map((k) => k.category));
      expect(categories.has("gojuon")).toBe(true);
      expect(categories.has("dakuten")).toBe(true);
      expect(categories.has("handakuten")).toBe(true);
      expect(categories.has("yoon")).toBe(true);
    });

    it("contains confused kana pairs with distinct visual/mnemonic comparisons", () => {
      expect(SIMILAR_KANA_PAIRS.length).toBeGreaterThanOrEqual(2);
      SIMILAR_KANA_PAIRS.forEach((item) => {
        expect(item.pair.length).toBeGreaterThanOrEqual(2);
        expect(item.explanation.length).toBeGreaterThan(5);
      });
    });
  });

  describe("Stories & Immersion Dialogue Integrity", () => {
    it("ensures all immersion stories have lines and check questions", () => {
      expect(STORIES_DATABASE.length).toBeGreaterThanOrEqual(2);
      STORIES_DATABASE.forEach((story) => {
        expect(story.id).toBeDefined();
        expect(story.title.length).toBeGreaterThan(0);
        expect(story.dialogue.length).toBeGreaterThanOrEqual(2);
        story.dialogue.forEach((line) => {
          expect(line.japanese.length).toBeGreaterThan(0);
          expect(line.english.length).toBeGreaterThan(0);
        });
        expect(story.questions.length).toBeGreaterThanOrEqual(1);
      });
    });
  });

  describe("Data Backup & Restore Engine (DEFECT-06)", () => {
    it("exports valid JSON with bundle metadata and data sections", () => {
      const store = AppDataStore.getInstance();
      const exported = store.exportUserDataJson();
      const parsed = JSON.parse(exported);
      expect(parsed.version).toBe("1.0");
      expect(parsed.appName).toBe("NekoNihongo");
      expect(parsed.data).toBeDefined();
    });

    it("gracefully catches and rejects malformed JSON on import", () => {
      const store = AppDataStore.getInstance();
      const res = store.importUserDataJson("{ invalid json");
      expect(res.success).toBe(false);
      expect(res.error).toBeDefined();
    });

    it("rejects payload missing root data object", () => {
      const store = AppDataStore.getInstance();
      const res = store.importUserDataJson(JSON.stringify({ notData: true }));
      expect(res.success).toBe(false);
      expect(res.error).toContain("missing root data object");
    });
  });
});
