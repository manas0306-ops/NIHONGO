"use client";

import React, { useState } from "react";
import { CURRICULUM_UNITS, getAllLessons } from "@/data/curriculum";
import { useApp } from "@/lib/providers/state-context";
import { LessonPlayer } from "@/components/lessons/lesson-player";
import { Lesson } from "@/types";
import { CheckCircle2, Lock, Play, Sparkles } from "lucide-react";

export default function CourseMapPage() {
  const { gamification } = useApp();
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  const allLessons = getAllLessons();

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
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-10">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary-light text-primary">
          Curriculum Road
        </span>
        <h1 className="text-3xl font-bold text-ink">Japanese Mastery Map</h1>
        <p className="text-sm text-subtle max-w-md mx-auto">
          Progress from Foundations (Level A / JLPT N5) through Elementary and Intermediate fluency.
        </p>
      </div>

      <div className="space-y-12">
        {CURRICULUM_UNITS.map((unit) => (
          <div key={unit.id} className="relative">
            {/* Unit Header Card */}
            <div className={`p-6 rounded-3xl bg-gradient-to-r ${unit.color} text-white shadow-card mb-6`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full backdrop-blur-sm">
                  Unit {unit.order} • JLPT {unit.jlpt}
                </span>
                <span className="text-xs font-jp opacity-90">{unit.japaneseTitle}</span>
              </div>
              <h2 className="text-2xl font-bold mt-2">{unit.title}</h2>
              <p className="text-xs opacity-90 mt-1 max-w-lg">{unit.description}</p>
            </div>

            {/* Stepped Lessons Path */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {unit.lessons.map((lesson) => {
                const isUnlocked = gamification.unlockedLessons.includes(lesson.id);
                const isCompleted = !!gamification.completedLessons[lesson.id];
                const completionData = gamification.completedLessons[lesson.id];

                return (
                  <div
                    key={lesson.id}
                    className={`p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                      isCompleted
                        ? "bg-surface border-emerald-500/30 shadow-card"
                        : isUnlocked
                        ? "bg-surface border-border shadow-card hover:border-primary/50"
                        : "bg-subtle/50 border-border opacity-60"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-subtle text-subtle">
                          Lesson {lesson.order}
                        </span>
                        {isCompleted ? (
                          <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{completionData?.score}%</span>
                          </div>
                        ) : isUnlocked ? (
                          <span className="text-xs font-bold text-primary">+{lesson.xpReward} XP</span>
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
                          className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                            isCompleted
                              ? "bg-subtle hover:bg-border text-ink"
                              : "bg-primary hover:bg-primary-hover text-white shadow-soft"
                          }`}
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>{isCompleted ? "Review Lesson" : "Start Lesson"}</span>
                        </button>
                      ) : (
                        <span className="block text-center text-xs text-muted font-medium py-1">
                          Locked
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
