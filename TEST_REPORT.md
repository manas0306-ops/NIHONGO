# TEST REPORT — NEKONI HONGO (猫日本語)

**Project:** NekoNihongo (猫日本語)  
**Repository:** [https://github.com/manas0306-ops/NIHONGO](https://github.com/manas0306-ops/NIHONGO)  
**Live Site:** [https://manas0306-ops.github.io/NIHONGO/](https://manas0306-ops.github.io/NIHONGO/)  
**Test Runner:** Vitest v3.2.7 (Node.js runtime)  
**Date:** November 2026  
**Auditor / Lead QA Engineer:** Maanas Pandey  

---

## 1. Test Suite Execution Summary

| Suite / Test File | Tests Passed | Tests Failed | Execution Time | Scope / Core Validations |
|---|:---:|:---:|:---:|---|
| `tests/unit/content-validation.test.ts` | 15 | 0 | ~154 ms | Curriculum exercise keys, grammar database, kanji database, vocabulary database, katakana dakuon/yoon coverage, stories, backup export & import validation. |
| `tests/unit/sm2.test.ts` | 8 | 0 | ~31 ms | SuperMemo SM-2 interval calculations, ease factor floor, due item filtering, blackout (grade 0), memory lapse tracking. |
| `tests/unit/day-night-mode.test.ts` | 13 | 0 | ~19 ms | 7 Japanese stationery themes across dark/light mode, WCAG AA contrast ratio compliance (>= 4.5:1). |
| `tests/unit/learner-model.test.ts` | 6 | 0 | ~33 ms | Demonstrated skill mastery matrix calculation, mistake tracking and targeted resolution. |
| `tests/unit/lesson-engine.test.ts` | 3 | 0 | ~24 ms | Interactive lesson execution, answer normalization, progression states. |
| `tests/unit/gamification.test.ts` | 7 | 0 | ~21 ms | Streak calculations, freeze protections, level scaling curves, quest progression. |
| `tests/unit/speech.test.ts` | 4 | 0 | ~23 ms | Web speech synthesis singleton, speech rate adjustment, browser audio fallback detection. |
| `tests/unit/curriculum.test.ts` | 5 | 0 | ~182 ms | Unit linkings, exercise sequencing, milestone unlock verification. |
| **TOTAL** | **61** | **0** | **~487 ms** | **100% Pass Rate Across All Suites** |

---

## 2. Detailed Test Results by Domain

### 2.1 Content Validation & Pedagogical Data Integrity (`content-validation.test.ts`)
- **Exercise Option Containment**: Validated that 100% of `multiple_choice` and `listen_select` exercises have their `correctAnswer` in the `options` array.
- **Pair Matching Verification**: Validated that all `match_pairs` exercises contain valid Japanese and English tokens.
- **Word Bank Verification**: Validated tokenized word banks and target answers.
- **Unique Exercise ID Invariant**: Ensured zero duplicated IDs across all 8 curriculum units.
- **Exercise Explanations**: Verified non-empty, pedagogically helpful explanations on every exercise.
- **Grammar Database (21 entries)**: Verified valid patterns, formations, meanings, and examples.
- **Kanji Database (57 entries)**: Verified stroke counts (>= 1), Joyo grades, valid JLPT ratings, On'yomi/Kun'yomi readings, and contextual reading guides.
- **Vocabulary Database (63 entries)**: Verified words, readings, meanings, parts of speech, and nuance notes.
- **Kana Orthographic Coverage**: Verified full Gojūon (46), Dakuon (20), Handakuon (5), and Yōon (12) coverage.
- **Backup Engine Verification**: Verified JSON export bundling and rejection of malformed or invalid schemas.

### 2.2 Spaced Repetition Engine (`sm2.test.ts`)
- **Initial Review Interval**: First success (grade 5) sets interval = 1, repetitions = 1.
- **Second Review Interval**: Second success sets interval = 6, repetitions = 2.
- **EF Multiplier Scaling**: Subsequent reviews scale interval by ease factor.
- **Mastery Promotion**: Interval >= 21 days promotes card to `"mastered"`.
- **Blackout & Failure Handling**: Grade < 3 resets interval = 1 and repetitions = 0.
- **Ease Factor Floor**: Verified ease factor never drops below 1.3 even under repeated failure.
- **Lapse Tracking**: Confirmed that previously learned cards increment `lapses` upon failure, while unlearned cards do not.
- **Due Item Filtering**: Verified accurate isolation of due and overdue flashcards.

### 2.3 Visual Contrast & Day/Night Mode (`day-night-mode.test.ts`)
- Verified all 7 themes (`sakura`, `matcha`, `midnight`, `zen`, `ocean`, `autumn`, `lantern`) define accessible surface, ink, subtle, card, and border colors.
- Verified WCAG AA contrast ratio compliance (`>= 4.5:1`) for normal text across light and dark modes.

---

## 3. Production Build & Static Export Validation

- **Command:** `npm run build` (`next build`)
- **Configuration:** `output: "export"`, `trailingSlash: true`, `images.unoptimized: true`
- **Artifact:** Pure static bundle written to `./out` directory
- **GitHub Pages Base Path:** `/NIHONGO`
- **Static Routes Exported:**
  - `/` (Home)
  - `/learn` (Course Map)
  - `/lesson/[id]` (All curriculum lessons)
  - `/kana` (Kana Dojo)
  - `/kanji` (Kanji Lab)
  - `/vocabulary` (Lexicon)
  - `/grammar` (Grammar Deep-Dive)
  - `/stories` (Immersion)
  - `/listening` (Listening Studio)
  - `/review` (Spaced Repetition)
  - `/quests` (Daily Quests)
  - `/profile` (Learner Profile)
  - `/settings` (Settings & Backups)
  - `404.html` (Static Fallback Page)

---

*All 61 automated tests passing. Zero regressions. Build validated for production deployment.*
