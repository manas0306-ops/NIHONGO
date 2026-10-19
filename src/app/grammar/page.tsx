"use client";

import React, { useState } from "react";
import { GRAMMAR_DATABASE } from "@/data/grammar";
import { GrammarEntry } from "@/types";
import { useApp } from "@/lib/providers/state-context";
import { JapaneseAudioSynthesizer } from "@/lib/audio/speech";
import { Search, Volume2, BookOpen, AlertCircle, FileText, CheckCircle2 } from "lucide-react";

export default function GrammarStudioPage() {
  const { preferences } = useApp();
  const [search, setSearch] = useState("");
  const [selectedGrammar, setSelectedGrammar] = useState<GrammarEntry>(GRAMMAR_DATABASE[0]);

  const synth = JapaneseAudioSynthesizer.getInstance();

  const filtered = GRAMMAR_DATABASE.filter(
    (g) =>
      g.pattern.includes(search) ||
      g.title.toLowerCase().includes(search.toLowerCase()) ||
      g.meaning.toLowerCase().includes(search.toLowerCase())
  );

  const playAudio = (text: string) => {
    synth.speak(text, preferences.audioSpeed);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary-light text-primary">
          Syntax & Rules
        </span>
        <h1 className="text-3xl font-bold text-ink mt-2">Grammar Studio (文法スタジオ)</h1>
        <p className="text-sm text-subtle">
          Structured grammar patterns with formation formulas, politeness registers, and common mistake warnings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Grammar Patterns List */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search grammar patterns..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-border bg-card text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-soft"
            />
          </div>

          <div className="space-y-2.5">
            {filtered.map((g) => {
              const isSelected = selectedGrammar.id === g.id;
              return (
                <div
                  key={g.id}
                  onClick={() => setSelectedGrammar(g)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? "border-primary bg-primary-light/40 shadow-soft"
                      : "border-border bg-surface hover:bg-subtle"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-primary font-jp">{g.pattern}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-subtle text-subtle">
                      JLPT {g.level}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-ink">{g.title}</h3>
                  <p className="text-xs text-subtle mt-1">{g.meaning}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Grammar Deep-Dive */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary-light text-primary">
                JLPT {selectedGrammar.level}
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-subtle text-subtle uppercase">
                {selectedGrammar.register} register
              </span>
            </div>
            <button
              onClick={() => playAudio(selectedGrammar.examples[0]?.audioText || selectedGrammar.pattern)}
              className="p-2 rounded-xl bg-primary-light text-primary hover:scale-105 transition-transform"
              title="Play Example Audio"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-ink">{selectedGrammar.title}</h2>
            <div className="text-base font-jp font-bold text-primary mt-1">{selectedGrammar.pattern}</div>
            <p className="text-sm font-semibold text-ink mt-2">{selectedGrammar.meaning}</p>
          </div>

          {/* Formation Formula */}
          <div className="p-4 rounded-2xl bg-subtle border border-border space-y-1">
            <div className="text-xs font-bold text-primary flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              <span>Formation Rule:</span>
            </div>
            <div className="font-mono text-xs font-bold text-ink bg-card p-2.5 rounded-xl border border-border">
              {selectedGrammar.formation}
            </div>
          </div>

          {/* Detailed Explanation */}
          <div className="space-y-1.5 text-xs text-subtle leading-relaxed">
            <span className="font-bold text-ink block">Usage Notes:</span>
            <p>{selectedGrammar.explanation}</p>
          </div>

          {/* Common Mistakes Warning */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 text-xs space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Common Pitfalls to Avoid:</span>
            </div>
            <p>{selectedGrammar.commonMistakes}</p>
          </div>

          {/* Examples Sentences */}
          <div className="space-y-3 pt-3 border-t border-border">
            <span className="font-bold text-xs text-ink block">Example Sentences:</span>
            <div className="space-y-2.5">
              {selectedGrammar.examples.map((ex, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-2xl bg-card border border-border flex items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="font-jp font-bold text-sm text-ink">{ex.japanese}</div>
                    <div className="text-xs text-subtle font-medium">{ex.english}</div>
                    <div className="text-[11px] text-muted font-mono">{ex.romaji}</div>
                  </div>
                  <button
                    onClick={() => playAudio(ex.audioText || ex.japanese)}
                    className="p-2 rounded-xl text-subtle hover:text-primary hover:bg-subtle transition-colors flex-shrink-0"
                    aria-label="Play audio"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
