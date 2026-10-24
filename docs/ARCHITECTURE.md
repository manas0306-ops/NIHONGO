# NekoNihongo Architecture & System Design 🐾⛩️

## 1. Executive Overview

NekoNihongo is a production-grade Japanese language education web platform designed for desktop, tablet, and mobile browsers. It pairs gamification techniques with structured pedagogy spanning Foundations (Level A) to Advanced (Level E) aligned with JLPT N5 through N1.

---

## 2. Technology Stack

- **Framework**: Next.js 15 (App Router, Server-side rendering, React 19)
- **Language**: TypeScript in strict mode
- **Styling & Theme Engine**:
  - Tailwind CSS with custom CSS variables supporting 7 authentic Japanese Stationery themes
  - Dedicated **Day & Night Mode Engine (昼・夜モード)** with `.mode-transition` 400ms color blending
  - Responsive segmented toggle (`DayNightToggle`) and global `[D]` keyboard shortcut listener
- **Icons**: Lucide Icons
- **State & Storage**:
  - `AppDataStore`: Client & Server data management with idempotency checks
  - Unified `LearnerModel`: Separates Demonstrated Retention Mastery (0-100%) from Exposure/Progress (%) and XP Gamification
  - Active Mistake & Weak Area Tracking (`classifyMistakeConcept`, `identifyWeakAreas`)
  - Supabase PostgreSQL: Managed database with Row Level Security (RLS) policies
  - Local Storage Persistence Engine: Fully functional offline & local fallback (`nekonihongo_learner_model_v1`)
- **Learning & Audio Engine**:
  - SuperMemo SM-2 Spaced Repetition scheduling algorithm with full keyboard accessibility (`Space`, `1-4`, `V`, `Esc`)
  - Web Speech Synthesis for native Japanese TTS with variable playback speed (0.75x, 1.0x, 1.25x)
  - Web Speech Recognition with transparent Transcript Match (認識一致率) confidence scoring and keyboard input fallback
  - Grammar Studio with Side-by-Side Confusing Particle Comparisons (は vs が, に vs で, から vs まで, これ vs この, ある vs いる)
  - 8-Tier Adaptive Placement Assessment
- **Testing & Verification**: Vitest, React Testing Library, JSDOM, 53 Automated Content & Architectural Integrity Tests

---

## 3. Pedagogical Architecture

The application is architected around the continuous learning loop:
**LEARN → PRACTICE → RECALL → REVIEW → TEST → ANALYZE → ADAPT → LEARN AGAIN**

1. **Intelligent Dynamic Recommender**: The Home screen dynamically computes the single highest-value action by checking overdue SRS items first, unresolved weak areas second, and curriculum progression third.
2. **Pedagogical Four Pillars**:
   - `LEARN (学ぶ)`: Foundational input via Home, Course Map, Kana Dojo, Kanji Lab, Vocabulary Library, Grammar Studio, and Immersion Stories.
   - `PRACTICE (特訓)`: Active output via Listening Studio, Speaking Studio, and Practice Hub.
   - `REVIEW (復習)`: Memory consolidation via SM-2 Spaced Repetition Flashcards.
   - `RECORD & SETTINGS (記録・設定)`: Learner model diagnostics, Achievements, Quests, Leaderboard, and Appearance controls.
3. **Data Integrity Guarantee**: Comprehensive automated test suites ensure zero duplicate exercises, valid multiple-choice options, correct tokenized words, non-empty explanations, and JLPT consistency.

---

## 3. Directory Structure

```
├── docs/                     # Technical documentation
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   ├── CURRICULUM.md
│   ├── AUDIO.md
│   ├── DEPLOYMENT.md
│   └── TESTING.md
├── public/                   # Static assets & PWA manifest
├── src/
│   ├── app/                  # Next.js App Router (16 navigation routes)
│   │   ├── page.tsx          # 1. Home / Learn Dashboard
│   │   ├── map/              # 2. Course Map
│   │   ├── kana/             # 3. Kana Dojo (Hiragana/Katakana & Canvas)
│   │   ├── kanji/            # 4. Kanji Lab (Radicals, readings & cards)
│   │   ├── vocabulary/       # 5. Vocabulary Library & Audio
│   │   ├── grammar/          # 6. Grammar Studio (Formulas & registers)
│   │   ├── listening/        # 7. Listening Comprehension
│   │   ├── speaking/         # 8. Speaking & Pronunciation
│   │   ├── stories/          # 9. Graded Dialogues & Furigana toggles
│   │   ├── review/           # 10. Review Center (SM-2 SRS)
│   │   ├── practice/         # 11. Practice Hub
│   │   ├── quests/           # 12. Quests & Challenges
│   │   ├── leaderboard/      # 13. Safe Cohort Leaderboard
│   │   ├── achievements/     # 14. Achievements & Milestones
│   │   ├── profile/          # 15. Profile & Learning Analytics
│   │   ├── settings/         # 16. Appearance & 7 Themes
│   │   ├── globals.css       # Design tokens & color palettes
│   │   └── layout.tsx        # Shell layout with desktop/mobile nav
│   ├── components/
│   │   ├── lessons/          # Reusable LessonPlayer & 20+ exercise types
│   │   ├── navigation/       # Sidebar, Topbar, BottomNav
│   │   └── onboarding/       # 6-step personalized Onboarding Wizard
│   ├── data/                 # Graded curriculum & Japanese data
│   │   ├── curriculum.ts     # 10 Units, 30 Lessons, 300 Exercises
│   │   ├── kana.ts           # 50 sounds, dakuten, yōon, mnemonics
│   │   ├── kanji.ts          # Graded Kanji with radicals & words
│   │   ├── grammar.ts        # JLPT grammar rules & explanations
│   │   └── stories.ts        # Graded reading stories & comprehension
│   ├── lib/
│   │   ├── audio/            # Web Speech API & similarity normalizer
│   │   ├── database/         # AppDataStore & Supabase connector
│   │   ├── gamification/     # Timezone streak, XP & levels
│   │   ├── providers/        # AppContext React state provider
│   │   ├── spaced-repetition/# SM-2 algorithmic scheduler
│   │   └── validation/       # Zod schemas
│   └── types/                # Domain TypeScript definitions
├── supabase/
│   ├── migrations/           # 001_initial_schema.sql
│   └── seed.sql              # Seed SQL data
└── tests/
    └── unit/                 # Vitest test suites
```
