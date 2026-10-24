"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/providers/state-context";
import { CURRICULUM_UNITS, getAllLessons } from "@/data/curriculum";
import { LessonPlayer } from "@/components/lessons/lesson-player";
import { Lesson, Exercise } from "@/types";
import {
  Flame,
  Zap,
  Target,
  Sparkles,
  BookOpen,
  ArrowRight,
  Repeat,
  Compass,
  Award,
  CheckCircle2,
  Lock,
  AlertTriangle,
  Brain,
  HelpCircle,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const { preferences, gamification, quests, srsItems, learnerModel, weakAreas } = useApp();
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  const allLessons = getAllLessons();

  // Find the next recommended lesson (first unlocked lesson that hasn't been completed or the current first)
  const nextLesson =
    allLessons.find(
      (l) => gamification.unlockedLessons.includes(l.id) && !gamification.completedLessons[l.id]
    ) || allLessons[0];

  const currentUnit = CURRICULUM_UNITS.find((u) => u.id === nextLesson.unitId) || CURRICULUM_UNITS[0];

  const nowIso = new Date().toISOString();
  const dueReviewsCount = srsItems.filter((i) => i.dueDate <= nowIso).length;

  // -------------------------------------------------------------------------
  // THE CORE LEARNING LOOP: RECOMMENDATION ENGINE
  // Answers: 1. What to study now? 2. Why study it? 3. What to do next?
  // -------------------------------------------------------------------------
  interface Recommendation {
    type: "review" | "weak_area" | "lesson" | "drill";
    title: string;
    japaneseTitle: string;
    why: string;
    nextStep: string;
    actionLabel: string;
    actionHref?: string;
    onAction?: () => void;
    badge: string;
    urgencyColor: string;
  }

  const getSmartRecommendation = (): Recommendation => {
    // Priority 1: Overdue spaced-repetition reviews (prevent memory decay)
    if (dueReviewsCount > 0) {
      return {
        type: "review",
        title: `Consolidate ${dueReviewsCount} Due Flashcard${dueReviewsCount > 1 ? "s" : ""}`,
        japaneseTitle: "忘却曲線に基づいた復習",
        why: `Items have entered their memory consolidation window. Reviewing now locks them into long-term recall before decay occurs.`,
        nextStep: `After completing reviews, proceed to Unit ${currentUnit.order}: ${nextLesson.title}.`,
        actionLabel: `Review ${dueReviewsCount} Items Now (SM-2)`,
        actionHref: "/review",
        badge: "Critical Recall",
        urgencyColor: "from-rose-500 to-amber-600",
      };
    }

    // Priority 2: Active repeated weak areas
    if (weakAreas.length > 0) {
      const topWeak = weakAreas[0];
      return {
        type: "weak_area",
        title: `Repair Weak Area: ${topWeak.concept}`,
        japaneseTitle: "弱点克服トレーニング",
        why: `You missed this concept ${topWeak.errorCount} time${topWeak.errorCount > 1 ? "s" : ""} recently. A focused 3-minute repair session will eliminate this confusion.`,
        nextStep: `Once cleared, continue curriculum progression in ${nextLesson.title}.`,
        actionLabel: `Practice ${topWeak.concept}`,
        actionHref: "/practice",
        badge: "Adaptive Repair",
        urgencyColor: "from-amber-500 to-orange-600",
      };
    }

    // Priority 3: Curriculum Progression
    return {
      type: "lesson",
      title: `Continue Lesson: ${nextLesson.title}`,
      japaneseTitle: nextLesson.japaneseTitle,
      why: `Your review queue is clear and your fundamentals are strong. Learn new syntax and vocabulary to advance toward JLPT ${nextLesson.jlpt}.`,
      nextStep: `Master the exercises to automatically enroll new words into your daily review queue.`,
      actionLabel: `Start Lesson (+${nextLesson.xpReward} XP)`,
      onAction: () => setActiveLesson(nextLesson),
      badge: "Core Curriculum",
      urgencyColor: "from-primary to-accent",
    };
  };

  const rec = getSmartRecommendation();

  // If active lesson is chosen
  if (activeLesson) {
    return (
      <LessonPlayer
        lesson={activeLesson}
        onExit={() => setActiveLesson(null)}
        nextLessonId={allLessons[allLessons.findIndex((l) => l.id === activeLesson.id) + 1]?.id}
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* ----------------------------------------------------------------- */}
      {/* 1. THE THREE CORE QUESTIONS (SMART RECOMMENDATION HERO)           */}
      {/* ----------------------------------------------------------------- */}
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${rec.urgencyColor} p-6 sm:p-8 text-white shadow-card`}>
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Tutor Recommendation • {rec.badge}</span>
          </div>

          <div>
            <span className="text-xs font-jp uppercase tracking-wider opacity-85 block">
              {rec.japaneseTitle}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-1 leading-tight">{rec.title}</h1>
          </div>

          {/* Three Questions Explicit Breakdown */}
          <div className="space-y-2.5 pt-1 text-xs sm:text-sm">
            <div className="flex items-start gap-2 bg-black/15 p-2.5 rounded-xl backdrop-blur-sm">
              <span className="font-bold text-white/90 whitespace-nowrap">1. What to study now?</span>
              <span className="text-white font-semibold">{rec.title}</span>
            </div>
            <div className="flex items-start gap-2 bg-black/15 p-2.5 rounded-xl backdrop-blur-sm">
              <span className="font-bold text-white/90 whitespace-nowrap">2. Why study it?</span>
              <span className="text-white/90">{rec.why}</span>
            </div>
            <div className="flex items-start gap-2 bg-black/15 p-2.5 rounded-xl backdrop-blur-sm">
              <span className="font-bold text-white/90 whitespace-nowrap">3. What to do next?</span>
              <span className="text-white/90">{rec.nextStep}</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            {rec.actionHref ? (
              <Link
                href={rec.actionHref}
                className="px-6 py-3.5 bg-white text-ink hover:bg-white/95 font-bold rounded-2xl shadow-soft text-sm flex items-center gap-2 hover:scale-105 transition-all"
              >
                <span>{rec.actionLabel}</span>
                <ArrowRight className="w-4 h-4 text-primary" />
              </Link>
            ) : (
              <button
                onClick={rec.onAction}
                className="px-6 py-3.5 bg-white text-ink hover:bg-white/95 font-bold rounded-2xl shadow-soft text-sm flex items-center gap-2 hover:scale-105 transition-all"
              >
                <span>{rec.actionLabel}</span>
                <ArrowRight className="w-4 h-4 text-primary" />
              </button>
            )}

            <Link
              href="/map"
              className="px-4 py-3.5 bg-black/20 hover:bg-black/30 font-semibold rounded-2xl text-xs backdrop-blur-md transition-colors"
            >
              Explore Course Map
            </Link>
          </div>
        </div>

        {/* Japanese ambient typography watermark */}
        <div className="absolute right-4 bottom-2 text-8xl font-jp font-extrabold text-white/10 select-none pointer-events-none hidden sm:block">
          日本語
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* 2. DEMONSTRATED MASTERY VS CURRICULUM PROGRESS VS XP               */}
      {/* ----------------------------------------------------------------- */}
      <div className="p-6 rounded-3xl bg-surface border border-border shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-base text-ink">Demonstrated Skill Mastery vs Progress</h2>
          </div>
          <span className="text-xs text-subtle">
            Mastery reflects demonstrated retention depth, not raw XP
          </span>
        </div>

        {/* Top 3 Summary Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-card border border-border flex items-center justify-between">
            <div>
              <div className="text-xs text-subtle font-medium">Demonstrated Mastery</div>
              <div className="text-2xl font-bold text-primary">{learnerModel.overallMastery}%</div>
            </div>
            <TrendingUp className="w-6 h-6 text-primary opacity-60" />
          </div>

          <div className="p-3.5 rounded-2xl bg-card border border-border flex items-center justify-between">
            <div>
              <div className="text-xs text-subtle font-medium">Curriculum Progress</div>
              <div className="text-2xl font-bold text-emerald-600">
                {learnerModel.progressPercentage}%
              </div>
            </div>
            <BookOpen className="w-6 h-6 text-emerald-600 opacity-60" />
          </div>

          <div className="p-3.5 rounded-2xl bg-card border border-border flex items-center justify-between">
            <div>
              <div className="text-xs text-subtle font-medium">Gamified XP (Level {gamification.level})</div>
              <div className="text-2xl font-bold text-amber-500">⚡ {gamification.xp}</div>
            </div>
            <Flame className="w-6 h-6 text-amber-500 opacity-60" />
          </div>
        </div>

        {/* Skill by Skill Progress Bars */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {(["kana", "vocabulary", "kanji", "grammar"] as const).map((skill) => {
            const sm = learnerModel.skills[skill];
            return (
              <div key={skill} className="p-3 rounded-xl bg-subtle border border-border space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-ink capitalize">{skill}</span>
                  <span className="font-bold text-primary">{sm.level}%</span>
                </div>
                <div className="w-full bg-card h-1.5 rounded-full overflow-hidden border border-border">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-300"
                    style={{ width: `${sm.level}%` }}
                  />
                </div>
                <div className="text-[10px] text-subtle flex justify-between">
                  <span>{sm.itemsMastered} mastered</span>
                  <span>{sm.accuracy}% acc</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* 3. YOUR WEAK AREAS (あなたの弱点) — ERROR-DRIVEN ADAPTIVE LEARNING */}
      {/* ----------------------------------------------------------------- */}
      <div className="p-6 rounded-3xl bg-surface border border-border shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h2 className="font-bold text-base text-ink">あなたの弱点 (Your Weak Areas)</h2>
          </div>
          <span className="text-xs text-subtle">
            {weakAreas.length > 0 ? `${weakAreas.length} concepts need repair` : "All clear"}
          </span>
        </div>

        {weakAreas.length === 0 ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-1">
            <CheckCircle2 className="w-7 h-7 text-emerald-600 mx-auto" />
            <div className="font-bold text-sm text-emerald-800 dark:text-emerald-300">
              No Active Weak Points Detected
            </div>
            <p className="text-xs text-emerald-700/80 dark:text-emerald-400 max-w-sm mx-auto">
              You haven&apos;t repeated mistakes recently. Keep practicing to retain your mastery!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {weakAreas.map((area, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-card border border-border space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-ink">{area.concept}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600">
                      {area.errorCount} mistake{area.errorCount > 1 ? "s" : ""}
                    </span>
                  </div>
                  <p className="text-xs text-subtle mt-1">
                    Missed in &quot;{area.exampleProblem.prompt.slice(0, 35)}...&quot;
                  </p>
                  <div className="text-[11px] bg-subtle p-2 rounded-lg border border-border mt-2 space-y-0.5">
                    <div className="text-rose-600">❌ Your answer: {area.exampleProblem.userAnswer}</div>
                    <div className="text-emerald-600">✅ Expected: {area.exampleProblem.correctAnswer}</div>
                  </div>
                </div>

                <Link
                  href="/practice"
                  className="w-full py-2 px-3 rounded-xl bg-primary-light text-primary hover:bg-primary hover:text-white font-bold text-xs text-center transition-colors block mt-2"
                >
                  Targeted Repair Drill →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* 4. DAILY STUDY HABIT: XP & STREAK                                 */}
      {/* ----------------------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Daily XP Target */}
        <div className="p-5 rounded-3xl bg-surface border border-border shadow-card space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-ink flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <span>Daily XP Goal</span>
            </span>
            <span className="text-xs font-bold text-primary">
              {gamification.xp} / {preferences.dailyXpGoal} XP
            </span>
          </div>
          <div className="w-full bg-subtle h-2.5 rounded-full overflow-hidden border border-border">
            <div
              className="bg-primary h-full rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(100, Math.round((gamification.xp / preferences.dailyXpGoal) * 100))}%`,
              }}
            />
          </div>
          <p className="text-xs text-subtle">
            {gamification.xp >= preferences.dailyXpGoal
              ? "🎉 Daily goal accomplished! Keep crushing it!"
              : `${Math.max(0, preferences.dailyXpGoal - gamification.xp)} XP remaining to reach today's target.`}
          </p>
        </div>

        {/* Streak Flame */}
        <div className="p-5 rounded-3xl bg-surface border border-border shadow-card space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-ink flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Daily Streak</span>
            </span>
            <span className="text-xs font-bold text-amber-600">{gamification.streak} Days</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-subtle">
            <span>Streak Freeze active:</span>
            <span className="font-bold text-ink">{gamification.streakFreeze} available</span>
          </div>
          <p className="text-xs text-subtle">
            Study every day in your local timezone ({preferences.timezone}) to build fluency habit.
          </p>
        </div>

        {/* SRS Reviews Due */}
        <div className="p-5 rounded-3xl bg-surface border border-border shadow-card space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-ink flex items-center gap-2">
              <Repeat className="w-4 h-4 text-emerald-600" />
              <span>Review Center</span>
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">
              SM-2
            </span>
          </div>
          <div className="text-2xl font-bold text-ink">
            {dueReviewsCount} <span className="text-xs font-normal text-subtle">items due</span>
          </div>
          <Link
            href="/review"
            className="block text-center py-2 px-3 rounded-xl bg-subtle hover:bg-border font-semibold text-xs text-ink transition-colors"
          >
            Open Spaced Repetition Queue →
          </Link>
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* 5. CURRENT UNIT LESSONS PATH                                      */}
      {/* ----------------------------------------------------------------- */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-ink flex items-center gap-2">
            <span>📚</span>
            <span>Unit {currentUnit.order} Lessons</span>
          </h2>
          <span className="text-xs text-subtle font-jp">{currentUnit.japaneseTitle}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {currentUnit.lessons.map((lesson) => {
            const isUnlocked = gamification.unlockedLessons.includes(lesson.id);
            const isCompleted = !!gamification.completedLessons[lesson.id];

            return (
              <div
                key={lesson.id}
                className={`p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                  isCompleted
                    ? "bg-surface border-emerald-500/30 shadow-card"
                    : isUnlocked
                    ? "bg-surface border-border shadow-card hover:border-primary/50"
                    : "bg-subtle/60 border-border opacity-70"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-subtle text-subtle">
                      Lesson {lesson.order}
                    </span>
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : isUnlocked ? (
                      <span className="text-xs text-primary font-bold">+{lesson.xpReward} XP</span>
                    ) : (
                      <Lock className="w-4 h-4 text-muted" />
                    )}
                  </div>
                  <h3 className="font-bold text-base text-ink">{lesson.title}</h3>
                  <p className="text-xs font-jp text-subtle mt-0.5">{lesson.japaneseTitle}</p>
                  <p className="text-xs text-subtle mt-2 line-clamp-2">{lesson.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-border">
                  {isUnlocked ? (
                    <button
                      onClick={() => setActiveLesson(lesson)}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all ${
                        isCompleted
                          ? "bg-subtle hover:bg-border text-ink"
                          : "bg-primary hover:bg-primary-hover text-white shadow-soft"
                      }`}
                    >
                      {isCompleted ? "Practice Again" : "Start Lesson"}
                    </button>
                  ) : (
                    <span className="block text-center text-xs text-muted font-medium py-1">
                      Complete previous lesson to unlock
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* 6. TODAY'S DAILY QUESTS                                           */}
      {/* ----------------------------------------------------------------- */}
      <div className="p-6 rounded-3xl bg-surface border border-border shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-base text-ink">Today&apos;s Daily Quests</h2>
          </div>
          <Link href="/quests" className="text-xs font-semibold text-primary hover:underline">
            View All Quests →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {quests.map((q) => (
            <div key={q.id} className="p-3.5 rounded-2xl bg-subtle border border-border space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-ink">{q.title}</span>
                <span className="font-bold text-primary">+{q.xpReward} XP</span>
              </div>
              <div className="w-full bg-card h-2 rounded-full overflow-hidden border border-border">
                <div
                  className="bg-primary h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (q.progress / q.target) * 100)}%` }}
                />
              </div>
              <div className="text-[11px] text-subtle flex justify-between">
                <span>{q.description}</span>
                <span>
                  {q.progress} / {q.target}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
