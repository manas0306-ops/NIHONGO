"use client";

import React, { useState, useEffect, useRef } from "react";
import { useApp } from "@/lib/providers/state-context";
import {
  JapaneseAudioSynthesizer,
  SpeechStatus,
  compareSpeechRecognition,
} from "@/lib/audio/speech";
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  RotateCcw,
  Info,
  HelpCircle,
  Keyboard,
  ShieldCheck,
} from "lucide-react";

interface SpeakingPrompt {
  id: string;
  category: "greetings" | "intro" | "daily" | "dining" | "travel";
  categoryLabel: string;
  japanese: string;
  romaji: string;
  english: string;
  hint: string;
}

const SPEAKING_PROMPTS: SpeakingPrompt[] = [
  {
    id: "sp_1",
    category: "greetings",
    categoryLabel: "Greetings (挨拶)",
    japanese: "おはようございます",
    romaji: "ohayou gozaimasu",
    english: "Good morning (polite)",
    hint: "Keep vowels clear and elongated on 'u'.",
  },
  {
    id: "sp_2",
    category: "greetings",
    categoryLabel: "Greetings (挨拶)",
    japanese: "ありがとうございます",
    romaji: "arigatou gozaimasu",
    english: "Thank you very much (polite)",
    hint: "Equal syllable timing; don't stress individual syllables like English.",
  },
  {
    id: "sp_3",
    category: "greetings",
    categoryLabel: "Greetings (挨拶)",
    japanese: "失礼します",
    romaji: "shitsurei shimasu",
    english: "Excuse me / Goodbye (entering/leaving an office)",
    hint: "Drop the 'u' vowel slightly at the end: 'shitsurei shimas(u)'.",
  },
  {
    id: "sp_4",
    category: "intro",
    categoryLabel: "Self-Introduction (自己紹介)",
    japanese: "はじめまして、よろしくお願いします",
    romaji: "hajimemashite, yoroshiku onegaishimasu",
    english: "Nice to meet you, please treat me well.",
    hint: "Pause gently at the comma between the two phrases.",
  },
  {
    id: "sp_5",
    category: "intro",
    categoryLabel: "Self-Introduction (自己紹介)",
    japanese: "私は学生です",
    romaji: "watashi wa gakusei desu",
    english: "I am a student.",
    hint: "Pronounce は as 'wa', not 'ha'.",
  },
  {
    id: "sp_6",
    category: "dining",
    categoryLabel: "Dining (注文・カフェ)",
    japanese: "お水を一杯ください",
    romaji: "omizu o ippai kudasai",
    english: "Please give me a glass of water.",
    hint: "The small tsu in ippai creates a clean 1-beat pause before 'pai'.",
  },
  {
    id: "sp_7",
    category: "dining",
    categoryLabel: "Dining (注文・カフェ)",
    japanese: "これをおねがいします",
    romaji: "kore o onegaishimasu",
    english: "This one, please (pointing to a menu item).",
    hint: "Natural pitch rises slightly on 'kore' and levels off.",
  },
  {
    id: "sp_8",
    category: "travel",
    categoryLabel: "Travel & Directions (道案内)",
    japanese: "駅はどこですか",
    romaji: "eki wa doko desu ka",
    english: "Where is the train station?",
    hint: "Ending 'ka' has a questioning pitch rise.",
  },
  {
    id: "sp_9",
    category: "travel",
    categoryLabel: "Travel & Directions (道案内)",
    japanese: "すみません、日本語が少ししか話せません",
    romaji: "sumimasen, nihongo ga sukoshi shika hanasemasen",
    english: "Excuse me, I can only speak a little Japanese.",
    hint: "Smoothly connect 'sumimasen' with natural polite breath.",
  },
  {
    id: "sp_10",
    category: "daily",
    categoryLabel: "Daily Life (日常会話)",
    japanese: "明日東京へ行きます",
    romaji: "ashita toukyou e ikimasu",
    english: "I am going to Tokyo tomorrow.",
    hint: "Pronounce direction particle へ as 'e', not 'he'.",
  },
];

export default function SpeakingPage() {
  const { preferences, recordMistake } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [status, setStatus] = useState<SpeechStatus>("ready");
  const [transcript, setTranscript] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const [typedFallback, setTypedFallback] = useState("");
  const [fallbackMode, setFallbackMode] = useState(false);
  const [showMicHelp, setShowMicHelp] = useState(false);

  const synth = JapaneseAudioSynthesizer.getInstance();

  const filteredPrompts =
    selectedCategory === "all"
      ? SPEAKING_PROMPTS
      : SPEAKING_PROMPTS.filter((p) => p.category === selectedCategory);

  const safeIdx = Math.min(currentIdx, filteredPrompts.length - 1);
  const prompt = filteredPrompts[safeIdx] || SPEAKING_PROMPTS[0];

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Feature detection for Web Speech API recognition
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setIsSupported(false);
        setStatus("unsupported");
        setFallbackMode(true);
      }
    }
  }, []);

  const playPromptAudio = () => {
    synth.speak(prompt.japanese, preferences.audioSpeed);
  };

  const startRecording = () => {
    if (!isSupported) {
      setFallbackMode(true);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "ja-JP";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setStatus("recording");
        setTranscript("");
        setScore(null);
      };

      recognition.onresult = (event: any) => {
        const resultText = event.results[0][0].transcript;
        setTranscript(resultText);
        setStatus("processing");

        const comparison = compareSpeechRecognition(resultText, prompt.japanese);
        setScore(comparison.score);
        setStatus("result_available");

        if (comparison.score < 60) {
          recordMistake({
            skill: "speaking",
            questionId: prompt.id,
            prompt: prompt.japanese,
            userAnswer: resultText,
            correctAnswer: prompt.japanese,
            concept: `発音・スピーキング (${prompt.japanese})`,
            errorType: "audio_distinction",
            severity: "medium",
          });
        }
      };

      recognition.onerror = (e: any) => {
        console.warn("Speech recognition error:", e);
        if (e.error === "not-allowed" || e.error === "permission-denied") {
          setStatus("permission_required");
          setShowMicHelp(true);
        } else {
          setStatus("error");
        }
      };

      recognition.onend = () => {
        if (status === "recording") {
          setStatus("result_available");
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error(err);
      setStatus("error");
      setFallbackMode(true);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
  };

  const handleNext = () => {
    setTranscript("");
    setScore(null);
    setStatus("ready");
    setTypedFallback("");
    setCurrentIdx((prev) => (prev + 1) % filteredPrompts.length);
  };

  const handleKeyboardCheck = () => {
    const comparison = compareSpeechRecognition(typedFallback, prompt.japanese);
    setScore(comparison.score);
    setTranscript(typedFallback);
    setStatus("result_available");

    if (comparison.score < 60) {
      recordMistake({
        skill: "speaking",
        questionId: prompt.id,
        prompt: prompt.japanese,
        userAnswer: typedFallback,
        correctAnswer: prompt.japanese,
        concept: `発音・スピーキング (${prompt.japanese})`,
        errorType: "audio_distinction",
        severity: "medium",
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary-light text-primary">
            Speech & Pronunciation
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-subtle text-subtle">
            Web Speech Engine
          </span>
        </div>
        <h1 className="text-3xl font-bold text-ink mt-2">Speaking Studio (発音トレーニング)</h1>
        <p className="text-sm text-subtle">
          Practice speaking natural Japanese with Web Speech recognition, native audio models, and honest feedback.
        </p>
      </div>

      {/* Honest Pedagogical Measurement Disclaimer */}
      <div className="p-4 rounded-2xl bg-primary-light/40 border border-primary/20 text-xs text-ink space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-primary">
          <Info className="w-4 h-4" />
          <span>About Speech Evaluation & Pitch Accent:</span>
        </div>
        <p className="text-subtle leading-relaxed">
          The browser Web Speech API evaluates <strong>Transcript Match (認識一致率)</strong> — whether Japanese speech recognition accurately understands what you said. It does not measure acoustic pitch-accent spectrograms. For true pitch contour mastery, compare your cadence directly with the native audio model.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: "all", label: "All Prompts" },
          { id: "greetings", label: "Greetings" },
          { id: "intro", label: "Self-Intro" },
          { id: "dining", label: "Dining & Ordering" },
          { id: "travel", label: "Travel & Directions" },
          { id: "daily", label: "Daily Life" },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setSelectedCategory(cat.id);
              setCurrentIdx(0);
              setTranscript("");
              setScore(null);
              setStatus("ready");
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === cat.id
                ? "bg-primary text-white shadow-soft"
                : "bg-surface border border-border text-subtle hover:text-ink"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Target Sentence Card */}
      <div className="bg-surface border border-border rounded-3xl p-6 sm:p-10 shadow-card text-center space-y-8">
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-subtle text-subtle">
              {prompt.categoryLabel}
            </span>
            <span className="text-xs text-muted">
              {safeIdx + 1} of {filteredPrompts.length}
            </span>
          </div>

          <div className="text-3xl sm:text-4xl font-jp font-bold text-ink py-2">{prompt.japanese}</div>
          <div className="text-sm font-semibold text-primary">{prompt.romaji}</div>
          <div className="text-xs text-subtle max-w-sm mx-auto">{prompt.english}</div>

          {/* Pronunciation Cadence Tip */}
          <div className="text-[11px] text-muted italic max-w-md mx-auto pt-1">
            💡 Pronunciation tip: {prompt.hint}
          </div>

          <div className="pt-2">
            <button
              onClick={playPromptAudio}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-light text-primary font-bold text-xs hover:scale-105 transition-transform"
            >
              <Volume2 className="w-4 h-4" />
              <span>Listen to Reference Native Audio</span>
            </button>
          </div>
        </div>

        {/* Microphone / Recording Interface */}
        <div className="pt-6 border-t border-border space-y-6">
          {!fallbackMode ? (
            <div className="space-y-4">
              <div className="relative inline-block">
                {status === "recording" && (
                  <div className="absolute inset-0 rounded-full bg-rose-500/20 animate-ping" />
                )}
                <button
                  onClick={status === "recording" ? stopRecording : startRecording}
                  className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center mx-auto text-white shadow-soft transition-all ${
                    status === "recording"
                      ? "bg-rose-600 animate-pulse scale-110 shadow-glow"
                      : "bg-primary hover:bg-primary-hover hover:scale-105"
                  }`}
                  aria-label={status === "recording" ? "Stop recording" : "Start speaking"}
                >
                  {status === "recording" ? (
                    <MicOff className="w-10 h-10" />
                  ) : (
                    <Mic className="w-10 h-10" />
                  )}
                </button>
              </div>

              <div className="text-xs font-semibold text-subtle">
                {status === "ready" && "Tap microphone and speak clearly in Japanese"}
                {status === "recording" && (
                  <span className="text-rose-500 font-bold flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    Listening in Japanese (ja-JP)... Tap again to submit
                  </span>
                )}
                {status === "processing" && "Evaluating transcript match..."}
                {status === "permission_required" && (
                  <div className="text-rose-500 flex items-center justify-center gap-1.5">
                    <AlertCircle className="w-4 h-4" />
                    <span>Microphone access was blocked. Please grant mic permission.</span>
                  </div>
                )}
                {status === "unsupported" && (
                  <span className="text-amber-500">
                    Speech recognition unsupported in this browser environment. Use keyboard mode below.
                  </span>
                )}
              </div>
            </div>
          ) : (
            /* Keyboard Alternative Mode */
            <div className="space-y-3 max-w-md mx-auto">
              <div className="flex items-center justify-between text-xs text-subtle">
                <span className="font-semibold flex items-center gap-1">
                  <Keyboard className="w-3.5 h-3.5" /> Keyboard Practice Mode
                </span>
                <span>Type Japanese or Romaji</span>
              </div>
              <input
                type="text"
                value={typedFallback}
                onChange={(e) => setTypedFallback(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && typedFallback.trim()) {
                    handleKeyboardCheck();
                  }
                }}
                placeholder="Type the sentence in Japanese or Romaji..."
                className="w-full p-3.5 rounded-2xl border border-border bg-card text-ink font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleKeyboardCheck}
                disabled={!typedFallback.trim()}
                className="w-full py-3 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-bold rounded-2xl text-xs transition-all"
              >
                Evaluate Text
              </button>
            </div>
          )}

          {/* Mode Switcher */}
          <div className="flex items-center justify-center gap-4 text-xs">
            <button
              onClick={() => setFallbackMode(!fallbackMode)}
              className="text-primary font-semibold hover:underline flex items-center gap-1"
            >
              {fallbackMode ? (
                <>
                  <Mic className="w-3.5 h-3.5" /> Switch to Voice Microphone
                </>
              ) : (
                <>
                  <Keyboard className="w-3.5 h-3.5" /> Use Keyboard Input Mode
                </>
              )}
            </button>
            <button
              onClick={() => setShowMicHelp(!showMicHelp)}
              className="text-muted hover:text-ink flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" /> Mic help
            </button>
          </div>

          {/* Microphone Permission Troubleshooting */}
          {showMicHelp && (
            <div className="p-4 rounded-2xl bg-subtle border border-border text-left text-xs text-subtle space-y-2 max-w-md mx-auto animate-fadeIn">
              <span className="font-bold text-ink block">How to enable microphone access:</span>
              <ul className="list-disc pl-4 space-y-1">
                <li>Look for the camera/microphone icon in your browser URL bar.</li>
                <li>Click it and change permission to <strong>Always allow</strong>.</li>
                <li>If using iOS Safari, ensure Web Speech permissions are allowed in Settings &gt; Safari.</li>
                <li>In private/incognito tabs, some browsers block speech recognition APIs automatically.</li>
              </ul>
            </div>
          )}

          {/* Result Card */}
          {transcript && score !== null && (
            <div className="p-5 rounded-2xl bg-subtle border border-border max-w-md mx-auto text-left space-y-3 animate-fadeIn text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-ink">Transcript Recognition Result:</span>
                <span
                  className={`font-bold px-2.5 py-0.5 rounded-full ${
                    score >= 75
                      ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                      : score >= 50
                      ? "bg-amber-500/20 text-amber-700 dark:text-amber-300"
                      : "bg-rose-500/20 text-rose-700 dark:text-rose-300"
                  }`}
                >
                  {score}% Match
                </span>
              </div>
              <div className="p-3 rounded-xl bg-card border border-border font-jp font-semibold text-ink text-sm">
                "{transcript}"
              </div>
              <p className="text-subtle leading-relaxed">
                {score >= 75
                  ? "🌟 Excellent speech recognition match! Your pronunciation was clear and easily transcribed."
                  : score >= 50
                  ? "👍 Recognizable! A few syllables were slightly unclear. Re-listen to the reference audio and try again."
                  : "Keep practicing! Tap 'Listen to Reference Native Audio' and focus on the syllable rhythm before speaking."}
              </p>
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={handleNext}
              className="w-full max-w-md py-3.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-2xl shadow-soft text-sm transition-all"
            >
              Next Pronunciation Challenge →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

