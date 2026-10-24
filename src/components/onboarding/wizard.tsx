"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/providers/state-context";
import { AbilityLevel, LearningGoal, DailyStudyTime } from "@/types";
import { Check, ArrowRight, Sparkles, BookOpen, Clock, Target, Compass, CheckCircle2 } from "lucide-react";
import { CURRICULUM_UNITS } from "@/data/curriculum";
import { AppDataStore } from "@/lib/database/store";

export function OnboardingWizard() {
  const { preferences, updatePreferences } = useApp();
  const [step, setStep] = useState<number>(1);

  // Form State
  const [ability, setAbility] = useState<AbilityLevel>(preferences.abilityLevel);
  const [goal, setGoal] = useState<LearningGoal>(preferences.primaryGoal);
  const [studyTime, setStudyTime] = useState<DailyStudyTime>(preferences.dailyStudyMinutes);
  const [xpTarget, setXpTarget] = useState<number>(preferences.dailyXpGoal);
  const [placementAnswers, setPlacementAnswers] = useState<Record<number, string>>({});
  const [currentPlacementIdx, setCurrentPlacementIdx] = useState<number>(0);

  if (preferences.hasCompletedOnboarding) {
    return null; // Already completed onboarding
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

  // 8 Calibrated Diagnostic Questions covering the full beginner-to-intermediate spectrum
  const placementQuestions = [
    {
      domain: "Hiragana Vowels",
      q: "Which sound does the hiragana 'あ' represent?",
      options: ["a", "i", "u", "e"],
      correct: "a",
    },
    {
      domain: "Katakana Loanwords",
      q: "Which Katakana represents the loanword 'Coffee' (コーヒー)?",
      options: ["コーヒー", "コーヒ", "ケーキ", "コーラ"],
      correct: "コーヒー",
    },
    {
      domain: "Basic Vocabulary",
      q: "What does the word 'ねこ' (neko) mean in English?",
      options: ["Cat", "Dog", "Bird", "Fish"],
      correct: "Cat",
    },
    {
      domain: "Grammar Particles",
      q: "Which particle marks the direct object in '水を飲みます' (I drink water)?",
      options: ["を", "は", "が", "に"],
      correct: "を",
    },
    {
      domain: "Polite Conjugation",
      q: "Which polite form expresses past negative 'did not eat'?",
      options: ["食べませんでした", "食べません", "食べました", "食べなかった"],
      correct: "食べませんでした",
    },
    {
      domain: "Kanji Recognition",
      q: "What is the correct reading of '日本人' (Japanese person)?",
      options: ["にほんじん", "にほんびと", "にちほんじん", "にほん"],
      correct: "にほんじん",
    },
    {
      domain: "Sentence Comprehension",
      q: "週末に友達と映画を見ました。What did the speaker do over the weekend?",
      options: [
        "Watched a movie with a friend",
        "Studied with a teacher",
        "Went shopping alone",
        "Ate at a restaurant",
      ],
      correct: "Watched a movie with a friend",
    },
    {
      domain: "Te-form / Permission",
      q: "Which pattern correctly expresses permission ('You may eat')?",
      options: [
        "食べてもいいです",
        "食べなくていいです",
        "食べてはいけません",
        "食べるほうがいいです",
      ],
      correct: "食べてもいいです",
    },
  ];

  const evaluatePlacementScore = () => {
    let score = 0;
    placementQuestions.forEach((q, idx) => {
      if (placementAnswers[idx] === q.correct) score++;
    });
    return score;
  };

  const getPlacementOutcome = (score: number) => {
    if (score >= 8) {
      return {
        level: "advanced" as AbilityLevel,
        label: "N4 Certified / N3 Foundation (中級準備)",
        desc: "High comprehension across kana, kanji, particles, and compound conjugations. Initial 8 units unlocked.",
        unlockedUnits: 8,
      };
    }
    if (score >= 6) {
      return {
        level: "intermediate" as AbilityLevel,
        label: "N4 Foundation (N4初級)",
        desc: "Solid grasp of N5 particles and sentence structure. Initial 6 units unlocked.",
        unlockedUnits: 6,
      };
    }
    if (score >= 4) {
      return {
        level: "basic_vocab" as AbilityLevel,
        label: "N5 Level (N5基礎完了)",
        desc: "Comfortable with kana and basic particle usage. Initial 4 units unlocked.",
        unlockedUnits: 4,
      };
    }
    if (score >= 2) {
      return {
        level: "know_kana" as AbilityLevel,
        label: "Kana Confident (仮名修得)",
        desc: "Recognizes phonetic scripts. Units 1 and 2 unlocked.",
        unlockedUnits: 2,
      };
    }
    return {
      level: "beginner" as AbilityLevel,
      label: "Complete Beginner (入門ゼロスタート)",
      desc: "Starting fresh from zero with Hiragana vowel foundations. Unit 1 unlocked.",
      unlockedUnits: 1,
    };
  };

  const handleFinish = (score: number = 0) => {
    const outcome = getPlacementOutcome(score);
    const store = AppDataStore.getInstance();

    // Unlock lessons matching the calibrated level
    const gameState = store.loadGamificationState();
    const unlockedSet = new Set(gameState.unlockedLessons);

    CURRICULUM_UNITS.slice(0, outcome.unlockedUnits).forEach((unit) => {
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

  const activeQuestion = placementQuestions[currentPlacementIdx];
  const placementScore = evaluatePlacementScore();
  const outcome = getPlacementOutcome(placementScore);

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
                  <span className="font-semibold text-xs text-ink leading-tight">{opt.label}</span>
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
              <h2 className="text-xl font-bold text-ink">Choose your daily commitment</h2>
              <p className="text-sm text-subtle">Consistency beats cramming. You can always change this later.</p>
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
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-bold text-sm text-ink">{opt.label}</div>
                      <div className="text-xs text-subtle">{opt.intensity}</div>
                    </div>
                  </div>
                  {studyTime === opt.time && <Check className="w-5 h-5 text-primary" />}
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

        {/* STEP 5: 8-Question Adaptive Diagnostic Assessment */}
        {step === 5 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  Question {currentPlacementIdx + 1} of {placementQuestions.length} • {activeQuestion.domain}
                </span>
                <h2 className="text-lg font-bold text-ink mt-0.5">Adaptive Placement Assessment</h2>
              </div>
              <div className="w-24 bg-card h-2 rounded-full overflow-hidden border border-border">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.round(((currentPlacementIdx + 1) / placementQuestions.length) * 100)}%`,
                  }}
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-subtle border border-border space-y-4">
              <div className="font-bold text-sm text-ink leading-relaxed">
                {activeQuestion.q}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activeQuestion.options.map((opt) => {
                  const isSelected = placementAnswers[currentPlacementIdx] === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() =>
                        setPlacementAnswers((prev) => ({
                          ...prev,
                          [currentPlacementIdx]: opt,
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

              {currentPlacementIdx + 1 < placementQuestions.length ? (
                <button
                  disabled={!placementAnswers[currentPlacementIdx]}
                  onClick={() => setCurrentPlacementIdx((prev) => prev + 1)}
                  className="flex-1 py-3 bg-primary disabled:opacity-50 hover:bg-primary-hover text-white font-bold rounded-2xl shadow-soft flex items-center justify-center gap-2"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  disabled={!placementAnswers[currentPlacementIdx]}
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
          <div className="space-y-6 text-center py-2">
            <div className="w-16 h-16 rounded-3xl bg-primary-light text-primary flex items-center justify-center mx-auto text-3xl shadow-soft animate-bounce">
              🎓
            </div>
            <div>
              <h2 className="text-2xl font-bold text-ink">Calibrated Learning Path Ready!</h2>
              <p className="text-xs text-subtle mt-1 max-w-sm mx-auto">
                Placement score: <span className="font-bold text-primary">{placementScore} / {placementQuestions.length}</span> ({Math.round((placementScore / placementQuestions.length) * 100)}% accuracy).
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
              onClick={() => handleFinish(placementScore)}
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
