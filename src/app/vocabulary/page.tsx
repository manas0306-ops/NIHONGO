"use client";

import React, { useState } from "react";
import { VOCABULARY_DATABASE, VocabularyItem } from "@/data/vocabulary";
import { useApp } from "@/lib/providers/state-context";
import { JapaneseAudioSynthesizer } from "@/lib/audio/speech";
import { Search, Volume2, Bookmark, Filter, BookOpen } from "lucide-react";

export default function VocabularyPage() {
  const { preferences, updatePreferences } = useApp();
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<VocabularyItem>(VOCABULARY_DATABASE[0]);

  const synth = JapaneseAudioSynthesizer.getInstance();

  const allTags = ["all", "greetings", "food", "verbs", "adjectives", "people", "daily"];

  const filtered = VOCABULARY_DATABASE.filter((item) => {
    const matchesSearch =
      item.japanese.includes(search) ||
      item.reading.includes(search) ||
      item.meaning.toLowerCase().includes(search.toLowerCase()) ||
      item.romaji.toLowerCase().includes(search.toLowerCase());

    const matchesTag = selectedTag === "all" || item.tags.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  const playAudio = (text: string) => {
    synth.speak(text, preferences.audioSpeed);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary-light text-primary">
            Lexicon & Dictionary
          </span>
          <h1 className="text-3xl font-bold text-ink mt-2">Vocabulary Library (単語帳)</h1>
          <p className="text-sm text-subtle">
            Essential words with audio pronunciation, example sentences, and furigana toggles.
          </p>
        </div>

        {/* Furigana Toggle */}
        <button
          onClick={() => updatePreferences({ showFurigana: !preferences.showFurigana })}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors ${
            preferences.showFurigana
              ? "bg-primary text-white border-primary"
              : "bg-surface border-border text-subtle hover:text-ink"
          }`}
        >
          Furigana: {preferences.showFurigana ? "ON" : "OFF"}
        </button>
      </div>

      {/* Search & Tag Filter Pills */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search words by Japanese, English meaning, romaji..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-border bg-card text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-soft"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize border transition-all ${
                selectedTag === tag
                  ? "bg-primary text-white border-primary shadow-soft"
                  : "bg-card border-border text-subtle hover:bg-subtle"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Vocabulary List & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Vocabulary List */}
        <div className="lg:col-span-2 space-y-3">
          <div className="text-xs text-subtle px-1">Showing {filtered.length} entries</div>
          <div className="space-y-2.5">
            {filtered.map((item) => {
              const isSelected = selectedItem.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedItem(item);
                    playAudio(item.japanese);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                    isSelected
                      ? "border-primary bg-primary-light/40 shadow-soft"
                      : "border-border bg-surface hover:bg-subtle"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-jp font-bold text-ink">{item.japanese}</span>
                      <span className="text-xs text-subtle font-jp">{item.reading}</span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-subtle text-subtle border border-border">
                        {item.partOfSpeech.replace("_", " ")}
                      </span>
                    </div>
                    <div className="text-xs text-subtle font-medium">{item.meaning}</div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playAudio(item.japanese);
                    }}
                    className="p-2 rounded-xl text-subtle hover:text-primary hover:bg-primary-light transition-colors"
                    aria-label="Play audio"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Card */}
        <div className="bg-surface border border-border rounded-3xl p-6 shadow-card space-y-5 h-fit sticky top-20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary-light text-primary">
              JLPT {selectedItem.jlpt}
            </span>
            <button
              onClick={() => playAudio(selectedItem.japanese)}
              className="p-2 rounded-xl bg-primary-light text-primary hover:scale-105 transition-transform"
              title="Play Audio"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-subtle border border-border text-center space-y-1">
            <div className="text-4xl font-jp font-bold text-ink">{selectedItem.japanese}</div>
            <div className="text-sm font-semibold text-primary">{selectedItem.reading}</div>
            <div className="text-xs text-subtle font-mono">{selectedItem.romaji}</div>
            <div className="text-base font-bold text-ink pt-2">{selectedItem.meaning}</div>
          </div>

          {/* Example Sentence with Furigana */}
          <div className="space-y-2 pt-2 border-t border-border">
            <span className="text-xs font-bold text-ink block">Example Context:</span>
            <div className="p-3.5 rounded-2xl bg-card border border-border space-y-1.5">
              <div className="font-jp text-sm text-ink leading-relaxed">
                {selectedItem.example.japanese}
              </div>
              <div className="text-xs text-subtle">{selectedItem.example.english}</div>
            </div>
            <button
              onClick={() => playAudio(selectedItem.example.japanese)}
              className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline pt-1"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Hear Sentence Audio</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
