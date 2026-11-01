# CHANGELOG — NEKONI HONGO (猫日本語)

All notable changes to the NekoNihongo platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.0] - 2026-11-02

### Added
- **Katakana Dakuon, Handakuon & Yōon (DEFECT-01 Fix)**:
  - Added 20 Dakuon characters (ガ through ボ).
  - Added 5 Handakuon characters (パ through ポ).
  - Added 12 Yōon combinations (キャ through ミョ).
  - Expanded Katakana database from 46 to 83 characters.
- **Kana Orthographic Special Rules**:
  - Sokuon (促音) small っ geminate consonant pause guide.
  - Chōonpu (長音符) ー loanword long vowel elongation guide.
  - Particle pronunciation shift rules for は (wa), へ (e), and を (o).
- **Comprehensive Grammar Database (DEFECT-04 Fix)**:
  - Expanded from 6 to 21 foundational N5/N4 grammar points.
  - Included structured formulas, usage conditions, counterexamples, literal English translations, and morphological breakdowns.
  - Deep-dive UI view updated with counterexamples and breakdown inspection cards.
- **Kanji Lab Expansion (DEFECT-05 Fix)**:
  - Expanded `KANJI_DATABASE` from 16 to 57 Joyo N5 foundational kanji.
  - Added `contextualReadingGuide` to all kanji explaining when On'yomi, Kun'yomi, or irregular Ateji readings apply.
  - Displayed contextual reading guides in the Kanji Lab inspector panel.
- **Lexicon & Distinction Pairs**:
  - Expanded `VOCABULARY_DATABASE` from 27 to 63 vocabulary entries.
  - Added crucial distinction pairs: `見る` vs `観る` vs `視る`, `聞く` vs `訊く`, `行く` vs `来る` vs `帰る`, `暑い` vs `熱い` vs `寒い` vs `冷たい`, `知る` vs `分かる`, `言う` vs `話す`, etc.
  - Added `nuanceNote` to each entry with visual tags and cultural context.
- **Adaptive Diagnostic Placement Assessment (DEFECT-03 Fix)**:
  - Implemented 8-domain calibrated question bank (Hiragana, Katakana, Vocabulary, Grammar, Kanji, Reading, Listening, Sentence).
  - Domain-by-domain skill score breakdown with confidence estimates.
  - Official non-certifying JLPT educational disclaimer notice.
  - Audio snippet playback for listening comprehension placement question.
- **Listening Studio Expansion (DEFECT-07 Fix)**:
  - Expanded `LISTENING_DRILLS` from 3 to 10 categorized drills covering Travel, Dining, Time, Shopping, Daily, and Health.
  - Added client-side Web Speech Synthesis accuracy and pitch accent disclosure.
- **Data Backup, Export & Portability (DEFECT-06 Fix)**:
  - Implemented `exportUserDataJson()` and `importUserDataJson(text)` in `AppDataStore`.
  - Added JSON backup export and restore file upload interface in Settings (`/settings`).
- **CI/CD Hardening (DEFECT-10 Fix)**:
  - Integrated `npm run lint` step into `.github/workflows/deploy.yml` before type checking and tests.
- **Documentation Suite**:
  - `AUDIT_REPORT.md` (comprehensive 25-dimension baseline audit).
  - `IMPLEMENTATION_PLAN.md` (ranked P0-P3 defect remediation plan).
  - `JAPANESE_ACCURACY_REPORT.md` (linguistic integrity verification).
  - `ARCHITECTURE_REPORT.md` (system design and local-first architecture map).
  - `SECURITY_AUDIT.md` (threat analysis and static sandbox security).
  - `TEST_REPORT.md` (Vitest test suite execution and verification).
  - `DEPLOYMENT_REPORT.md` (24x7x365 GitHub Pages CDN deployment).

### Changed
- **SuperMemo SM-2 Algorithm (DEFECT-02 Fix)**:
  - "Forgot" review rating now submits canonical SM-2 `grade = 0` (blackout) rather than grade 1.
  - Added memory lapse tracking: `lapses` increments by 1 when a previously learned card (`repetitions > 0`) is failed (`grade < 3`).
  - Added review history archival up to 20 iterations per flashcard.
- **Review Center Keyboard Shortcuts**:
  - Hotkeys [1], [2], [3], [4] now map to [Forgot: 0], [Hard: 3], [Good: 4], [Easy: 5].

### Fixed
- Fixed empty array rendering when filtering Katakana by Dakuon, Handakuon, or Yōon in Kana Dojo.
- Fixed missing grammatical formulas, counterexamples, and literal translations in Grammar Deep-Dive.
- Fixed lack of memory lapse tracking and incomplete blackout handling in SuperMemo SM-2 review queue.
- Fixed absence of offline data export and migration mechanisms.
- Fixed missing linting verification in deployment workflow.

---

## [1.1.0] - 2026-10-27
- Enhanced day/night theme mode and WCAG AA contrast ratio compliance across 7 Japanese stationery themes.
- Added automated contrast validation unit tests in `day-night-mode.test.ts`.

## [1.0.0] - 2026-10-19
- Initial release of NekoNihongo Japanese Language Learning Platform on GitHub Pages.
- Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, SuperMemo SM-2.
