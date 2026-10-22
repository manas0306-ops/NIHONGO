"use client";

import React from "react";
import { useApp } from "@/lib/providers/state-context";
import { Flame, ShieldCheck, Database } from "lucide-react";
import Link from "next/link";
import { DayNightToggle } from "./day-night-toggle";

export function Topbar() {
  const { preferences, gamification, syncStatus } = useApp();

  return (
    <header className="sticky top-0 z-30 bg-surface/90 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between">
      {/* Left: Brand or Location */}
      <div className="flex items-center gap-3">
        <span className="lg:hidden text-xl">🐱</span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-subtle text-subtle border border-border flex items-center gap-1">
            <Database className="w-3 h-3 text-primary" />
            <span>{syncStatus === "cloud" ? "Supabase Cloud" : "Local Storage Engine"}</span>
          </span>
          <span className="hidden sm:inline-flex text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-light text-primary">
            Theme: {preferences.theme}
          </span>
        </div>
      </div>

      {/* Right Stats and Toggles */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Streak */}
        <Link
          href="/profile"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold hover:bg-amber-500/20 transition-colors"
          title="Daily Study Streak"
        >
          <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
          <span>{gamification.streak}</span>
        </Link>

        {/* XP */}
        <div
          className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-primary/10 text-primary text-xs font-bold"
          title="Total Experience Points"
        >
          <span>⚡</span>
          <span>{gamification.xp}</span>
        </div>

        {/* Hearts */}
        <div
          className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-rose-500/10 text-rose-500 text-xs font-bold"
          title="Lesson Mistakes Budget"
        >
          <span>❤️</span>
          <span>{gamification.hearts}</span>
        </div>

        {/* Gems */}
        <div
          className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-blue-500/10 text-blue-500 text-xs font-bold"
          title="Earned Neko Gems"
        >
          <span>💎</span>
          <span>{gamification.gems}</span>
        </div>

        {/* Day & Night Mode Switcher */}
        <div className="hidden sm:block">
          <DayNightToggle variant="segmented" showLabel />
        </div>
        <div className="sm:hidden">
          <DayNightToggle variant="icon" />
        </div>
      </div>
    </header>
  );
}
