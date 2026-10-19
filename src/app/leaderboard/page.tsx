"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/providers/state-context";
import { Trophy, Shield, Medal, Lock } from "lucide-react";

interface LeaderboardUser {
  rank: number;
  displayName: string;
  avatar: string;
  xp: number;
  isCurrentUser?: boolean;
}

export default function LeaderboardPage() {
  const { gamification } = useApp();
  const [optOut, setOptOut] = useState(false);

  // Generate safe cohort rankings
  const cohort: LeaderboardUser[] = [
    { rank: 1, displayName: "SakuraBlossom", avatar: "🌸", xp: 420 },
    { rank: 2, displayName: "TokyoDrifter", avatar: "🚅", xp: 380 },
    { rank: 3, displayName: "MatchaLover", avatar: "🍵", xp: 310 },
    { rank: 4, displayName: "You (Learner)", avatar: "🐱", xp: gamification.xp, isCurrentUser: true },
    { rank: 5, displayName: "Kenji_Jap", avatar: "🏯", xp: 190 },
    { rank: 6, displayName: "NekoSensei", avatar: "🐾", xp: 140 },
    { rank: 7, displayName: "Haruto_99", avatar: "🎌", xp: 95 },
  ].sort((a, b) => b.xp - a.xp).map((item, idx) => ({ ...item, rank: idx + 1 }));

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary-light text-primary">
            League Standings
          </span>
          <h1 className="text-3xl font-bold text-ink mt-2">Leaderboard (番付表)</h1>
          <p className="text-sm text-subtle">
            Jade Division. Compete safely with learners in your cohort using pseudonyms.
          </p>
        </div>

        {/* Privacy toggle */}
        <button
          onClick={() => setOptOut(!optOut)}
          className="px-3.5 py-2 rounded-xl text-xs font-bold border border-border bg-surface text-subtle hover:text-ink transition-colors"
        >
          {optOut ? "Opt Back In" : "Opt Out of Leaderboard"}
        </button>
      </div>

      {optOut ? (
        <div className="p-12 rounded-3xl bg-surface border border-border text-center space-y-3 shadow-card">
          <Lock className="w-8 h-8 text-muted mx-auto" />
          <h3 className="font-bold text-lg text-ink">Leaderboard Hidden</h3>
          <p className="text-xs text-subtle max-w-sm mx-auto">
            You have chosen to keep your study activity private. You will not appear on rankings, and public cohort listings are hidden.
          </p>
        </div>
      ) : (
        <div className="p-6 rounded-3xl bg-surface border border-border shadow-card space-y-3">
          <div className="flex items-center justify-between text-xs text-subtle border-b border-border pb-3 px-3">
            <span>Rank & Learner</span>
            <span>Weekly XP</span>
          </div>

          <div className="space-y-2">
            {cohort.map((user) => {
              const isTop3 = user.rank <= 3;
              return (
                <div
                  key={user.rank}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                    user.isCurrentUser
                      ? "border-primary bg-primary-light/50 font-bold shadow-soft"
                      : "border-border bg-card"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                        user.rank === 1
                          ? "bg-amber-400 text-white"
                          : user.rank === 2
                          ? "bg-slate-300 text-slate-800"
                          : user.rank === 3
                          ? "bg-amber-700 text-white"
                          : "bg-subtle text-subtle"
                      }`}
                    >
                      {user.rank}
                    </span>
                    <span className="text-xl">{user.avatar}</span>
                    <span className="text-sm font-semibold text-ink">{user.displayName}</span>
                  </div>

                  <span className="text-sm font-bold text-primary">⚡ {user.xp} XP</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
