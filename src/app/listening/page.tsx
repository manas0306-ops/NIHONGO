"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/providers/state-context";
import { JapaneseAudioSynthesizer } from "@/lib/audio/speech";
import { Volume2, Play, CheckCircle2, XCircle, RotateCcw, Sparkles } from "lucide-react";

interface ListeningDrill {
  id: string;
  audioText: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const LISTENING_DRILLS: ListeningDrill[] = [
  {
    id: "l_1",
    audioText: "明日は東京へ行きます。",
    question: "Where is the speaker going tomorrow?",
    options: ["Tokyo (東京)", "Kyoto (京都)", "Osaka (大阪)", "School (学校)"],
    correctAnswer: 0,
    explanation: "The speaker said: '明日は東京へ行きます' (Tomorrow I go to Tokyo).",
  },
  {
    id: "l_2",
    audioText: "冷たい水を一杯ください。",
    question: "What beverage did the speaker ask for?",
    options: ["Hot green tea", "Cold water (冷たい水)", "Black coffee", "Cold milk"],
    correctAnswer: 1,
    explanation: "The speaker requested: '冷たい水を一杯ください' (One glass of cold water, please).",
  },
  {
    id: "l_3",
    audioText: "今、何時ですか。七時半です。",
    question: "What time was reported?",
    options: ["6:30", "7:00", "7:30 (七時半)", "8:30"],
    correctAnswer: 2,
    explanation: "七時半 (shichiji-han) translates to 7:30.",
  },
];

export default function ListeningPage() {
  const { preferences, updatePreferences } = useApp();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(preferences.audioSpeed);

  const synth = JapaneseAudioSynthesizer.getInstance();
  const drill = LISTENING_DRILLS[currentIdx];

  const playDrillAudio = () => {
    synth.speak(drill.audioText, playbackSpeed);
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
    setIsAnswered(true);
  };

  const handleNext = () => {
    setSelectedOpt(null);
    setIsAnswered(false);
    setCurrentIdx((prev) => (prev + 1) % LISTENING_DRILLS.length);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary-light text-primary">
          Auditory Skills
        </span>
        <h1 className="text-3xl font-bold text-ink mt-2">Listening Studio (聴解トレーニング)</h1>
        <p className="text-sm text-subtle">
          Train your ears with native Japanese speech synthesis, variable speed controls, and comprehension quizzes.
        </p>
      </div>

      {/* Speed Controls */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-surface border border-border shadow-card">
        <div className="text-xs font-bold text-ink flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-primary" />
          <span>Speech Speed:</span>
        </div>
        <div className="flex gap-2">
          {[0.75, 1.0, 1.25].map((speed) => (
            <button
              key={speed}
              onClick={() => {
                setPlaybackSpeed(speed);
                updatePreferences({ audioSpeed: speed });
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all ${
                playbackSpeed === speed
                  ? "bg-primary text-white border-primary shadow-soft"
                  : "bg-card border-border text-subtle hover:bg-subtle"
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Drill Card */}
      <div className="bg-surface border border-border rounded-3xl p-6 sm:p-10 shadow-card text-center space-y-8">
        <div className="space-y-4">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-subtle text-subtle">
            Question {currentIdx + 1} of {LISTENING_DRILLS.length}
          </span>

          {/* Large Audio Play Button */}
          <button
            onClick={playDrillAudio}
            className="w-24 h-24 rounded-full bg-primary hover:bg-primary-hover text-white flex items-center justify-center mx-auto shadow-glow hover:scale-105 transition-all group"
            aria-label="Play audio"
          >
            <Play className="w-10 h-10 fill-current ml-1 group-hover:scale-110 transition-transform" />
          </button>
          <div className="text-xs text-subtle">Click to play Japanese audio snippet</div>
        </div>

        {/* Question Prompt */}
        <div className="space-y-3 pt-4 border-t border-border">
          <h2 className="text-xl font-bold text-ink">{drill.question}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
            {drill.options.map((option, optIdx) => {
              const isSelected = selectedOpt === optIdx;
              const isCorrect = optIdx === drill.correctAnswer;

              let btnStyle = "border-border bg-card hover:bg-subtle text-ink";
              if (isAnswered) {
                if (isCorrect) btnStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-bold";
                else if (isSelected) btnStyle = "border-rose-500 bg-rose-500/10 text-rose-800 dark:text-rose-300 font-bold";
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  disabled={isAnswered}
                  className={`p-4 rounded-2xl border text-left text-sm font-semibold transition-all ${btnStyle}`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback Banner */}
        {isAnswered && (
          <div className="p-4 rounded-2xl bg-subtle border border-border text-left max-w-lg mx-auto space-y-1 text-xs animate-fadeIn">
            <div className="font-bold text-ink flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Transcript & Explanation:</span>
            </div>
            <div className="font-jp font-bold text-sm text-primary">{drill.audioText}</div>
            <p className="text-subtle">{drill.explanation}</p>
          </div>
        )}

        {isAnswered && (
          <button
            onClick={handleNext}
            className="w-full max-w-lg py-3.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-2xl shadow-soft text-sm transition-all"
          >
            Next Audio Question →
          </button>
        )}
      </div>
    </div>
  );
}
