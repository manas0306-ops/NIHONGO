"use client";

import React from "react";
import { useApp } from "@/lib/providers/state-context";
import { Target, Trophy, Sparkles, CheckCircle2 } from "lucide-react";

export default function QuestsPage() {
  const { quests } = useApp();

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary-light text-primary">
          Missions
        </span>
        <h1 className="text-3xl font-bold text-ink mt-2">Quests & Challenges (クエスト)</h1>
        <p className="text-sm text-subtle">
          Complete daily study goals and earn bonus XP, gems, and exclusive streak badges.
        </p>
      </div>

      <div className="space-y-6">
        {/* Daily Quests Section */}
        <div className="p-6 rounded-3xl bg-surface border border-border shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="font-bold text-lg text-ink flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              <span>Daily Quests</span>
            </h2>
            <span className="text-xs text-subtle">Resets at midnight (local time)</span>
          </div>

          <div className="space-y-3">
            {quests.map((q) => {
              const progressPercent = Math.min(100, Math.round((q.progress / q.target) * 100));
              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    q.isCompleted
                      ? "bg-emerald-500/10 border-emerald-500/30"
                      : "bg-card border-border"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-ink">{q.title}</span>
                      {q.isCompleted && (
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Completed</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-subtle">{q.description}</p>
                    <div className="w-48 bg-subtle h-2 rounded-full overflow-hidden border border-border mt-2">
                      <div
                        className="bg-primary h-full rounded-full transition-all"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-primary bg-primary-light px-3 py-1.5 rounded-xl">
                      +{q.xpReward} XP
                    </span>
                    <span className="text-xs font-bold text-blue-500 bg-blue-500/10 px-3 py-1.5 rounded-xl">
                      +{q.gemReward} 💎
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly Challenge Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-card space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full w-fit">
            <Trophy className="w-4 h-4" />
            <span>Weekly Special Challenge</span>
          </div>
          <h3 className="text-xl font-bold">The 7-Day Consistency Master</h3>
          <p className="text-xs opacity-90 max-w-md">
            Maintain your study streak for 7 consecutive days to unlock the exclusive "Fire Cat" avatar badge and +100 bonus XP.
          </p>
        </div>
      </div>
    </div>
  );
}
