"use client";

import React from "react";
import { useApp } from "@/lib/providers/state-context";
import { Award, CheckCircle2, Lock } from "lucide-react";

export default function AchievementsPage() {
  const { achievements } = useApp();

  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary-light text-primary">
            Badges of Honor
          </span>
          <h1 className="text-3xl font-bold text-ink mt-2">Achievements (実績バッジ)</h1>
          <p className="text-sm text-subtle">
            Commemorate milestones in your Japanese learning journey.
          </p>
        </div>

        <div className="text-xs font-bold px-3 py-1.5 rounded-xl bg-subtle border border-border text-ink">
          Unlocked: {unlockedCount} / {achievements.length}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {achievements.map((a) => {
          const progressPercent = Math.min(100, Math.round((a.progress / a.target) * 100));

          return (
            <div
              key={a.id}
              className={`p-5 rounded-3xl border transition-all flex items-start gap-4 ${
                a.isUnlocked
                  ? "bg-surface border-amber-500/30 shadow-card"
                  : "bg-subtle/50 border-border opacity-70"
              }`}
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-soft ${
                  a.isUnlocked ? "bg-amber-500/10 border border-amber-500/20" : "bg-card border border-border grayscale"
                }`}
              >
                {a.icon}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-ink">{a.title}</h3>
                  <span className="text-[11px] font-jp text-subtle">{a.japaneseTitle}</span>
                </div>
                <p className="text-xs text-subtle">{a.description}</p>

                <div className="pt-2">
                  <div className="w-full bg-card h-2 rounded-full overflow-hidden border border-border">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-muted mt-1 font-semibold">
                    <span>
                      {a.progress} / {a.target}
                    </span>
                    {a.isUnlocked && <span className="text-emerald-600 font-bold">Unlocked ✓</span>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
