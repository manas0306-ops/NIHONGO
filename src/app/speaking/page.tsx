"use client";

import React, { useState, useEffect, useRef } from "react";
import { useApp } from "@/lib/providers/state-context";
import {
  JapaneseAudioSynthesizer,
  SpeechStatus,
  compareSpeechRecognition,
} from "@/lib/audio/speech";
import { Mic, MicOff, Volume2, Sparkles, AlertCircle, CheckCircle2, RotateCcw } from "lucide-react";

interface SpeakingPrompt {
  id: string;
  japanese: string;
  romaji: string;
  english: string;
}

const SPEAKING_PROMPTS: SpeakingPrompt[] = [
  {
    id: "sp_1",
    japanese: "おはようございます",
    romaji: "ohayou gozaimasu",
    english: "Good morning (polite)",
  },
  {
    id: "sp_2",
    japanese: "はじめまして、よろしくお願いします",
    romaji: "hajimemashite, yoroshiku onegaishimasu",
    english: "Nice to meet you, please treat me well.",
  },
  {
    id: "sp_3",
    japanese: "これは私の本です",
    romaji: "kore wa watashi no hon desu",
    english: "This is my book.",
  },
  {
    id: "sp_4",
    japanese: "お水を一杯ください",
    romaji: "omizu o ippai kudasai",
    english: "Please give me a glass of water.",
  },
];

export default function SpeakingPage() {
  const { preferences } = useApp();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [status, setStatus] = useState<SpeechStatus>("ready");
  const [transcript, setTranscript] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const [typedFallback, setTypedFallback] = useState("");
  const [fallbackMode, setFallbackMode] = useState(false);

  const synth = JapaneseAudioSynthesizer.getInstance();
  const prompt = SPEAKING_PROMPTS[currentIdx];

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Feature detection for Web Speech API recognition
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setIsSupported(false);
        setStatus("unsupported");
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
      };

      recognition.onerror = (e: any) => {
        console.warn("Speech error:", e);
        if (e.error === "not-allowed") {
          setStatus("permission_required");
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
      recognitionRef.current.stop();
    }
  };

  const handleNext = () => {
    setTranscript("");
    setScore(null);
    setStatus("ready");
    setTypedFallback("");
    setCurrentIdx((prev) => (prev + 1) % SPEAKING_PROMPTS.length);
  };

  const handleKeyboardCheck = () => {
    const comparison = compareSpeechRecognition(typedFallback, prompt.japanese);
    setScore(comparison.score);
    setTranscript(typedFallback);
    setStatus("result_available");
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary-light text-primary">
          Speech & Pronunciation
        </span>
        <h1 className="text-3xl font-bold text-ink mt-2">Speaking Studio (発音トレーニング)</h1>
        <p className="text-sm text-subtle">
          Practice speaking natural Japanese with Web Speech recognition, native audio models, and honest feedback.
        </p>
      </div>

      {/* Target Sentence Card */}
      <div className="bg-surface border border-border rounded-3xl p-6 sm:p-10 shadow-card text-center space-y-8">
        <div className="space-y-3">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-subtle text-subtle">
            Prompt {currentIdx + 1} of {SPEAKING_PROMPTS.length}
          </span>
          <div className="text-3xl sm:text-4xl font-jp font-bold text-ink">{prompt.japanese}</div>
          <div className="text-sm font-semibold text-primary">{prompt.romaji}</div>
          <div className="text-xs text-subtle max-w-sm mx-auto">{prompt.english}</div>

          <button
            onClick={playPromptAudio}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-light text-primary font-bold text-xs hover:scale-105 transition-transform"
          >
            <Volume2 className="w-4 h-4" />
            <span>Listen to Reference Native Audio</span>
          </button>
        </div>

        {/* Microphone / Recording Interface */}
        <div className="pt-6 border-t border-border space-y-6">
          {!fallbackMode ? (
            <div className="space-y-4">
              <div className="relative inline-block">
                <button
                  onClick={status === "recording" ? stopRecording : startRecording}
                  className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto text-white shadow-soft transition-all ${
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
                {status === "recording" && "Listening... Tap to stop"}
                {status === "processing" && "Evaluating transcript..."}
                {status === "permission_required" && (
                  <span className="text-rose-500">Microphone permission denied by browser.</span>
                )}
                {status === "unsupported" && (
                  <span className="text-amber-500">Speech recognition unsupported in this browser.</span>
                )}
              </div>
            </div>
          ) : (
            /* Keyboard Alternative Mode */
            <div className="space-y-3 max-w-md mx-auto">
              <input
                type="text"
                value={typedFallback}
                onChange={(e) => setTypedFallback(e.target.value)}
                placeholder="Type the sentence in Japanese or Romaji..."
                className="w-full p-3.5 rounded-2xl border border-border bg-card text-ink font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleKeyboardCheck}
                className="w-full py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-2xl text-xs"
              >
                Evaluate Text
              </button>
            </div>
          )}

          {/* Toggle between Voice and Keyboard mode */}
          <div>
            <button
              onClick={() => setFallbackMode(!fallbackMode)}
              className="text-xs text-primary font-semibold hover:underline"
            >
              {fallbackMode ? "Switch to Voice Microphone" : "Use Keyboard Alternative"}
            </button>
          </div>

          {/* Result Card */}
          {transcript && score !== null && (
            <div className="p-5 rounded-2xl bg-subtle border border-border max-w-md mx-auto text-left space-y-2 animate-fadeIn text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-ink">Recognition Result:</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded-full ${
                    score >= 75
                      ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                      : "bg-amber-500/20 text-amber-700 dark:text-amber-300"
                  }`}
                >
                  {score}% Match
                </span>
              </div>
              <div className="p-3 rounded-xl bg-card border border-border font-jp font-semibold text-ink">
                "{transcript}"
              </div>
              <p className="text-subtle">
                {score >= 75
                  ? "🌟 Excellent pronunciation! Clear and easily understood."
                  : "Good attempt! Review the reference native audio and try again."}
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
