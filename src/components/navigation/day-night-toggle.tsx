"use client";

import React from "react";
import { Sun, Moon, Sparkles } from "lucide-react";
import { useApp } from "@/lib/providers/state-context";

interface DayNightToggleProps {
  variant?: "icon" | "segmented" | "pill";
  showLabel?: boolean;
  className?: string;
}

export function DayNightToggle({
  variant = "icon",
  showLabel = false,
  className = "",
}: DayNightToggleProps) {
  const { isNightMode, toggleDayNightMode, preferences } = useApp();

  if (variant === "segmented") {
    return (
      <div
        className={`inline-flex items-center p-1 rounded-2xl bg-subtle border border-border shadow-inner text-xs font-medium select-none ${className}`}
        role="group"
        aria-label="Day and Night mode toggle"
      >
        <button
          type="button"
          onClick={() => {
            if (isNightMode) toggleDayNightMode();
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all duration-300 ${
            !isNightMode
              ? "bg-surface text-ink font-bold shadow-soft scale-100"
              : "text-subtle hover:text-ink opacity-70"
          }`}
          aria-pressed={!isNightMode}
          title="昼モード — Day Mode (Press 'D' to toggle)"
        >
          <Sun
            className={`w-4 h-4 transition-transform duration-500 ${
              !isNightMode ? "text-amber-500 rotate-0" : "text-subtle -rotate-45"
            }`}
          />
          <span className="font-jp">昼</span>
          {showLabel && <span className="text-[11px] font-normal">Day</span>}
        </button>

        <button
          type="button"
          onClick={() => {
            if (!isNightMode) toggleDayNightMode();
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all duration-300 ${
            isNightMode
              ? "bg-surface text-ink font-bold shadow-soft scale-100"
              : "text-subtle hover:text-ink opacity-70"
          }`}
          aria-pressed={isNightMode}
          title="夜モード — Night Mode (Press 'D' to toggle)"
        >
          <Moon
            className={`w-4 h-4 transition-transform duration-500 ${
              isNightMode ? "text-indigo-400 rotate-0" : "text-subtle rotate-45"
            }`}
          />
          <span className="font-jp">夜</span>
          {showLabel && <span className="text-[11px] font-normal">Night</span>}
        </button>
      </div>
    );
  }

  if (variant === "pill") {
    return (
      <button
        type="button"
        onClick={toggleDayNightMode}
        className={`group flex items-center justify-between w-full px-3 py-2.5 rounded-2xl border transition-all duration-300 ${
          isNightMode
            ? "bg-indigo-950/30 border-indigo-800/40 text-indigo-200 hover:bg-indigo-950/50"
            : "bg-amber-50 border-amber-200/70 text-amber-900 hover:bg-amber-100/70"
        } ${className}`}
        aria-label={`Toggle Day and Night mode. Currently ${isNightMode ? "Night" : "Day"} mode`}
        title={`Click or press 'D' to switch to ${isNightMode ? "Day" : "Night"} mode`}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`w-7 h-7 rounded-xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 ${
              isNightMode
                ? "bg-indigo-500/20 text-indigo-300 shadow-sm shadow-indigo-500/20"
                : "bg-amber-500/20 text-amber-600 shadow-sm shadow-amber-500/20"
            }`}
          >
            {isNightMode ? (
              <Moon className="w-4 h-4 transition-transform duration-500 rotate-0" />
            ) : (
              <Sun className="w-4 h-4 transition-transform duration-500 rotate-0" />
            )}
          </div>
          <div className="text-left">
            <div className="text-xs font-bold leading-tight flex items-center gap-1.5">
              <span>{isNightMode ? "夜モード" : "昼モード"}</span>
              <span className="text-[10px] opacity-75 font-normal">
                {isNightMode ? "Night" : "Day"}
              </span>
            </div>
            <div className="text-[10px] opacity-60">Press [D] to toggle</div>
          </div>
        </div>

        {/* Mini Pill Indicator */}
        <div
          className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-300 flex items-center ${
            isNightMode ? "bg-indigo-600 justify-end" : "bg-amber-400 justify-start"
          }`}
        >
          <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
        </div>
      </button>
    );
  }

  // Default 'icon' variant
  return (
    <button
      type="button"
      onClick={toggleDayNightMode}
      className={`relative p-2 rounded-xl text-subtle hover:bg-subtle hover:text-ink transition-colors group focus:outline-none focus:ring-2 focus:ring-primary/40 ${className}`}
      aria-label={`Toggle Day and Night mode. Currently ${
        isNightMode ? "Night Mode" : "Day Mode"
      }`}
      title={`${isNightMode ? "Switch to Day Mode (昼モード)" : "Switch to Night Mode (夜モード)"} — Shortcut: [D]`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {isNightMode ? (
          <Moon className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300 transition-all duration-500 transform group-hover:-rotate-12 group-hover:scale-110 drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]" />
        ) : (
          <Sun className="w-4 h-4 text-amber-500 group-hover:text-amber-600 transition-all duration-500 transform group-hover:rotate-45 group-hover:scale-110 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
        )}
      </div>

      {/* Subtle indicator dot for active night mode */}
      <span
        className={`absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full transition-colors ${
          isNightMode ? "bg-indigo-400 shadow-sm shadow-indigo-400" : "bg-amber-400 shadow-sm shadow-amber-400"
        }`}
      />
    </button>
  );
}
