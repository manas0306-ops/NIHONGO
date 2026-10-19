"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/providers/state-context";
import { getAllLessons } from "@/data/curriculum";
import { LessonPlayer } from "@/components/lessons/lesson-player";
import { Lesson, Exercise } from "@/types";
import { Zap, Volume2, Compass, Sparkles, BookOpen, Clock, ArrowRight } from "lucide-react";

export default function PracticeHubPage() {
  const [activeSession, setActiveSession] = useState<Lesson | null>(null);

  const lessons = getAllLessons();

  const startCustomPractice = (title: string, skill: Exercise["skillTag"]) => {
    // Collect exercises of target skill
    const matchingExercises = lessons
      .flatMap((l) => l.exercises)
      .filter((e) => e.skillTag === skill)
      .slice(0, 5);

    const practiceLesson: Lesson = {
      id: `practice_${skill}_${Date.now()}`,
      unitId: "practice",
      title,
      japaneseTitle: "特訓セッション",
      description: `Rapid 5-question sprint focused exclusively on ${skill}.`,
      order: 999,
      level: "A",
      jlpt: "N5",
      durationMinutes: 3,
      objectives: [`Strengthen ${skill} accuracy`],
      prerequisites: [],
      xpReward: 15,
      exercises: matchingExercises.length > 0 ? matchingExercises : lessons[0].exercises.slice(0, 5),
    };

    setActiveSession(practiceLesson);
  };

  if (activeSession) {
    return <LessonPlayer lesson={activeSession} onExit={() => setActiveSession(null)} />;
  }

  const practiceCards = [
    {
      title: "Kana Speed Drill",
      jpTitle: "仮名スピード特訓",
      desc: "Fast recognition of Hiragana & Katakana sounds.",
      icon: Compass,
      color: "from-pink-500 to-rose-600",
      skill: "kana" as const,
    },
    {
      title: "Listening Sprint",
      jpTitle: "リスニング・スプリント",
      desc: "Sharpen listening comprehension with audio-only questions.",
      icon: Volume2,
      color: "from-blue-500 to-cyan-600",
      skill: "listening" as const,
    },
    {
      title: "Kanji Quick Challenge",
      jpTitle: "漢字チャレンジ",
      desc: "Rapid identification of On'yomi, Kun'yomi, and radicals.",
      icon: Sparkles,
      color: "from-amber-500 to-orange-600",
      skill: "kanji" as const,
    },
    {
      title: "Grammar Repair",
      jpTitle: "文法パズル特訓",
      desc: "Particle placement and sentence construction practice.",
      icon: BookOpen,
      color: "from-emerald-500 to-green-600",
      skill: "grammar" as const,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary-light text-primary">
          Training Ground
        </span>
        <h1 className="text-3xl font-bold text-ink mt-2">Practice Hub (特訓ハブ)</h1>
        <p className="text-sm text-subtle">
          Targeted micro-sessions to reinforce specific skills without affecting curriculum progression.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {practiceCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-surface border border-border shadow-card flex flex-col justify-between space-y-4 hover:border-primary/50 transition-all"
            >
              <div className="space-y-3">
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.color} text-white flex items-center justify-center shadow-soft`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-ink">{card.title}</h3>
                  <div className="text-xs font-jp text-subtle">{card.jpTitle}</div>
                  <p className="text-xs text-subtle mt-1.5 leading-relaxed">{card.desc}</p>
                </div>
              </div>

              <button
                onClick={() => startCustomPractice(card.title, card.skill)}
                className="w-full py-3 rounded-2xl bg-primary hover:bg-primary-hover text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-soft transition-all"
              >
                <span>Start Drill (+15 XP)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
