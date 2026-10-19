"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/providers/state-context";
import { AbilityLevel, LearningGoal, DailyStudyTime } from "@/types";
import { Check, ArrowRight, Sparkles, BookOpen, Clock, Target, Compass } from "lucide-react";

export function OnboardingWizard() {
  const { preferences, updatePreferences } = useApp();
  const [step, setStep] = useState<number>(1);

  // Form State
  const [ability, setAbility] = useState<AbilityLevel>(preferences.abilityLevel);
  const [goal, setGoal] = useState<LearningGoal>(preferences.primaryGoal);
  const [studyTime, setStudyTime] = useState<DailyStudyTime>(preferences.dailyStudyMinutes);
  const [xpTarget, setXpTarget] = useState<number>(preferences.dailyXpGoal);
  const [placementAnswers, setPlacementAnswers] = useState<Record<number, string>>({});

  if (preferences.hasCompletedOnboarding) {
    return null; // Already completed onboarding
  }

  const handleFinish = (score: number = 0) => {
    updatePreferences({
      abilityLevel: ability,
      primaryGoal: goal,
      dailyStudyMinutes: studyTime,
      dailyXpGoal: xpTarget,
      placementScore: score,
      hasCompletedOnboarding: true,
    });
  };

  const abilityOptions: { id: AbilityLevel; label: string; desc: string }[] = [
    { id: "beginner", label: "Complete Beginner", desc: "No prior Japanese knowledge. Starting from zero." },
    { id: "know_hiragana", label: "Know Hiragana", desc: "Can read basic hiragana characters." },
    { id: "know_kana", label: "Know Hiragana & Katakana", desc: "Comfortable reading both phonetic scripts." },
    { id: "basic_vocab", label: "Know Basic Vocabulary", desc: "Understand simple words and common greetings." },
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

  const placementQuestions = [
    { q: "Which sound does 'あ' represent?", options: ["a", "i", "u", "e"], correct: "a" },
    { q: "What does 'ねこ' mean?", options: ["Cat", "Dog", "Bird", "Fish"], correct: "Cat" },
    { q: "What particle marks the direct object in '水を飲みます'?", options: ["を", "は", "が", "に"], correct: "を" },
  ];

  const evaluatePlacement = () => {
    let score = 0;
    placementQuestions.forEach((q, idx) => {
      if (placementAnswers[idx] === q.correct) score++;
    });
    return score;
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
              <p className="text-sm text-subtle">We'll tailor your starting lessons to match your level.</p>
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
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Quick Placement Assessment */}
        {step === 5 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-ink">Quick Placement Assessment (Optional)</h2>
              <p className="text-sm text-subtle">Answer 3 rapid questions to calibrate your curriculum.</p>
            </div>
            <div className="space-y-4">
              {placementQuestions.map((q, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-subtle border border-border">
                  <div className="font-semibold text-sm text-ink mb-2">
                    {idx + 1}. {q.q}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {q.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() =>
                          setPlacementAnswers((prev) => ({ ...prev, [idx]: opt }))
                        }
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                          placementAnswers[idx] === opt
                            ? "border-primary bg-primary text-white"
                            : "border-border bg-card hover:bg-surface text-ink"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => handleFinish(0)}
                className="w-1/3 py-3 border border-border text-subtle font-semibold rounded-2xl hover:bg-subtle text-xs"
              >
                Skip Test
              </button>
              <button
                onClick={() => setStep(6)}
                className="flex-1 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-2xl shadow-soft flex items-center justify-center gap-2"
              >
                <span>Calculate Path</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: Generated Path Confirmation */}
        {step === 6 && (
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 rounded-3xl bg-primary-light text-primary flex items-center justify-center mx-auto text-3xl shadow-soft animate-bounce">
              🎉
            </div>
            <div>
              <h2 className="text-2xl font-bold text-ink">Your Learning Path is Ready!</h2>
              <p className="text-sm text-subtle mt-1 max-w-sm mx-auto">
                Placement score: <span className="font-bold text-primary">{evaluatePlacement()} / 3</span>. We've customized your initial units and spaced repetition queues.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-subtle border border-border text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-subtle">Starting Level:</span>
                <span className="font-bold text-ink capitalize">{ability.replace("_", " ")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-subtle">Focus Goal:</span>
                <span className="font-bold text-ink capitalize">{goal.replace("_", " ")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-subtle">Daily Target:</span>
                <span className="font-bold text-primary">{xpTarget} XP ({studyTime} min)</span>
              </div>
            </div>
            <button
              onClick={() => handleFinish(evaluatePlacement())}
              className="w-full py-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-2xl shadow-soft text-base transition-all"
            >
              Start Learning Japanese 🐾
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
