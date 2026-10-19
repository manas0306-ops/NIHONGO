"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/providers/state-context";
import { SRSItem } from "@/types";
import { createSRSItem } from "@/lib/spaced-repetition/sm2";
import { JapaneseAudioSynthesizer } from "@/lib/audio/speech";
import {
  Repeat,
  Sparkles,
  Volume2,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  ArrowRight,
} from "lucide-react";

export default function ReviewCenterPage() {
  const { srsItems, recordSRSReview, preferences } = useApp();
  const [activeTab, setActiveTab] = useState<"due" | "all" | "mastered">("due");
  const [activeSession, setActiveSession] = useState<boolean>(false);
  const [sessionIndex, setSessionIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  const synth = JapaneseAudioSynthesizer.getInstance();

  const nowIso = new Date().toISOString();
  const dueItems = srsItems.filter((i) => i.dueDate <= nowIso);
  const masteredItems = srsItems.filter((i) => i.masteryLevel === "mastered");

  const displayItems =
    activeTab === "due" ? dueItems : activeTab === "mastered" ? masteredItems : srsItems;

  const currentItem: SRSItem | undefined = dueItems[sessionIndex];

  // Helper to initialize sample cards if empty
  const handleSeedSamples = () => {
    const samples: SRSItem[] = [
      createSRSItem("kana", "a", "あ", "a", "Sound 'a'"),
      createSRSItem("kana", "i", "い", "i", "Sound 'i'"),
      createSRSItem("vocabulary", "neko", "猫", "ねこ (neko)", "Cat"),
      createSRSItem("vocabulary", "inu", "犬", "いぬ (inu)", "Dog"),
      createSRSItem("kanji", "nichi", "日", "ニチ / ひ", "Day, Sun"),
      createSRSItem("kanji", "hon", "本", "ホン / もと", "Book, Origin"),
    ];
    samples.forEach((item) => {
      recordSRSReview(item.id, 3);
    });
  };

  const handleGrade = (grade: number) => {
    if (!currentItem) return;
    recordSRSReview(currentItem.id, grade);
    setIsFlipped(false);
    if (sessionIndex + 1 < dueItems.length) {
      setSessionIndex((prev) => prev + 1);
    } else {
      setActiveSession(false);
      setSessionIndex(0);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary-light text-primary">
            Spaced Repetition System
          </span>
          <h1 className="text-3xl font-bold text-ink mt-2">Review Center (復習センター)</h1>
          <p className="text-sm text-subtle">
            SuperMemo SM-2 algorithmic scheduling. Reviews spaced right before memory decay occurs.
          </p>
        </div>

        {dueItems.length > 0 && !activeSession && (
          <button
            onClick={() => {
              setActiveSession(true);
              setSessionIndex(0);
              setIsFlipped(false);
            }}
            className="px-6 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-2xl shadow-soft text-sm flex items-center gap-2 hover:scale-105 transition-all"
          >
            <Repeat className="w-4 h-4" />
            <span>Start Review Session ({dueItems.length} Due)</span>
          </button>
        )}
      </div>

      {/* ACTIVE SRS FLASHCARD REVIEW SESSION */}
      {activeSession && currentItem ? (
        <div className="max-w-md mx-auto space-y-6">
          <div className="flex items-center justify-between text-xs text-subtle">
            <span>
              Card {sessionIndex + 1} of {dueItems.length}
            </span>
            <button
              onClick={() => setActiveSession(false)}
              className="font-semibold hover:text-ink"
            >
              Exit Session
            </button>
          </div>

          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="p-10 rounded-3xl bg-surface border-2 border-border shadow-card min-h-[320px] flex flex-col items-center justify-center text-center space-y-4 cursor-pointer hover:border-primary/50 transition-all select-none"
          >
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-subtle text-subtle">
              {currentItem.type} • Reps: {currentItem.repetitions}
            </span>

            <div className="text-6xl font-jp font-bold text-ink">{currentItem.japanese}</div>

            {isFlipped ? (
              <div className="space-y-2 animate-fadeIn">
                <div className="text-lg font-bold text-primary font-jp">{currentItem.reading}</div>
                <div className="text-sm font-semibold text-ink">{currentItem.meaning}</div>
                <div className="text-xs text-subtle pt-2">
                  Interval: {currentItem.intervalDays} days | Ease: {currentItem.easeFactor}
                </div>
              </div>
            ) : (
              <span className="text-xs text-muted">Tap to flip card</span>
            )}
          </div>

          {/* SM-2 Grade Buttons */}
          {isFlipped ? (
            <div className="space-y-2">
              <span className="text-xs text-subtle block text-center">Rate your recall difficulty:</span>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => handleGrade(1)}
                  className="py-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 font-bold text-xs"
                >
                  Forgot (1)
                </button>
                <button
                  onClick={() => handleGrade(3)}
                  className="py-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold text-xs"
                >
                  Hard (3)
                </button>
                <button
                  onClick={() => handleGrade(4)}
                  className="py-2.5 rounded-xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 dark:text-blue-300 font-bold text-xs"
                >
                  Good (4)
                </button>
                <button
                  onClick={() => handleGrade(5)}
                  className="py-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold text-xs"
                >
                  Easy (5)
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsFlipped(true)}
              className="w-full py-3.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-2xl shadow-soft text-sm"
            >
              Show Answer
            </button>
          )}
        </div>
      ) : (
        /* Review Queue Overview */
        <div className="space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-surface border border-border shadow-card">
              <div className="text-xs text-subtle">Due Today</div>
              <div className="text-3xl font-bold text-primary mt-1">{dueItems.length}</div>
            </div>
            <div className="p-5 rounded-3xl bg-surface border border-border shadow-card">
              <div className="text-xs text-subtle">Total Tracked Items</div>
              <div className="text-3xl font-bold text-ink mt-1">{srsItems.length}</div>
            </div>
            <div className="p-5 rounded-3xl bg-surface border border-border shadow-card">
              <div className="text-xs text-subtle">Mastered (&gt;21 day interval)</div>
              <div className="text-3xl font-bold text-emerald-600 mt-1">{masteredItems.length}</div>
            </div>
          </div>

          {/* Tab Filter */}
          <div className="flex gap-2 border-b border-border pb-3">
            <button
              onClick={() => setActiveTab("due")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "due"
                  ? "bg-primary text-white shadow-soft"
                  : "text-subtle hover:text-ink"
              }`}
            >
              Due Today ({dueItems.length})
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "all"
                  ? "bg-primary text-white shadow-soft"
                  : "text-subtle hover:text-ink"
              }`}
            >
              All Items ({srsItems.length})
            </button>
            <button
              onClick={() => setActiveTab("mastered")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "mastered"
                  ? "bg-primary text-white shadow-soft"
                  : "text-subtle hover:text-ink"
              }`}
            >
              Mastered ({masteredItems.length})
            </button>
          </div>

          {/* Cards List */}
          {displayItems.length === 0 ? (
            <div className="p-12 rounded-3xl bg-surface border border-border text-center space-y-4 shadow-card">
              <div className="text-5xl">🧘</div>
              <h3 className="font-bold text-lg text-ink">No Reviews Due Right Now!</h3>
              <p className="text-xs text-subtle max-w-sm mx-auto">
                All scheduled items have been reviewed according to SM-2 intervals. Complete more lessons or seed starter review cards below.
              </p>
              {srsItems.length === 0 && (
                <button
                  onClick={handleSeedSamples}
                  className="px-5 py-2.5 bg-primary text-white font-bold rounded-xl text-xs shadow-soft"
                >
                  Load Starter SRS Cards
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {displayItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-surface border border-border shadow-card space-y-2 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase text-subtle">
                      <span>{item.type}</span>
                      <span className="capitalize">{item.masteryLevel}</span>
                    </div>
                    <div className="text-2xl font-jp font-bold text-ink mt-1">{item.japanese}</div>
                    <div className="text-xs text-primary font-jp">{item.reading}</div>
                    <div className="text-xs text-subtle">{item.meaning}</div>
                  </div>
                  <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-muted">
                    <span>Interval: {item.intervalDays}d</span>
                    <span>Ease: {item.easeFactor}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
