"use client";

import React, { useState } from "react";
import { KANJI_DATABASE } from "@/data/kanji";
import { KanjiItem } from "@/types";
import { useApp } from "@/lib/providers/state-context";
import { JapaneseAudioSynthesizer } from "@/lib/audio/speech";
import { Search, Volume2, Sparkles, BookOpen, Layers, CheckCircle2 } from "lucide-react";

export default function KanjiLabPage() {
  const { preferences } = useApp();
  const [search, setSearch] = useState("");
  const [selectedKanji, setSelectedKanji] = useState<KanjiItem>(KANJI_DATABASE[0]);
  const [viewMode, setViewMode] = useState<"explorer" | "flashcard">("explorer");
  const [showAnswer, setShowAnswer] = useState(false);

  const synth = JapaneseAudioSynthesizer.getInstance();

  const filtered = KANJI_DATABASE.filter(
    (k) =>
      k.character.includes(search) ||
      k.meaning.toLowerCase().includes(search.toLowerCase()) ||
      k.onyomi.some((o) => o.includes(search)) ||
      k.kunyomi.some((u) => u.includes(search))
  );

  const playAudio = (text: string) => {
    synth.speak(text, preferences.audioSpeed);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary-light text-primary">
            Kanji Research
          </span>
          <h1 className="text-3xl font-bold text-ink mt-2">Kanji Lab (漢字ラボ)</h1>
          <p className="text-sm text-subtle">
            Explore JLPT kanji with On'yomi, Kun'yomi, radical breakdowns, mnemonics, and example words.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex rounded-xl bg-subtle p-1 border border-border">
          <button
            onClick={() => {
              setViewMode("explorer");
              setShowAnswer(false);
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === "explorer"
                ? "bg-primary text-white shadow-soft"
                : "text-subtle hover:text-ink"
            }`}
          >
            Explorer
          </button>
          <button
            onClick={() => {
              setViewMode("flashcard");
              setShowAnswer(false);
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === "flashcard"
                ? "bg-primary text-white shadow-soft"
                : "text-subtle hover:text-ink"
            }`}
          >
            Flashcards
          </button>
        </div>
      </div>

      {viewMode === "explorer" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Kanji Search & Grid */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by Kanji, English meaning, reading..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-border bg-card text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-soft"
              />
            </div>

            <div className="bg-surface border border-border rounded-3xl p-6 shadow-card space-y-4">
              <div className="flex items-center justify-between text-xs text-subtle border-b border-border pb-3">
                <span>Select a character to inspect details:</span>
                <span>{filtered.length} found</span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {filtered.map((k) => {
                  const isSelected = selectedKanji.character === k.character;
                  return (
                    <button
                      key={k.character}
                      onClick={() => {
                        setSelectedKanji(k);
                        playAudio(k.character);
                      }}
                      className={`p-4 rounded-2xl border text-center transition-all group ${
                        isSelected
                          ? "border-primary bg-primary text-white shadow-soft scale-105"
                          : "border-border bg-card hover:bg-subtle text-ink hover:scale-105"
                      }`}
                    >
                      <div className="text-3xl font-jp font-bold">{k.character}</div>
                      <div
                        className={`text-[10px] font-medium truncate mt-1 ${
                          isSelected ? "text-white/80" : "text-subtle"
                        }`}
                      >
                        {k.meaning}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Kanji Detail Panel */}
          <div className="bg-surface border border-border rounded-3xl p-6 shadow-card space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary-light text-primary">
                JLPT {selectedKanji.jlpt} • Grade {selectedKanji.grade}
              </span>
              <button
                onClick={() => playAudio(selectedKanji.character)}
                className="p-2 rounded-xl bg-primary-light text-primary hover:scale-105 transition-transform"
                title="Play Audio"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* Character Spotlight */}
            <div className="p-6 rounded-2xl bg-subtle border border-border text-center space-y-1">
              <div className="text-7xl font-jp font-extrabold text-ink">
                {selectedKanji.character}
              </div>
              <div className="text-base font-bold text-primary">{selectedKanji.meaning}</div>
              <div className="text-xs text-subtle">
                {selectedKanji.strokes} strokes • Radical: {selectedKanji.radical}
              </div>
            </div>

            {/* Readings */}
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-card border border-border">
                <span className="font-bold text-primary block mb-1">音読み (On'yomi - Chinese reading):</span>
                <span className="font-jp text-ink font-semibold">{selectedKanji.onyomi.join(", ")}</span>
              </div>
              <div className="p-3 rounded-xl bg-card border border-border">
                <span className="font-bold text-emerald-600 block mb-1">訓読み (Kun'yomi - Japanese reading):</span>
                <span className="font-jp text-ink font-semibold">{selectedKanji.kunyomi.join(", ")}</span>
              </div>
            </div>

            {/* Mnemonic */}
            <div className="p-3.5 rounded-2xl bg-card border border-border space-y-1 text-xs">
              <div className="font-bold text-ink flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>Mnemonic Story:</span>
              </div>
              <p className="text-subtle leading-relaxed">{selectedKanji.mnemonic}</p>
            </div>

            {/* Example Words */}
            <div className="space-y-2 pt-2 border-t border-border">
              <div className="font-bold text-xs text-ink">Common Compound Words:</div>
              <div className="space-y-1.5">
                {selectedKanji.examples.map((ex, exIdx) => (
                  <button
                    key={exIdx}
                    onClick={() => playAudio(ex.japanese)}
                    className="w-full text-left p-2 rounded-xl bg-subtle hover:bg-border border border-border transition-colors flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-jp font-bold text-ink mr-2">{ex.japanese}</span>
                      <span className="text-subtle">{ex.reading}</span>
                    </div>
                    <span className="text-primary font-medium">{ex.english}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Flashcard Mode */
        <div className="max-w-md mx-auto text-center space-y-6">
          <div
            onClick={() => setShowAnswer(!showAnswer)}
            className="p-12 rounded-3xl bg-surface border-2 border-border shadow-card hover:border-primary/50 cursor-pointer min-h-[300px] flex flex-col items-center justify-center space-y-4 transition-all"
          >
            <div className="text-8xl font-jp font-extrabold text-ink">
              {selectedKanji.character}
            </div>
            {showAnswer ? (
              <div className="space-y-2 animate-fadeIn">
                <div className="text-xl font-bold text-primary">{selectedKanji.meaning}</div>
                <div className="text-xs text-subtle">
                  On: {selectedKanji.onyomi.join(", ")} | Kun: {selectedKanji.kunyomi.join(", ")}
                </div>
              </div>
            ) : (
              <span className="text-xs text-muted">Tap card to flip</span>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                const nextIdx = (KANJI_DATABASE.indexOf(selectedKanji) + 1) % KANJI_DATABASE.length;
                setSelectedKanji(KANJI_DATABASE[nextIdx]);
                setShowAnswer(false);
              }}
              className="flex-1 py-3.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-2xl shadow-soft text-sm transition-all"
            >
              Next Kanji →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
