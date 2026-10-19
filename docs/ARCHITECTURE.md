# NekoNihongo Architecture & System Design 🐾⛩️

## 1. Executive Overview

NekoNihongo is a production-grade Japanese language education web platform designed for desktop, tablet, and mobile browsers. It pairs gamification techniques with structured pedagogy spanning Foundations (Level A) to Advanced (Level E) aligned with JLPT N5 through N1.

---

## 2. Technology Stack

- **Framework**: Next.js 15 (App Router, Server-side rendering, React 19)
- **Language**: TypeScript in strict mode
- **Styling**: Tailwind CSS with custom CSS variables supporting 7 Japanese Stationery themes
- **Icons**: Lucide Icons
- **State & Storage**:
  - `AppDataStore`: Client & Server data management with idempotency checks
  - Supabase PostgreSQL: Managed database with Row Level Security (RLS) policies
  - Local Storage Persistence Engine: Fully functional offline & local fallback
- **Learning & Audio Engine**:
  - SuperMemo SM-2 Spaced Repetition scheduling algorithm
  - Web Speech Synthesis for native Japanese TTS with variable playback speed (0.75x, 1.0x, 1.25x)
  - Web Speech Recognition with Levenshtein-based transcript comparison
- **Testing**: Vitest, React Testing Library, JSDOM

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
