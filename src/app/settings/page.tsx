"use client";

import React from "react";
import { useApp } from "@/lib/providers/state-context";
import { ThemeId, ColorMode } from "@/types";
import { Palette, Volume2, Type, Moon, Sun, Check, Sparkles, Monitor, Keyboard } from "lucide-react";
import { DayNightToggle } from "@/components/navigation/day-night-toggle";

export default function SettingsPage() {
  const { preferences, updatePreferences } = useApp();

  const themes: {
    id: ThemeId;
    name: string;
    jpName: string;
    desc: string;
    preview: { primary: string; bg: string; accent: string };
  }[] = [
    {
      id: "sakura",
      name: "Sakura Garden",
      jpName: "桜の庭",
      desc: "Delicate blossom pink with soft stationery cream.",
      preview: { primary: "#f43f5e", bg: "#fdf8f7", accent: "#f97316" },
    },
    {
      id: "matcha",
      name: "Matcha Garden",
      jpName: "抹茶の庭",
      desc: "Earthy bamboo green and organic herbal hues.",
      preview: { primary: "#15803d", bg: "#f7f9f6", accent: "#84cc16" },
    },
    {
      id: "midnight",
      name: "Midnight Tokyo",
      jpName: "東京の夜",
      desc: "Deep navy indigo with vibrant neon cyber accents.",
      preview: { primary: "#06b6d4", bg: "#0a0f1d", accent: "#ec4899" },
    },
    {
      id: "zen",
      name: "Minimal Zen",
      jpName: "侘び寂び",
      desc: "Neutral warm stone, restrained ink, and calm paper tones.",
      preview: { primary: "#44403c", bg: "#faf9f6", accent: "#a8a29e" },
    },
    {
      id: "ocean",
      name: "Ocean Hokusai",
      jpName: "北斎の波",
      desc: "Crisp cerulean wave blue with sea-foam cream.",
      preview: { primary: "#0284c7", bg: "#f3f8fc", accent: "#f59e0b" },
    },
    {
      id: "autumn",
      name: "Autumn Kyoto",
      jpName: "京都の秋",
      desc: "Rich momiji red, roasted chestnut, and warm maple.",
      preview: { primary: "#ea580c", bg: "#fdfaf6", accent: "#b45309" },
    },
    {
      id: "lantern",
      name: "Paper Lantern",
      jpName: "提灯の灯",
      desc: "Glowing evening amber and warm festive lanterns.",
      preview: { primary: "#d97706", bg: "#fffaf0", accent: "#dc2626" },
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-10">
      {/* Header */}
      <div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary-light text-primary">
          Customization
        </span>
        <h1 className="text-3xl font-bold text-ink mt-2">Preferences & Appearance (設定)</h1>
        <p className="text-sm text-subtle">
          Personalize your Japanese stationery themes, audio pronunciation speeds, and reading guides.
        </p>
      </div>

      {/* 1. Theme Palette Selector (7 Japanese Themes) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-card space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2 font-bold text-base text-ink">
            <Palette className="w-5 h-5 text-primary" />
            <span>Japanese Theme Collection</span>
          </div>
          <span className="text-xs font-bold text-primary capitalize">{preferences.theme} Active</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {themes.map((t) => {
            const isSelected = preferences.theme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => updatePreferences({ theme: t.id })}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? "border-primary bg-primary-light/40 shadow-soft ring-2 ring-primary/20"
                    : "border-border bg-card hover:bg-subtle"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-ink">{t.name}</span>
                    <span className="text-xs font-jp text-subtle">{t.jpName}</span>
                  </div>
                  <p className="text-xs text-subtle leading-relaxed mb-3">{t.desc}</p>
                </div>

                {/* Color swatches */}
                <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                  <div
                    className="w-5 h-5 rounded-full border border-black/10 shadow-sm"
                    style={{ backgroundColor: t.preview.primary }}
                  />
                  <div
                    className="w-5 h-5 rounded-full border border-black/10 shadow-sm"
                    style={{ backgroundColor: t.preview.accent }}
                  />
                  <div
                    className="w-5 h-5 rounded-full border border-black/10 shadow-sm"
                    style={{ backgroundColor: t.preview.bg }}
                  />
                  {isSelected && (
                    <span className="ml-auto text-xs font-bold text-primary flex items-center gap-0.5">
                      <Check className="w-3.5 h-3.5" /> Selected
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Day & Night Mode (昼夜モード切替) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-4">
          <div>
            <h2 className="font-bold text-base text-ink flex items-center gap-2">
              <Sun className="w-5 h-5 text-amber-500" />
              <span>Day & Night Mode (昼・夜モード)</span>
            </h2>
            <p className="text-xs text-subtle mt-0.5">
              Comfort-crafted Japanese color profiles for bright daylight reading or midnight study.
            </p>
          </div>
          <DayNightToggle variant="segmented" showLabel />
        </div>

        {/* 3 Mode Option Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Light / Day */}
          <button
            type="button"
            onClick={() => updatePreferences({ colorMode: "light" })}
            className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
              preferences.colorMode === "light"
                ? "border-amber-400 bg-amber-50/50 dark:bg-amber-950/20 shadow-soft ring-2 ring-amber-400/20"
                : "border-border bg-card hover:bg-subtle"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 font-bold text-sm text-ink">
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>昼モード (Day)</span>
                </div>
                {preferences.colorMode === "light" && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-subtle leading-relaxed">
                Warm cream and washi stationery palettes. Optimized for daylight clarity and high legibility.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-border/40 text-[11px] font-medium text-amber-700 dark:text-amber-400">
              ☀️ Sunlit Stationery
            </div>
          </button>

          {/* Dark / Night */}
          <button
            type="button"
            onClick={() => updatePreferences({ colorMode: "dark" })}
            className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
              preferences.colorMode === "dark"
                ? "border-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30 shadow-soft ring-2 ring-indigo-400/20"
                : "border-border bg-card hover:bg-subtle"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 font-bold text-sm text-ink">
                  <Moon className="w-4 h-4 text-indigo-400" />
                  <span>夜モード (Night)</span>
                </div>
                {preferences.colorMode === "dark" && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-subtle leading-relaxed">
                Deep sumi-ink and OLED backdrops with gentle contrast. Restful for nighttime reviews.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-border/40 text-[11px] font-medium text-indigo-600 dark:text-indigo-400">
              🌙 Midnight Tokyo & Sumi Ink
            </div>
          </button>

          {/* System */}
          <button
            type="button"
            onClick={() => updatePreferences({ colorMode: "system" })}
            className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
              preferences.colorMode === "system"
                ? "border-primary bg-primary-light/40 shadow-soft ring-2 ring-primary/20"
                : "border-border bg-card hover:bg-subtle"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 font-bold text-sm text-ink">
                  <Monitor className="w-4 h-4 text-primary" />
                  <span>自動 (System)</span>
                </div>
                {preferences.colorMode === "system" && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary-light text-primary">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-subtle leading-relaxed">
                Synchronizes automatically with your device OS or browser ambient schedule.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-border/40 text-[11px] font-medium text-primary">
              ⚡ OS Auto Sync
            </div>
          </button>
        </div>

        {/* Shortcut Banner */}
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-subtle border border-border text-xs text-subtle">
          <div className="w-7 h-7 rounded-xl bg-card border border-border flex items-center justify-center text-ink font-bold shadow-xs">
            <Keyboard className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1">
            <span className="font-semibold text-ink">Pro Shortcut: </span>
            <span>
              Press the <kbd className="px-1.5 py-0.5 text-[10px] font-bold font-mono bg-card border border-border rounded shadow-xs text-ink">D</kbd> key anywhere on the platform to instantaneously toggle between Day and Night mode with silky transitions.
            </span>
          </div>
        </div>
      </div>

      {/* 3. Audio & Reading Assistance Toggles */}
      <div className="p-6 rounded-3xl bg-surface border border-border shadow-card space-y-4">
        <h2 className="font-bold text-base text-ink flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-primary" />
          <span>Audio & Reading Assistance</span>
        </h2>

        <div className="space-y-3">
          {/* Furigana Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-card border border-border">
            <div>
              <div className="font-bold text-sm text-ink">Show Furigana (振り仮名)</div>
              <div className="text-xs text-subtle">
                Displays small kana reading guides above Kanji characters.
              </div>
            </div>
            <button
              onClick={() => updatePreferences({ showFurigana: !preferences.showFurigana })}
              className={`w-12 h-6 rounded-full transition-colors p-1 ${
                preferences.showFurigana ? "bg-primary" : "bg-border"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  preferences.showFurigana ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Romaji Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-card border border-border">
            <div>
              <div className="font-bold text-sm text-ink">Show Romaji Assistance</div>
              <div className="text-xs text-subtle">
                Display Latin alphabet transliterations under kana and kanji words.
              </div>
            </div>
            <button
              onClick={() => updatePreferences({ showRomaji: !preferences.showRomaji })}
              className={`w-12 h-6 rounded-full transition-colors p-1 ${
                preferences.showRomaji ? "bg-primary" : "bg-border"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  preferences.showRomaji ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Sound Effects Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-card border border-border">
            <div>
              <div className="font-bold text-sm text-ink">Sound Effects & Pronunciation</div>
              <div className="text-xs text-subtle">
                Automatically plays Japanese voice synthesis on kana, kanji, and exercises.
              </div>
            </div>
            <button
              onClick={() => updatePreferences({ soundEffects: !preferences.soundEffects })}
              className={`w-12 h-6 rounded-full transition-colors p-1 ${
                preferences.soundEffects ? "bg-primary" : "bg-border"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  preferences.soundEffects ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Audio Speed Selector */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-card border border-border">
            <div>
              <div className="font-bold text-sm text-ink">Speech Playback Rate</div>
              <div className="text-xs text-subtle">Adjust Japanese voice synthesis speed.</div>
            </div>
            <div className="flex gap-1.5">
              {[0.75, 1.0, 1.25].map((speed) => (
                <button
                  key={speed}
                  onClick={() => updatePreferences({ audioSpeed: speed })}
                  className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all ${
                    preferences.audioSpeed === speed
                      ? "bg-primary text-white border-primary shadow-soft"
                      : "bg-subtle border-border text-subtle hover:text-ink"
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
