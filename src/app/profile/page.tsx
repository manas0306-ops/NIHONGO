"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/providers/state-context";
import { User, Flame, Zap, Award, BookOpen, AlertTriangle, RotateCcw } from "lucide-react";

export default function ProfilePage() {
  const { preferences, gamification, srsItems, resetAllProgress } = useApp();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const completedCount = Object.keys(gamification.completedLessons).length;
  const kanjiCount = srsItems.filter((i) => i.type === "kanji").length;
  const vocabCount = srsItems.filter((i) => i.type === "vocabulary").length;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-card">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-ink">Reset All Progress?</h3>
              <p className="text-xs text-subtle mt-1 leading-relaxed">
                This will delete all completed lessons, earned XP, streaks, and SRS memory cards. This action is irreversible.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-border font-semibold text-xs hover:bg-subtle"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetAllProgress();
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-danger text-white font-bold text-xs"
              >
                Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Bio Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-card flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
        <div className="w-20 h-20 rounded-3xl bg-primary-light text-primary flex items-center justify-center text-4xl shadow-soft">
          🐱
        </div>
        <div className="space-y-1.5 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h1 className="text-2xl font-bold text-ink">Maanas Pandey</h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary-light text-primary w-fit mx-auto sm:mx-0">
              Level {gamification.level} Learner
            </span>
          </div>
          <p className="text-xs text-subtle">
            Goal: <span className="font-semibold capitalize text-ink">{preferences.primaryGoal.replace("_", " ")}</span> • Timezone: {preferences.timezone}
          </p>
          <p className="text-xs text-subtle">
            Daily Goal: {preferences.dailyXpGoal} XP / day ({preferences.dailyStudyMinutes} min/session)
          </p>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-surface border border-border shadow-card text-center space-y-1">
          <div className="text-xs text-subtle">Lessons Completed</div>
          <div className="text-3xl font-bold text-primary">{completedCount}</div>
        </div>
        <div className="p-5 rounded-3xl bg-surface border border-border shadow-card text-center space-y-1">
          <div className="text-xs text-subtle">Total XP</div>
          <div className="text-3xl font-bold text-ink">{gamification.xp}</div>
        </div>
        <div className="p-5 rounded-3xl bg-surface border border-border shadow-card text-center space-y-1">
          <div className="text-xs text-subtle">Current Streak</div>
          <div className="text-3xl font-bold text-amber-600">{gamification.streak} Days</div>
        </div>
        <div className="p-5 rounded-3xl bg-surface border border-border shadow-card text-center space-y-1">
          <div className="text-xs text-subtle">SRS Flashcards</div>
          <div className="text-3xl font-bold text-emerald-600">{srsItems.length}</div>
        </div>
      </div>

      {/* Completed Lessons List */}
      <div className="p-6 rounded-3xl bg-surface border border-border shadow-card space-y-4">
        <h2 className="font-bold text-base text-ink flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <span>Completed Curriculum Records</span>
        </h2>

        {completedCount === 0 ? (
          <div className="text-xs text-subtle p-6 text-center border-2 border-dashed border-border rounded-2xl">
            No lessons completed yet. Start your journey in the Home or Course Map tab!
          </div>
        ) : (
          <div className="space-y-2">
            {Object.entries(gamification.completedLessons).map(([lId, record]) => (
              <div
                key={lId}
                className="p-3.5 rounded-xl bg-subtle border border-border flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-ink mr-2">{lId.replace(/_/g, " ")}</span>
                  <span className="text-subtle font-mono">{record.completedAt.split("T")[0]}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-emerald-600">Score: {record.score}%</span>
                  <span className="text-subtle">Attempts: {record.attempts}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dangerous Action */}
      <div className="p-6 rounded-3xl bg-card border border-border shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-sm text-ink">Reset Learning Progress</h3>
          <p className="text-xs text-subtle">
            Clear all learning statistics, XP, streaks, and review queues.
          </p>
        </div>
        <button
          onClick={() => setShowResetConfirm(true)}
          className="px-4 py-2.5 rounded-xl border border-rose-500/40 text-rose-600 hover:bg-rose-500/10 font-bold text-xs flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Progress</span>
        </button>
      </div>
    </div>
  );
}
