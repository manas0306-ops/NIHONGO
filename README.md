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

## 🌟 Pedagogical Learning System & Navigation Architecture

NekoNihongo is organized into **4 Clear Pedagogical Pillars** to eliminate decision fatigue and guide the learner through the optimal learning loop: **LEARN → PRACTICE → RECALL → REVIEW → TEST → ANALYZE → ADAPT → LEARN AGAIN**.

### 1. 📖 LEARN (学ぶ)
- **🏠 Home Dashboard**: Intelligent adaptive learning hub that directly answers:
  1. *What should I study now?* (Prioritized dynamic action: Overdue SRS reviews, Weak area repair, or Next curriculum lesson).
  2. *Why should I study it?* (Clear cognitive justification based on forgetting curve decay or repeated mistake frequency).
  3. *What should I do next?* (Clear trajectory forward).
- **あなたの弱点 (Active Weak Areas Diagnostic)**: Diagnoses specific linguistic error patterns (e.g. 助詞「は」vs「が」confusion, 動詞活用 te-form errors) and offers 1-click targeted repairs.
- **🗺️ Course Map**: 10 comprehensive Units and 30 structured lessons across JLPT N5 and N4.
- **🏯 Kana Dojo**: 46 Gojūon + Dakuten + Yōon, mnemonics, stroke diagrams, and interactive mobile-friendly touch canvas.
- **🏮 Kanji Lab**: Graded Kanji with radicals, On/Kun readings, and flashcard practice.
- **📖 Vocabulary Library**: Rich contextual dictionary with audio and tag filters.
- **⛩️ Grammar Studio**: Formulaic formation rules, register/politeness notes, and **Side-by-Side Confusing Particle Comparisons** (は vs が, に vs で, から vs まで, これ vs この, ある vs いる).
- **📖 Graded Stories**: Authentic Japanese dialogues with furigana toggles and comprehension checks.

### 2. ⚡ PRACTICE (特訓)
- **🎧 Listening Studio**: Native Web Speech synthesis with speed adjustment (0.75x, 1.0x, 1.25x) and comprehension drills.
- **🎙️ Speaking Studio**: Transparent Web Speech recognition measuring Transcript Match (認識一致率) and confidence, with native audio comparisons, pronunciation cadence tips, and keyboard fallback mode.
- **⚡ Practice Hub**: 5-question micro-sprints for rapid daily recall.

### 3. 🔄 REVIEW (復習)
- **🔄 Review Center (SRS)**: SuperMemo SM-2 spaced repetition scheduler calculating intervals, repetition counts, and ease factors. Features **full keyboard accessibility** (`Space` to flip, `1` Forgot, `2` Hard, `3` Good, `4` Easy, `V` to pronounce, `Esc` to exit) and content-type filters.

### 4. 📊 RECORD & SETTINGS (記録・設定)
- **👤 Profile & Learner Model**: Separates Demonstrated Retention Mastery (%) from Exposure Progress (%) and XP gamification.
- **🎯 Quests & Challenges**: Daily quests and milestones.
- **🏆 Leaderboard**: Privacy-safe pseudonymous leagues.
- **🎖️ Achievements**: Milestone unlock badges.
- **⚙️ Settings & Appearance**: 7 authentic Japanese stationery themes, Day & Night Mode (昼・夜モード), and audio preferences.

---

## 🎯 8-Tier Adaptive Placement Test

New learners can skip foundational material or calibrate their learning path through our 8-tier adaptive assessment covering:
1. Basic Hiragana Recognition (あ vs お)
2. Katakana Loanwords (コーヒー)
3. Essential Core Vocabulary (猫・いぬ)
4. Topic vs Subject Particles (は vs が)
5. Verb Conjugation Politeness (食べます)
6. Foundational Kanji Readings (日本)
7. Complex Sentence Comprehension (毎朝７時に起きて勉強します)
8. Te-form Request Construction (待ってください)

Calibrated placement recommendations place learners accurately into:
- **Absolute Beginner (入門)**: Unit 1 Start
- **N5 Foundations (初級・基礎)**: Units 1-2 Unlocked
- **N5 Certified (N5 習得)**: Units 1-4 Unlocked
- **N4 Foundations (中級準備)**: Units 1-6 Unlocked
- **N4 Certified / N3 Aspiring (中級実践)**: Units 1-8+ Unlocked

---

## ☀️🌙 Day & Night Mode (昼・夜モード) & 7 Stationery Themes

NekoNihongo includes a specialized **Day & Night Mode engine** engineered for continuous day and late-night Japanese study:
- **昼モード (Day Mode)**: Warm cream and traditional washi stationery backgrounds with dark sumi-ink typography for optimal daylight reading and high character contrast.
- **夜モード (Night Mode)**: Deep OLED and midnight blue/slate backgrounds with gentle luminescence, pastel highlights, and zero eye fatigue for late-night Kanji drills.
- **自動 (System Mode)**: Automatically tracks OS and browser daylight schedules.
- **Smooth Transitions**: 400ms CSS custom-property blending (`.mode-transition`) avoids jarring color flashes when switching modes.
- **Keyboard Shortcut**: Press **`D`** on your keyboard from any page to instantaneously toggle between Day and Night modes!

### 7 Authentic Japanese Stationery Themes

1. **🌸 Sakura Garden (桜の庭)**: Blossom pink accents with warm stationery cream (Day) and midnight plum (Night).
2. **🍵 Matcha Garden (抹茶庭園)**: Forest green and herbal bamboo tones (Day) and moss night ink (Night).
3. **🌃 Midnight Tokyo (東京ミッドナイト)**: Electric neon on dark sumi ink with daylight indigo duality.
4. **🪨 Minimal Zen (禅の美)**: Restrained ink, neutral stone, and washi paper textures.
5. **🌊 Ocean Hokusai (北斎の波)**: Cerulean wave blue with sea-foam cream and deep oceanic darks.
6. **🍁 Autumn Kyoto (京都の紅葉)**: Roasted chestnut, momiji maple, and warm evening gold.
7. **🏮 Paper Lantern (提灯の灯)**: Warm evening amber and festive glowing lanterns.

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
