# NekoNihongo (猫日本語) 🐾🇯🇵

> **"Small lessons. Real Japanese. Every day."**

[![Deploy NekoNihongo Live 24x7x365](https://github.com/manas0306-ops/NIHONGO/actions/workflows/deploy.yml/badge.svg)](https://github.com/manas0306-ops/NIHONGO/actions/workflows/deploy.yml)
[![Live 24x7x365 Status](https://img.shields.io/badge/Status-Live%2024%2F7%2F365-brightgreen)](https://manas0306-ops.github.io/NIHONGO/)
[![GitHub Pages](https://img.shields.io/badge/Hosted%20On-GitHub%20Pages-blue)](https://manas0306-ops.github.io/NIHONGO/)
[![Zero 404 Guarantee](https://img.shields.io/badge/Routing-Zero%20404%20SPA-orange)](https://manas0306-ops.github.io/NIHONGO/)

**🌐 Live Production Site**: [https://manas0306-ops.github.io/NIHONGO/](https://manas0306-ops.github.io/NIHONGO/)  
**📁 GitHub Repository**: [https://github.com/manas0306-ops/NIHONGO](https://github.com/manas0306-ops/NIHONGO)

NekoNihongo is a production-oriented Japanese language learning web application built with **Next.js 15 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS**, and **Supabase / Local Engine**. Hosted 24/7/365 with automated GitHub Pages edge delivery and zero-404 route handling. It offers a structured Japanese curriculum spanning Foundations to Intermediate fluency, featuring gamified motivation mechanics, native speech synthesis, and SuperMemo SM-2 spaced repetition.

---

## 🌟 Key Application Modules (16 Main Navigation Areas)

1. **🏠 Home / Learn**: Continue learning hero card, current unit progress, daily XP goal progress bar, streak flame status, and SRS reviews due.
2. **🗺️ Course Map**: Interactive curriculum roadmap across 10 units and 30 lessons with unlock states and score indicators.
3. **🏯 Kana Dojo**: Full 46 Gojūon + Dakuten + Handakuten + Yōon combinations. Includes mnemonics, stroke counts, native audio playback, and an **interactive stroke-drawing canvas**!
4. **🏮 Kanji Lab**: Graded Kanji database (JLPT N5–N3) with On'yomi, Kun'yomi, radical breakdowns, mnemonics, example words, and **Flashcard Mode**.
5. **📖 Vocabulary Library**: Searchable dictionary with topic tags, furigana toggles, example sentences, and audio pronunciation.
6. **⛩️ Grammar Studio**: Formulaic formation rules, register/politeness notes, common pitfalls, and audio-backed sentence examples.
7. **🎧 Listening Studio**: Native Japanese Web Speech synthesis, adjustable playback speeds (0.75x, 1.0x, 1.25x), and comprehension quizzes.
8. **🎙️ Speaking Studio**: Browser microphone integration using Web Speech API, reference audio comparisons, Levenshtein transcript similarity scoring, and keyboard fallback mode.
9. **📖 Stories & Real-Life Dialogues**: Original graded reading passages with furigana/romaji/English toggles, sentence-by-sentence audio, and comprehension quizzes.
10. **🔄 Review Center (SRS)**: SuperMemo SM-2 spaced repetition scheduling with recall difficulty ratings (Forgot, Hard, Good, Easy) updating future intervals and ease factors.
11. **⚡ Practice Hub**: Targeted 5-question micro-drills (Kana Speed Drill, Listening Sprint, Kanji Challenge, Grammar Repair).
12. **🎯 Quests & Challenges**: Daily missions and weekly milestones with XP and gem rewards.
13. **🏆 Leaderboard**: Safe cohort standings with pseudonyms, league divisions, and privacy opt-out controls.
14. **🎖️ Achievements**: Badge showcase commemorating learning milestones (First Step, Kana Novice, Week Warrior, etc.).
15. **👤 Profile & Analytics**: Persisted learning statistics, accuracy, study duration, completed lesson records, and confirmation-protected progress resets.
16. **⚙️ Settings & Appearance**: 7 authentic Japanese stationery themes, dark/light/system modes, furigana toggles, and audio speeds.

---

## 🎨 7 Authentic Japanese Stationery Themes

1. **🌸 Sakura Garden**: Blossom pink accents with warm stationery cream.
2. **🍵 Matcha Garden**: Forest green and herbal bamboo tones.
3. **🌃 Midnight Tokyo**: Deep indigo navy with cyber neon highlights.
4. **🪨 Minimal Zen**: Restrained ink, neutral stone, and washi paper textures.
5. **🌊 Ocean Hokusai**: Cerulean wave blue with sea-foam cream.
6. **🍁 Autumn Kyoto**: Roasted chestnut, momiji maple, and warm gold.
7. **🏮 Paper Lantern**: Warm evening amber and festive lanterns.

---

## 📚 Curriculum Content Metrics

- **Units**: 10 comprehensive Units
- **Lessons**: 30 structured Lessons
- **Exercises**: 300 unique individual exercise items
- **Exercise Types**: Multiple Choice, Word Bank Assembly, Drag-and-Drop, Fill in the Blanks, Missing Particles, Pair Matching, Listen & Select, Listen & Type, Typing Practice, Kana Recognition, Kanji Recognition, Reading Comprehension, Grammar Correction, Dialogue Completion, Conversation Response, and Drawing Canvas.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.18+ or Node.js 20+ / 24+
- npm (or pnpm / yarn)

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

*(Note: NekoNihongo is 100% functional out-of-the-box using the built-in Local Persistence Engine if Supabase credentials are not provided.)*

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Verification

```bash
# Run unit & integration tests
npm run test

# Run TypeScript strict type-checking
npm run typecheck

# Build optimized production bundle
npm run build
```

---

## 📄 License

MIT © [Maanas Pandey](https://github.com/manas0306-ops)
