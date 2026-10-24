"use client";

import React, { useState, useRef } from "react";
import { HIRAGANA_CHARACTERS, KATAKANA_CHARACTERS, SIMILAR_KANA_PAIRS } from "@/data/kana";
import { KanaCharacter } from "@/types";
import { useApp } from "@/lib/providers/state-context";
import { JapaneseAudioSynthesizer } from "@/lib/audio/speech";
import { Volume2, RotateCcw, Sparkles, BookOpen, Layers, Edit3 } from "lucide-react";

export default function KanaDojoPage() {
  const { preferences, updatePreferences } = useApp();
  const [activeTab, setActiveTab] = useState<"hiragana" | "katakana">("hiragana");
  const [category, setCategory] = useState<"gojuon" | "dakuten" | "handakuten" | "yoon">("gojuon");
  const [selectedKana, setSelectedKana] = useState<KanaCharacter>(HIRAGANA_CHARACTERS[0]);
  const [practiceMode, setPracticeMode] = useState<"detail" | "canvas">("detail");

  // Drawing canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const synth = JapaneseAudioSynthesizer.getInstance();

  const characters = activeTab === "hiragana" ? HIRAGANA_CHARACTERS : KATAKANA_CHARACTERS;
  const filtered = characters.filter((c) => c.category === category);

  const playKanaAudio = (kana: KanaCharacter) => {
    synth.speak(kana.kana, preferences.audioSpeed);
  };

  const handleSelectKana = (kana: KanaCharacter) => {
    setSelectedKana(kana);
    playKanaAudio(kana);
    clearCanvas();
  };

  // Canvas drawing (unified mouse and touch)
  const getCanvasCoords = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    setIsDrawing(true);
    const { x, y } = getCanvasCoords(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#e11d48";
    const { x, y } = getCanvasCoords(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => setIsDrawing(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary-light text-primary">
            Dojo Center
          </span>
          <h1 className="text-3xl font-bold text-ink mt-2">Kana Dojo (仮名道場)</h1>
          <p className="text-sm text-subtle">
            Master the 50 sounds of Hiragana and Katakana with pronunciation, stroke orders, and writing canvas.
          </p>
        </div>

        {/* Romaji display toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => updatePreferences({ showRomaji: !preferences.showRomaji })}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
              preferences.showRomaji
                ? "bg-primary text-white border-primary"
                : "bg-surface border-border text-subtle hover:text-ink"
            }`}
          >
            Romaji: {preferences.showRomaji ? "ON" : "OFF"}
          </button>
        </div>
      </div>

      {/* Script & Category Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-surface rounded-2xl border border-border">
        {/* Hiragana vs Katakana */}
        <div className="flex rounded-xl bg-subtle p-1 border border-border">
          <button
            onClick={() => {
              setActiveTab("hiragana");
              setSelectedKana(HIRAGANA_CHARACTERS[0]);
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "hiragana"
                ? "bg-primary text-white shadow-soft"
                : "text-subtle hover:text-ink"
            }`}
          >
            ひらがな (Hiragana)
          </button>
          <button
            onClick={() => {
              setActiveTab("katakana");
              setSelectedKana(KATAKANA_CHARACTERS[0]);
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "katakana"
                ? "bg-primary text-white shadow-soft"
                : "text-subtle hover:text-ink"
            }`}
          >
            カタカナ (Katakana)
          </button>
        </div>

        {/* Category: Gojuon / Dakuten / Yoon */}
        <div className="flex gap-1.5 flex-wrap">
          {(["gojuon", "dakuten", "handakuten", "yoon"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize border transition-colors ${
                category === cat
                  ? "bg-primary/10 border-primary text-primary font-bold"
                  : "bg-card border-border text-subtle hover:bg-subtle"
              }`}
            >
              {cat === "gojuon" ? "46 Gojūon" : cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: 50-Sound Grid */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-3xl p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between text-xs text-subtle border-b border-border pb-3">
            <span>Tap any character to inspect and hear audio:</span>
            <span>{filtered.length} glyphs</span>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-6 gap-2.5">
            {filtered.map((k, i) => {
              const isSelected = selectedKana.kana === k.kana;
              return (
                <button
                  key={i}
                  onClick={() => handleSelectKana(k)}
                  className={`p-3 rounded-2xl border text-center transition-all group ${
                    isSelected
                      ? "border-primary bg-primary text-white shadow-soft scale-105"
                      : "border-border bg-card hover:bg-subtle text-ink hover:scale-105"
                  }`}
                >
                  <div className="text-2xl font-jp font-bold">{k.kana}</div>
                  {preferences.showRomaji && (
                    <div
                      className={`text-[11px] font-medium mt-0.5 ${
                        isSelected ? "text-white/80" : "text-subtle"
                      }`}
                    >
                      {k.romaji}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Character Inspector & Writing Canvas */}
        <div className="bg-surface border border-border rounded-3xl p-6 shadow-card space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-primary uppercase">
                {selectedKana.type} • {selectedKana.strokes} strokes
              </span>
              <button
                onClick={() => playKanaAudio(selectedKana)}
                className="p-2 rounded-xl bg-primary-light text-primary hover:scale-105 transition-transform"
                title="Play native audio"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* Large Glyph Display or Drawing Canvas */}
            {practiceMode === "detail" ? (
              <div className="p-8 rounded-2xl bg-subtle border border-border text-center space-y-2">
                <div className="text-7xl font-jp font-bold text-ink">{selectedKana.kana}</div>
                <div className="text-lg font-bold text-primary">{selectedKana.romaji}</div>
              </div>
            ) : (
              <div className="space-y-2 text-center">
                <div className="relative">
                  <canvas
                    ref={canvasRef}
                    width={220}
                    height={220}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    aria-label="Kana stroke order practice canvas"
                    className="mx-auto border-2 border-dashed border-border rounded-2xl bg-white cursor-crosshair touch-none"
                  />
                  {/* Subtle watermarked reference glyph behind canvas */}
                  <div className="absolute inset-0 flex items-center justify-center text-7xl font-jp font-bold text-black/5 pointer-events-none">
                    {selectedKana.kana}
                  </div>
                </div>
                <button
                  onClick={clearCanvas}
                  className="text-xs text-subtle hover:text-ink font-semibold flex items-center justify-center gap-1 mx-auto pt-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear Canvas</span>
                </button>
              </div>
            )}

            {/* Toggle Mode */}
            <div className="flex rounded-xl bg-subtle p-1 border border-border text-xs">
              <button
                onClick={() => setPracticeMode("detail")}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                  practiceMode === "detail"
                    ? "bg-primary text-white shadow-soft"
                    : "text-subtle hover:text-ink"
                }`}
              >
                Glyph Info
              </button>
              <button
                onClick={() => setPracticeMode("canvas")}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                  practiceMode === "canvas"
                    ? "bg-primary text-white shadow-soft"
                    : "text-subtle hover:text-ink"
                }`}
              >
                Drawing Canvas
              </button>
            </div>

            {/* Mnemonic Note */}
            <div className="p-3.5 rounded-2xl bg-card border border-border space-y-1">
              <div className="text-xs font-bold text-ink flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>Memory Mnemonic:</span>
              </div>
              <p className="text-xs text-subtle leading-relaxed">{selectedKana.mnemonic}</p>
            </div>
          </div>

          <button
            onClick={() => playKanaAudio(selectedKana)}
            className="w-full py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-2xl shadow-soft text-xs flex items-center justify-center gap-2"
          >
            <Volume2 className="w-4 h-4" />
            <span>Hear Pronunciation</span>
          </button>
        </div>
      </div>

      {/* Similar Kana Discrimination Section */}
      <div className="p-6 rounded-3xl bg-surface border border-border shadow-card space-y-4">
        <h2 className="font-bold text-base text-ink flex items-center gap-2">
          <Layers className="w-5 h-5 text-primary" />
          <span>Similar Character Discrimination Guide</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SIMILAR_KANA_PAIRS.map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-subtle border border-border space-y-1.5">
              <div className="text-lg font-jp font-bold text-primary flex gap-2">
                {item.pair.map((char, cIdx) => (
                  <span key={cIdx} className="px-2 py-0.5 rounded-lg bg-card border border-border">
                    {char}
                  </span>
                ))}
              </div>
              <p className="text-xs text-subtle leading-relaxed">{item.explanation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
