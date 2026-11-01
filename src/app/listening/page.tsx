"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/providers/state-context";
import { JapaneseAudioSynthesizer } from "@/lib/audio/speech";
import { Volume2, Play, Sparkles, Info } from "lucide-react";

interface ListeningDrill {
  id: string;
  category: "travel" | "dining" | "time" | "daily" | "shopping" | "health";
  audioText: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const LISTENING_DRILLS: ListeningDrill[] = [
  {
    id: "l_1",
    category: "travel",
    audioText: "明日は東京へ新幹線で行きます。",
    question: "Where is the speaker traveling tomorrow, and by what mode of transportation?",
    options: [
      "Tokyo by Shinkansen (bullet train)",
      "Kyoto by airplane",
      "Osaka by local train",
      "Tokyo by long-distance bus",
    ],
    correctAnswer: 0,
    explanation: "Transcript: '明日は東京へ新幹線で行きます' (Tomorrow I am going to Tokyo by Shinkansen).",
  },
  {
    id: "l_2",
    category: "dining",
    audioText: "すみません、冷たい水を二杯ください。",
    question: "What beverage did the speaker order, and in what quantity?",
    options: [
      "One cup of hot tea",
      "Two glasses of cold water (冷たい水 二杯)",
      "Two bottles of beer",
      "One glass of iced water",
    ],
    correctAnswer: 1,
    explanation: "Transcript: 'すみません、冷たい水を二杯ください' (Excuse me, two glasses of cold water please). Note: 杯 (hai) is the liquid glass/cup counter.",
  },
  {
    id: "l_3",
    category: "time",
    audioText: "今、何時ですか。七時半です。",
    question: "What time was stated by the speaker?",
    options: ["6:30", "7:00", "7:30 (七時半)", "8:30"],
    correctAnswer: 2,
    explanation: "Transcript: '今、何時ですか。七時半です' (What time is it now? It is 7:30). '半' (han) means half past.",
  },
  {
    id: "l_4",
    category: "shopping",
    audioText: "この辞書は三千円です。",
    question: "What is the price of the dictionary mentioned?",
    options: ["300 yen", "1,300 yen", "3,000 yen (三千円)", "30,000 yen"],
    correctAnswer: 2,
    explanation: "Transcript: 'この辞書は三千円です' (This dictionary is 3,000 yen). Note that 3,000 voices to 'sanzen'.",
  },
  {
    id: "l_5",
    category: "daily",
    audioText: "毎朝六時半に起きて、ジョギングをします。",
    question: "What does the speaker do every morning?",
    options: [
      "Wakes up at 6:30 and goes jogging",
      "Wakes up at 7:00 and reads news",
      "Goes to sleep at 6:30 AM",
      "Eats breakfast at 6:30 with family",
    ],
    correctAnswer: 0,
    explanation: "Transcript: '毎朝六時半に起きて、ジョギングをします' (Every morning I wake up at 6:30 and jog).",
  },
  {
    id: "l_6",
    category: "travel",
    audioText: "京都駅の前に大きなホテルがあります。",
    question: "What is located in front of Kyoto Station?",
    options: [
      "A small cafe",
      "A large hotel (大きなホテル)",
      "An old temple",
      "A department store",
    ],
    correctAnswer: 1,
    explanation: "Transcript: '京都駅の前に大きなホテルがあります' (There is a big hotel in front of Kyoto Station).",
  },
  {
    id: "l_7",
    category: "daily",
    audioText: "私の家には可愛い猫が二匹います。",
    question: "What pets live at the speaker's home?",
    options: [
      "One cute dog",
      "Two cute cats (猫が二匹)",
      "Three birds",
      "Two large dogs",
    ],
    correctAnswer: 1,
    explanation: "Transcript: '私の家には可愛い猫が二匹います' (At my home, there are two cute cats). Note: 匹 (hiki) is the small animal counter.",
  },
  {
    id: "l_8",
    category: "health",
    audioText: "食後にこの薬を二錠飲んでください。",
    question: "When and how much medicine should be taken?",
    options: [
      "Before meals, one tablet",
      "After meals, two tablets (食後 二錠)",
      "Before sleep, two tablets",
      "In the morning, one liquid dose",
    ],
    correctAnswer: 1,
    explanation: "Transcript: '食後にこの薬を二錠飲んでください' (Please take two tablets of this medicine after meals). 錠 (jou) is the pill counter.",
  },
  {
    id: "l_9",
    category: "daily",
    audioText: "この傘を使ってもいいですか。",
    question: "What is the speaker asking for?",
    options: [
      "Permission to use this umbrella",
      "Where to purchase an umbrella",
      "Who owns this umbrella",
      "If the rain has stopped",
    ],
    correctAnswer: 0,
    explanation: "Transcript: 'この傘を使ってもいいですか' (May I use this umbrella?). Uses te-form + もいいですか for polite permission.",
  },
  {
    id: "l_10",
    category: "travel",
    audioText: "明日の午後は雨が降るでしょう。",
    question: "What is the weather forecast for tomorrow afternoon?",
    options: [
      "It will likely rain in the afternoon",
      "It will be clear and sunny all day",
      "It will snow heavily tomorrow night",
      "Strong typhoon winds in the morning",
    ],
    correctAnswer: 0,
    explanation: "Transcript: '明日の午後は雨が降るでしょう' (It will probably rain tomorrow afternoon).",
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

      {/* Speed Controls & Synthetic Speech Disclosure */}
      <div className="space-y-3">
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

        <div className="p-3 rounded-2xl bg-subtle border border-border flex items-start gap-2.5 text-xs text-subtle">
          <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px]">
            <strong>Audio Synthesis Disclosure:</strong> Audio snippets are generated dynamically via client-side Web Speech Synthesis conforming to Japanese phoneme rules. Pitch accents may vary according to your operating system&apos;s installed Japanese voice engine.
          </p>
        </div>
      </div>

      {/* Interactive Drill Card */}
      <div className="bg-surface border border-border rounded-3xl p-6 sm:p-10 shadow-card text-center space-y-8">
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-subtle text-subtle">
              Question {currentIdx + 1} of {LISTENING_DRILLS.length}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary-light text-primary">
              {drill.category}
            </span>
          </div>

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
