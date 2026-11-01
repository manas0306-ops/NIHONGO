"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/providers/state-context";
import { AbilityLevel, LearningGoal, DailyStudyTime, PlacementQuestion } from "@/types";
import { Check, ArrowRight, Sparkles, BookOpen, Clock, Target, Volume2, AlertTriangle, ShieldCheck } from "lucide-react";
import { CURRICULUM_UNITS } from "@/data/curriculum";
import { AppDataStore } from "@/lib/database/store";
import { JapaneseAudioSynthesizer } from "@/lib/audio/speech";

const PLACEMENT_ITEM_BANK: PlacementQuestion[] = [
  // 1. HIRAGANA
  {
    id: "pq_hira_1",
    domain: "hiragana",
    domainLabel: "Hiragana Foundations",
    difficulty: 1,
    prompt: "Which romaji sound does the hiragana 'あ' represent?",
    options: ["a", "i", "u", "e"],
    correct: "a",
    explanation: "あ represents the vowel sound 'a' as in 'father'.",
  },
  {
    id: "pq_hira_2",
    domain: "hiragana",
    domainLabel: "Hiragana Diacritics",
    difficulty: 2,
    prompt: "What is the correct sound of 'きょ' with the small 'ょ' (yōon)?",
    options: ["kyo", "kiyo", "ko", "kyu"],
    correct: "kyo",
    explanation: "き + small ょ forms the contracted syllable 'kyo' (one single beat).",
  },
  {
    id: "pq_hira_3",
    domain: "hiragana",
    domainLabel: "Hiragana Sokuon & Special Rules",
    difficulty: 3,
    prompt: "In the word 'きって' (stamp), what phonetic function does the small 'っ' perform?",
    options: [
      "Geminate consonant pause (double 't')",
      "Long vowel marker",
      "Soft nasal sound",
      "Silent separator",
    ],
    correct: "Geminate consonant pause (double 't')",
    explanation: "The small sokuon 'っ' holds a silent one-mora beat before 'te', creating 'kitte'.",
  },

  // 2. KATAKANA
  {
    id: "pq_kata_1",
    domain: "katakana",
    domainLabel: "Katakana Recognition",
    difficulty: 1,
    prompt: "Which Katakana represents the loanword for 'Coffee'?",
    options: ["コーヒー", "コーヒ", "ケーキ", "コーラ"],
    correct: "コーヒー",
    explanation: "コーヒー (kōhī) uses the chōonpu line (ー) to elongate both 'ko' and 'hi'.",
  },
  {
    id: "pq_kata_2",
    domain: "katakana",
    domainLabel: "Katakana Similar Characters",
    difficulty: 2,
    prompt: "Which character is 'シ' (shi), distinct from 'ツ' (tsu)?",
    options: ["シ (shi)", "ツ (tsu)", "ソ (so)", "ン (n)"],
    correct: "シ (shi)",
    explanation: "シ strokes are drawn more horizontally from the bottom up; ツ strokes are drawn vertically.",
  },

  // 3. VOCABULARY
  {
    id: "pq_vocab_1",
    domain: "vocabulary",
    domainLabel: "Core Vocabulary",
    difficulty: 1,
    prompt: "What does the word 'ねこ' (neko) mean in English?",
    options: ["Cat", "Dog", "Bird", "Fish"],
    correct: "Cat",
    explanation: "ねこ (猫) is cat; いぬ (犬) is dog.",
  },
  {
    id: "pq_vocab_2",
    domain: "vocabulary",
    domainLabel: "Nuanced Vocabulary",
    difficulty: 2,
    prompt: "Which word specifically means cold drinking water (not hot water)?",
    options: ["水 (みず)", "お湯 (おゆ)", "お茶 (おちゃ)", "氷 (こおり)"],
    correct: "水 (みず)",
    explanation: "水 refers to cold/room-temp water. Hot water is always お湯 (oyu).",
  },

  // 4. GRAMMAR
  {
    id: "pq_gram_1",
    domain: "grammar",
    domainLabel: "Particles (N5)",
    difficulty: 1,
    prompt: "Which particle marks the direct object in '水を飲みます' (I drink water)?",
    options: ["を", "は", "が", "に"],
    correct: "を",
    explanation: "Particle を (pronounced 'o') marks direct grammatical objects.",
  },
  {
    id: "pq_gram_2",
    domain: "grammar",
    domainLabel: "Conjugation & Permission",
    difficulty: 2,
    prompt: "Which phrase correctly expresses permission: 'You may eat'?",
    options: [
      "食べてもいいです",
      "食べてはいけません",
      "食べなくていいです",
      "食べるほうがいいです",
    ],
    correct: "食べてもいいです",
    explanation: "て-form + もいいです expresses permission ('it is fine even if you eat').",
  },

  // 5. KANJI
  {
    id: "pq_kanji_1",
    domain: "kanji",
    domainLabel: "Kanji Compounds",
    difficulty: 1,
    prompt: "What is the reading of the compound '日本人'?",
    options: ["にほんじん", "にほんびと", "にちほんじん", "にほん"],
    correct: "にほんじん",
    explanation: "日本 (にほん) + 人 (じん for nationality) = にほんじん.",
  },
  {
    id: "pq_kanji_2",
    domain: "kanji",
    domainLabel: "Time & Counter Kanji",
    difficulty: 2,
    prompt: "What is the reading and meaning of '時間'?",
    options: [
      "じかん (Time / duration)",
      "ときま (Clock)",
      "じま (Interval)",
      "とけい (Wristwatch)",
    ],
    correct: "じかん (Time / duration)",
    explanation: "時 (じ) + 間 (かん) = じかん (time / hours).",
  },

  // 6. READING COMPREHENSION
  {
    id: "pq_read_1",
    domain: "reading",
    domainLabel: "Sentence Reading",
    difficulty: 2,
    prompt: "週末に友達と映画を観ました。What did the speaker do over the weekend?",
    options: [
      "Watched a movie with a friend",
      "Studied with a teacher",
      "Went shopping alone",
      "Ate at a restaurant",
    ],
    correct: "Watched a movie with a friend",
    explanation: "週末 (weekend) + 友達と (with a friend) + 映画を観ました (watched a movie).",
  },

  // 7. LISTENING
  {
    id: "pq_listen_1",
    domain: "listening",
    domainLabel: "Auditory Comprehension",
    difficulty: 2,
    prompt: "Listen to the audio clip. What is being said?",
    audioPrompt: "すみません、お水をください。",
    options: [
      "Excuse me, water please.",
      "Thank you for the delicious meal.",
      "Good morning, see you tomorrow.",
      "Where is the nearest station?",
    ],
    correct: "Excuse me, water please.",
    explanation: "すみません (Excuse me) + お水をください (Water please).",
  },

  // 8. SENTENCE STRUCTURE
  {
    id: "pq_sent_1",
    domain: "sentence",
    domainLabel: "Sentence Construction",
    difficulty: 2,
    prompt: "How do you assemble: 'I speak Japanese at school'?",
    options: [
      "私は 学校で 日本語を 話します。",
      "私は 日本語で 学校を 話します。",
      "学校は 私で 日本語を 話します。",
      "日本語は 学校に 私を 話します。",
    ],
    correct: "私は 学校で 日本語を 話します。",
    explanation: "Topic (私は) + Location of action (学校で) + Object (日本語を) + Verb (話します).",
  },
];

export function OnboardingWizard() {
  const { preferences, updatePreferences } = useApp();
  const [step, setStep] = useState<number>(1);

  // Form State
  const [ability, setAbility] = useState<AbilityLevel>(preferences.abilityLevel);
  const [goal, setGoal] = useState<LearningGoal>(preferences.primaryGoal);
  const [studyTime, setStudyTime] = useState<DailyStudyTime>(preferences.dailyStudyMinutes);
  const [xpTarget, setXpTarget] = useState<number>(preferences.dailyXpGoal);
  const [placementAnswers, setPlacementAnswers] = useState<Record<string, string>>({});
  const [currentPlacementIdx, setCurrentPlacementIdx] = useState<number>(0);

  const synth = JapaneseAudioSynthesizer.getInstance();

  if (preferences.hasCompletedOnboarding) {
    return null;
  }

  const abilityOptions: { id: AbilityLevel; label: string; desc: string }[] = [
    { id: "beginner", label: "Complete Beginner", desc: "No prior Japanese knowledge. Starting from zero." },
    { id: "know_hiragana", label: "Know Hiragana", desc: "Can read basic hiragana phonetic characters." },
    { id: "know_kana", label: "Know Hiragana & Katakana", desc: "Comfortable reading both phonetic scripts." },
    { id: "basic_vocab", label: "Know Basic Vocabulary", desc: "Understand simple words, numbers, and greetings." },
    { id: "intermediate", label: "Intermediate Learner", desc: "Studied basic grammar (JLPT N4/N3 range)." },
    { id: "advanced", label: "Advanced Learner", desc: "Polishing fluency and advanced Kanji (JLPT N2/N1)." },
  ];

  const goalOptions: { id: LearningGoal; label: string; icon: string }[] = [
    { id: "travel", label: "Travel in Japan", icon: "🗾" },
    { id: "anime", label: "Anime & Manga Comprehension", icon: "🎬" },
    { id: "conversation", label: "Everyday Conversation", icon: "💬" },
    { id: "reading_writing", label: "Reading & Writing Literature", icon: "📚" },
    { id: "school", label: "School or University Studies", icon: "🏫" },
    { id: "jlpt", label: "JLPT Exam Preparation", icon: "🎯" },
    { id: "professional", label: "Professional & Business Japanese", icon: "💼" },
  ];

  const studyTimeOptions: { time: DailyStudyTime; label: string; intensity: string }[] = [
    { time: 5, label: "5 minutes / day", intensity: "Casual & Relaxed" },
    { time: 10, label: "10 minutes / day", intensity: "Regular Pace" },
    { time: 15, label: "15 minutes / day", intensity: "Committed Learner" },
    { time: 20, label: "20+ minutes / day", intensity: "Intensive Fluency" },
  ];

  // Dynamic question sequence (8 calibrated diagnostic domains)
  const activeQuestions = PLACEMENT_ITEM_BANK;
  const activeQuestion = activeQuestions[currentPlacementIdx];

  const evaluatePlacement = () => {
    let score = 0;
    const domainBreakdown: Record<string, { attempted: number; correct: number }> = {};

    activeQuestions.forEach((q) => {
      if (!domainBreakdown[q.domainLabel]) {
        domainBreakdown[q.domainLabel] = { attempted: 0, correct: 0 };
      }
      const ans = placementAnswers[q.id];
      if (ans) {
        domainBreakdown[q.domainLabel].attempted += 1;
        if (ans === q.correct) {
          domainBreakdown[q.domainLabel].correct += 1;
          score += 1;
        }
      }
    });

    return { score, domainBreakdown, total: activeQuestions.length };
  };

  const getPlacementOutcome = (score: number) => {
    if (score >= 7) {
      return {
        level: "advanced" as AbilityLevel,
        label: "N4 Certified / N3 Foundation (中級準備)",
        desc: "Demonstrated strong grasp of kana, particles, kanji compounds, and listening comprehension. Initial 8 units unlocked.",
        unlockedUnits: 8,
        confidence: "High Confidence",
      };
    }
    if (score >= 5) {
      return {
        level: "intermediate" as AbilityLevel,
        label: "N4 Foundation (N4初級)",
        desc: "Solid understanding of basic particles, te-form, and daily vocabulary. Initial 6 units unlocked.",
        unlockedUnits: 6,
        confidence: "High Confidence",
      };
    }
    if (score >= 3) {
      return {
        level: "basic_vocab" as AbilityLevel,
        label: "N5 Beginner (N5基礎)",
        desc: "Comfortable with phonetic kana and basic greetings. Initial 4 units unlocked.",
        unlockedUnits: 4,
        confidence: "Moderate Confidence",
      };
    }
    if (score >= 1) {
      return {
        level: "know_kana" as AbilityLevel,
        label: "Kana Explorer (仮名入門)",
        desc: "Recognizes some kana characters. Initial 2 units unlocked.",
        unlockedUnits: 2,
        confidence: "Calibrated",
      };
    }
    return {
      level: "beginner" as AbilityLevel,
      label: "Complete Beginner (入門ゼロスタート)",
      desc: "Starting fresh from zero with Hiragana vowels and stroke foundations. Unit 1 unlocked.",
      unlockedUnits: 1,
      confidence: "Baseline",
    };
  };

  const evaluation = evaluatePlacement();
  const outcome = getPlacementOutcome(evaluation.score);

  const handleFinish = (score: number = 0) => {
    const finalOutcome = getPlacementOutcome(score);
    const store = AppDataStore.getInstance();

    // Unlock lessons matching the calibrated level
    const gameState = store.loadGamificationState();
    const unlockedSet = new Set(gameState.unlockedLessons);

    CURRICULUM_UNITS.slice(0, finalOutcome.unlockedUnits).forEach((unit) => {
      unit.lessons.forEach((l) => unlockedSet.add(l.id));
    });

    store.saveGamificationState({
      ...gameState,
      unlockedLessons: Array.from(unlockedSet),
    });

    updatePreferences({
      abilityLevel: ability,
      primaryGoal: goal,
      dailyStudyMinutes: studyTime,
      dailyXpGoal: xpTarget,
      placementScore: score,
      hasCompletedOnboarding: true,
    });
  };

  const playQuestionAudio = (text: string) => {
    synth.speak(text, preferences.audioSpeed);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-surface border border-border rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-card my-8">
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐱</span>
            <span className="font-bold text-lg text-ink">Welcome to NekoNihongo</span>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary-light text-primary">
            Step {step} of 6
          </span>
        </div>

        {/* STEP 1: Ability Level */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-ink">What is your current Japanese ability?</h2>
              <p className="text-sm text-subtle">We&apos;ll tailor your starting lessons to match your level.</p>
            </div>
            <div className="space-y-2.5">
              {abilityOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setAbility(opt.id)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                    ability === opt.id
                      ? "border-primary bg-primary-light/40 shadow-soft"
                      : "border-border bg-card hover:bg-subtle"
                  }`}
                >
                  <div>
                    <div className="font-semibold text-sm text-ink">{opt.label}</div>
                    <div className="text-xs text-subtle">{opt.desc}</div>
                  </div>
                  {ability === opt.id && <Check className="w-5 h-5 text-primary flex-shrink-0" />}
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep(2)}
              className="w-full py-3.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-2xl shadow-soft flex items-center justify-center gap-2 mt-4 transition-all"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: Primary Goal */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-ink">What is your primary learning goal?</h2>
              <p className="text-sm text-subtle">Choose what inspires you most to master Japanese.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {goalOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setGoal(opt.id)}
                  className={`text-left p-3.5 rounded-2xl border transition-all flex items-center gap-3 ${
                    goal === opt.id
                      ? "border-primary bg-primary-light/40 shadow-soft"
                      : "border-border bg-card hover:bg-subtle"
                  }`}
                >
                  <span className="text-2xl">{opt.icon}</span>
                  <span className="font-semibold text-xs text-ink">{opt.label}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 py-3 border border-border text-subtle font-semibold rounded-2xl hover:bg-subtle"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-2xl shadow-soft flex items-center justify-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Daily Study Time */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-ink">How much time can you commit daily?</h2>
              <p className="text-sm text-subtle">Consistency beats cramming. Even 5 minutes makes real progress.</p>
            </div>
            <div className="space-y-2.5">
              {studyTimeOptions.map((opt) => (
                <button
                  key={opt.time}
                  onClick={() => setStudyTime(opt.time)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between ${
                    studyTime === opt.time
                      ? "border-primary bg-primary-light/40 shadow-soft"
                      : "border-border bg-card hover:bg-subtle"
                  }`}
                >
                  <div>
                    <div className="font-semibold text-sm text-ink">{opt.label}</div>
                    <div className="text-xs text-subtle">{opt.intensity}</div>
                  </div>
                  {studyTime === opt.time && <Check className="w-5 h-5 text-primary flex-shrink-0" />}
                </button>
              ))}
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setStep(2)}
                className="w-1/3 py-3 border border-border text-subtle font-semibold rounded-2xl hover:bg-subtle"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="flex-1 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-2xl shadow-soft flex items-center justify-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Daily XP Goal */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-ink">Set your daily XP target</h2>
              <p className="text-sm text-subtle">Earn XP by finishing lessons, quizzes, and reviews.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[15, 30, 50, 100].map((val) => (
                <button
                  key={val}
                  onClick={() => setXpTarget(val)}
                  className={`p-4 rounded-2xl border text-center transition-all ${
                    xpTarget === val
                      ? "border-primary bg-primary-light/40 shadow-soft font-bold text-primary"
                      : "border-border bg-card hover:bg-subtle text-ink font-semibold"
                  }`}
                >
                  <div className="text-xl font-bold">⚡ {val} XP</div>
                  <div className="text-xs text-subtle mt-1">
                    {val === 15 ? "1 lesson" : val === 30 ? "2 lessons" : val === 50 ? "3-4 lessons" : "Power user"}
                  </div>
                </button>
              ))}
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setStep(3)}
                className="w-1/3 py-3 border border-border text-subtle font-semibold rounded-2xl hover:bg-subtle"
              >
                Back
              </button>
              <button
                onClick={() => setStep(5)}
                className="flex-1 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-2xl shadow-soft flex items-center justify-center gap-2"
              >
                <span>Take Placement Test</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: 8-Domain Calibrated Diagnostic Assessment */}
        {step === 5 && activeQuestion && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  Question {currentPlacementIdx + 1} of {activeQuestions.length} • {activeQuestion.domainLabel}
                </span>
                <h2 className="text-lg font-bold text-ink mt-0.5">Adaptive Diagnostic Calibration</h2>
              </div>
              <div className="w-24 bg-card h-2 rounded-full overflow-hidden border border-border">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.round(((currentPlacementIdx + 1) / activeQuestions.length) * 100)}%`,
                  }}
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-subtle border border-border space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div className="font-bold text-sm text-ink leading-relaxed">
                  {activeQuestion.prompt}
                </div>
                {activeQuestion.audioPrompt && (
                  <button
                    onClick={() => playQuestionAudio(activeQuestion.audioPrompt!)}
                    className="p-2 rounded-xl bg-primary-light text-primary hover:scale-105 transition-transform flex-shrink-0"
                    title="Play Audio Clip"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activeQuestion.options.map((opt) => {
                  const isSelected = placementAnswers[activeQuestion.id] === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() =>
                        setPlacementAnswers((prev) => ({
                          ...prev,
                          [activeQuestion.id]: opt,
                        }))
                      }
                      className={`p-3 rounded-xl text-xs font-semibold border text-left transition-all ${
                        isSelected
                          ? "border-primary bg-primary text-white shadow-soft"
                          : "border-border bg-card hover:bg-surface text-ink"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              {currentPlacementIdx > 0 ? (
                <button
                  onClick={() => setCurrentPlacementIdx((prev) => prev - 1)}
                  className="w-1/3 py-3 border border-border text-subtle font-semibold rounded-2xl hover:bg-subtle text-xs"
                >
                  Previous
                </button>
              ) : (
                <button
                  onClick={() => setStep(6)}
                  className="w-1/3 py-3 border border-border text-subtle font-semibold rounded-2xl hover:bg-subtle text-xs"
                >
                  Skip Test
                </button>
              )}

              {currentPlacementIdx + 1 < activeQuestions.length ? (
                <button
                  disabled={!placementAnswers[activeQuestion.id]}
                  onClick={() => setCurrentPlacementIdx((prev) => prev + 1)}
                  className="flex-1 py-3 bg-primary disabled:opacity-50 hover:bg-primary-hover text-white font-bold rounded-2xl shadow-soft flex items-center justify-center gap-2"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  disabled={!placementAnswers[activeQuestion.id]}
                  onClick={() => setStep(6)}
                  className="flex-1 py-3 bg-emerald-600 disabled:opacity-50 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-soft flex items-center justify-center gap-2"
                >
                  <span>Calculate Placement</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* STEP 6: Generated Path Confirmation & Manual Override */}
        {step === 6 && (
          <div className="space-y-5 text-center py-2">
            <div className="w-14 h-14 rounded-3xl bg-primary-light text-primary flex items-center justify-center mx-auto text-3xl shadow-soft">
              🎓
            </div>
            <div>
              <h2 className="text-xl font-bold text-ink">Calibrated Learning Path Ready!</h2>
              <p className="text-xs text-subtle mt-1 max-w-sm mx-auto">
                Placement score: <span className="font-bold text-primary">{evaluation.score} / {evaluation.total}</span> ({Math.round((evaluation.score / evaluation.total) * 100)}% accuracy • {outcome.confidence}).
              </p>
            </div>

            {/* Diagnostic Outcome Card */}
            <div className="p-4 rounded-2xl bg-card border border-border text-left space-y-2 text-xs">
              <div className="flex justify-between items-center border-b border-border pb-2">
                <span className="text-subtle font-medium">Assigned Starting Tier:</span>
                <span className="font-bold text-primary">{outcome.label}</span>
              </div>
              <p className="text-subtle leading-relaxed">{outcome.desc}</p>
              <div className="flex justify-between pt-1">
                <span className="text-subtle">Focus Goal:</span>
                <span className="font-bold text-ink capitalize">{goal.replace("_", " ")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-subtle">Daily Commitment:</span>
                <span className="font-bold text-primary">{xpTarget} XP ({studyTime} min/day)</span>
              </div>
            </div>

            {/* Domain-by-Domain Diagnostic Breakdown */}
            <div className="text-left space-y-2 p-3.5 rounded-2xl bg-subtle border border-border text-xs">
              <span className="font-bold text-ink block">Skill Domain Breakdown:</span>
              <div className="space-y-1.5">
                {Object.entries(evaluation.domainBreakdown).map(([domainName, stats]) => {
                  const pct = stats.attempted > 0 ? Math.round((stats.correct / stats.attempted) * 100) : 0;
                  return (
                    <div key={domainName} className="flex items-center justify-between text-[11px]">
                      <span className="text-subtle truncate max-w-[160px]">{domainName}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-card h-1.5 rounded-full overflow-hidden border border-border">
                          <div
                            className={`h-full rounded-full ${pct >= 100 ? "bg-emerald-500" : pct > 0 ? "bg-primary" : "bg-muted"}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="font-mono text-ink font-semibold w-8 text-right">{pct}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Non-certifying Diagnostic Disclaimer */}
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-left flex gap-2.5 items-start">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
                <strong>Educational Notice:</strong> This diagnostic placement assessment is designed for NekoNihongo curriculum pacing and study path recommendation only; it does not constitute an official Japanese Language Proficiency Test (JLPT) certification.
              </p>
            </div>

            {/* Manual Override Option */}
            <div className="text-left space-y-1.5 p-3 rounded-2xl bg-subtle border border-border">
              <span className="text-[11px] font-bold text-ink block">Want to adjust your starting level manually?</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {(["beginner", "know_kana", "basic_vocab", "intermediate"] as AbilityLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setAbility(lvl)}
                    className={`py-1.5 px-2.5 rounded-xl border text-center font-semibold capitalize transition-all ${
                      ability === lvl
                        ? "border-primary bg-primary text-white"
                        : "border-border bg-card text-subtle hover:text-ink"
                    }`}
                  >
                    {lvl.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleFinish(evaluation.score)}
              className="w-full py-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-2xl shadow-soft text-base transition-all"
            >
              Confirm Path & Start Learning 🐾
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
