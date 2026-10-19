"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/providers/state-context";
import { CURRICULUM_UNITS, getAllLessons } from "@/data/curriculum";
import { LessonPlayer } from "@/components/lessons/lesson-player";
import { Lesson } from "@/types";
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
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const { preferences, gamification, quests, srsItems } = useApp();
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  const allLessons = getAllLessons();

  // Find the next recommended lesson (first unlocked lesson that hasn't been completed or the current first)
  const nextLesson =
    allLessons.find(
      (l) => gamification.unlockedLessons.includes(l.id) && !gamification.completedLessons[l.id]
    ) || allLessons[0];

  const currentUnit = CURRICULUM_UNITS.find((u) => u.id === nextLesson.unitId) || CURRICULUM_UNITS[0];

  const dueReviewsCount = srsItems.filter((i) => i.dueDate <= new Date().toISOString()).length;

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
      {/* Hero Learning Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-accent p-6 sm:p-8 text-white shadow-card">
        <div className="relative z-10 max-w-xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold">
            <span>🐾</span>
            <span>Welcome back, Learner</span>
          </div>
          <div>
            <span className="text-xs font-jp uppercase tracking-wider opacity-80">
              Unit {currentUnit.order} • {currentUnit.japaneseTitle}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold mt-1">{currentUnit.title}</h1>
            <p className="text-sm opacity-90 mt-2">{currentUnit.description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveLesson(nextLesson)}
              className="px-6 py-3.5 bg-white text-ink hover:bg-white/95 font-bold rounded-2xl shadow-soft text-sm flex items-center gap-2 hover:scale-105 transition-all"
            >
              <span>Continue: {nextLesson.title}</span>
              <ArrowRight className="w-4 h-4 text-primary" />
            </button>
            <Link
              href="/map"
              className="px-4 py-3.5 bg-black/20 hover:bg-black/30 font-semibold rounded-2xl text-xs backdrop-blur-md transition-colors"
            >
              View Course Map
            </Link>
          </div>
        </div>

        {/* Ambient Japanese watermark */}
        <div className="absolute right-4 bottom-2 text-8xl font-jp font-extrabold text-white/10 select-none pointer-events-none hidden sm:block">
          日本語
        </div>
      </div>

      {/* Grid: Daily Progress & Quick Hubs */}
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

      {/* Recommended Lessons Grid for Current Unit */}
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

      {/* Daily Quests Mini-Widget */}
      <div className="p-6 rounded-3xl bg-surface border border-border shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-base text-ink">Today's Daily Quests</h2>
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
