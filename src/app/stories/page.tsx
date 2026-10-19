"use client";

import React, { useState } from "react";
import { STORIES_DATABASE } from "@/data/stories";
import { Story } from "@/types";
import { useApp } from "@/lib/providers/state-context";
import { JapaneseAudioSynthesizer } from "@/lib/audio/speech";
import { BookOpen, Volume2, Sparkles, CheckCircle2, ChevronRight, HelpCircle } from "lucide-react";

export default function StoriesPage() {
  const { preferences, updatePreferences } = useApp();
  const [selectedStory, setSelectedStory] = useState<Story>(STORIES_DATABASE[0]);
  const [showEnglish, setShowEnglish] = useState(true);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const synth = JapaneseAudioSynthesizer.getInstance();

  const playSentenceAudio = (text: string) => {
    synth.speak(text, preferences.audioSpeed);
  };

  const handleSelectOption = (qId: string, optIdx: number) => {
    if (quizSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary-light text-primary">
            Reading & Culture
          </span>
          <h1 className="text-3xl font-bold text-ink mt-2">Stories & Dialogues (ストーリー)</h1>
          <p className="text-sm text-subtle">
            Immerse yourself in authentic graded dialogues with sentence-by-sentence audio and cultural context.
          </p>
        </div>

        {/* Toggles */}
        <div className="flex gap-2">
          <button
            onClick={() => updatePreferences({ showFurigana: !preferences.showFurigana })}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
              preferences.showFurigana
                ? "bg-primary text-white border-primary"
                : "bg-surface border-border text-subtle hover:text-ink"
            }`}
          >
            Furigana: {preferences.showFurigana ? "ON" : "OFF"}
          </button>
          <button
            onClick={() => setShowEnglish(!showEnglish)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
              showEnglish
                ? "bg-primary text-white border-primary"
                : "bg-surface border-border text-subtle hover:text-ink"
            }`}
          >
            English: {showEnglish ? "ON" : "OFF"}
          </button>
        </div>
      </div>

      {/* Story Selector Pills */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        {STORIES_DATABASE.map((story) => (
          <button
            key={story.id}
            onClick={() => {
              setSelectedStory(story);
              setUserAnswers({});
              setQuizSubmitted(false);
            }}
            className={`px-4 py-2.5 rounded-2xl border text-left flex-shrink-0 transition-all ${
              selectedStory.id === story.id
                ? "border-primary bg-primary text-white shadow-soft font-bold"
                : "border-border bg-surface hover:bg-subtle text-ink font-semibold"
            }`}
          >
            <div className="text-xs">{story.title}</div>
            <div className="text-[11px] font-jp opacity-80">{story.japaneseTitle}</div>
          </button>
        ))}
      </div>

      {/* Story Dialogue Stream */}
      <div className="bg-surface border border-border rounded-3xl p-6 sm:p-10 shadow-card space-y-6">
        <div>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary-light text-primary">
            JLPT {selectedStory.level} Graded Story
          </span>
          <h2 className="text-2xl font-bold text-ink mt-2">{selectedStory.title}</h2>
          <p className="text-sm text-subtle mt-1">{selectedStory.summary}</p>
        </div>

        {/* Cultural Context Note */}
        {selectedStory.culturalNote && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Cultural Context Note:</span>
            </div>
            <p className="leading-relaxed">{selectedStory.culturalNote}</p>
          </div>
        )}

        {/* Dialogue Lines */}
        <div className="space-y-4 pt-4 border-t border-border">
          {selectedStory.dialogue.map((line, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-subtle/60 border border-border flex items-start gap-3.5 group hover:bg-subtle transition-colors"
            >
              <div className="w-10 h-10 rounded-2xl bg-card border border-border flex items-center justify-center text-xl flex-shrink-0 shadow-soft">
                {line.avatar}
              </div>
              <div className="flex-1 space-y-1">
                <div className="text-xs font-bold text-primary">{line.speaker}</div>
                <div className="text-base font-jp font-bold text-ink leading-relaxed">
                  {line.japanese}
                </div>
                {preferences.showRomaji && (
                  <div className="text-xs text-subtle font-mono">{line.romaji}</div>
                )}
                {showEnglish && (
                  <div className="text-xs text-subtle font-medium">{line.english}</div>
                )}
              </div>
              <button
                onClick={() => playSentenceAudio(line.japanese)}
                className="p-2 rounded-xl text-subtle hover:text-primary hover:bg-card transition-colors flex-shrink-0"
                aria-label="Play line audio"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Comprehension Questions */}
        <div className="pt-6 border-t border-border space-y-5">
          <h3 className="font-bold text-base text-ink flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-primary" />
            <span>Reading Comprehension Quiz</span>
          </h3>

          <div className="space-y-4">
            {selectedStory.questions.map((q) => {
              const selectedAnswer = userAnswers[q.id];
              const isCorrect = selectedAnswer === q.correctAnswer;

              return (
                <div key={q.id} className="p-4 rounded-2xl bg-card border border-border space-y-3">
                  <div className="text-sm font-semibold text-ink">{q.question}</div>
                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isChosen = selectedAnswer === optIdx;
                      let style = "border-border bg-subtle hover:bg-border text-ink";
                      if (quizSubmitted) {
                        if (optIdx === q.correctAnswer) {
                          style = "border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-bold";
                        } else if (isChosen) {
                          style = "border-rose-500 bg-rose-500/10 text-rose-800 dark:text-rose-300 font-bold";
                        }
                      } else if (isChosen) {
                        style = "border-primary bg-primary text-white font-bold";
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={quizSubmitted}
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${style}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div className="p-3 rounded-xl bg-subtle text-xs text-subtle border border-border">
                      💡 {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {!quizSubmitted && (
            <button
              onClick={() => setQuizSubmitted(true)}
              disabled={Object.keys(userAnswers).length < selectedStory.questions.length}
              className="w-full py-3.5 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-bold rounded-2xl shadow-soft text-sm transition-all"
            >
              Submit Quiz Answers
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
