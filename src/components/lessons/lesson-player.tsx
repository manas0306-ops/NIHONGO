"use client";

import React, { useState, useEffect, useRef } from "react";
import { Lesson, Exercise, PairMatchItem, SRSItem } from "@/types";
import { useApp } from "@/lib/providers/state-context";
import { JapaneseAudioSynthesizer, normalizeJapaneseText } from "@/lib/audio/speech";
import { createSRSItem } from "@/lib/spaced-repetition/sm2";
import { classifyMistakeConcept } from "@/lib/learning/model";
import { AppDataStore } from "@/lib/database/store";
import {
  Volume2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  X,
  VolumeX,
  Lightbulb,
  Repeat,
} from "lucide-react";
import confetti from "canvas-confetti";

interface LessonPlayerProps {
  lesson: Lesson;
  onExit: () => void;
  nextLessonId?: string;
}

export function LessonPlayer({ lesson, onExit, nextLessonId }: LessonPlayerProps) {
  const { preferences, recordLessonCompletion, recordMistake } = useApp();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [wordBankSelected, setWordBankSelected] = useState<string[]>([]);
  const [typedInput, setTypedInput] = useState<string>("");
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({});
  const [selectedPairLeft, setSelectedPairLeft] = useState<string | null>(null);
  const [submittedUserAnswer, setSubmittedUserAnswer] = useState<string>("");
  const [enrolledSRSCount, setEnrolledSRSCount] = useState<number>(0);

  // Status: "answering" | "checked_correct" | "checked_incorrect" | "finished"
  const [status, setStatus] = useState<
    "intro" | "answering" | "checked_correct" | "checked_incorrect" | "finished"
  >("intro");

  const [score, setScore] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<number>(1);
  const [startTime] = useState<number>(Date.now());

  // Canvas ref for writing exercises
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const synth = JapaneseAudioSynthesizer.getInstance();
  const currentExercise: Exercise | undefined = lesson.exercises[currentIndex];

  // Auto-play audio if prompt audio is present
  useEffect(() => {
    if (status === "answering" && currentExercise?.promptAudio && preferences.soundEffects) {
      synth.speak(currentExercise.promptAudio, preferences.audioSpeed);
    }
  }, [currentIndex, status]);

  // Clean canvas when index changes
  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    setSelectedOption("");
    setWordBankSelected([]);
    setTypedInput("");
    setMatchedPairs({});
    setSelectedPairLeft(null);
    setShowHint(false);
  }, [currentIndex]);

  const handleStartLesson = () => {
    setStatus("answering");
  };

  // Check Answer Logic
  const handleCheck = () => {
    if (!currentExercise) return;

    let isCorrect = false;

    if (
      currentExercise.type === "multiple_choice" ||
      currentExercise.type === "kana_recognition" ||
      currentExercise.type === "kanji_recognition" ||
      currentExercise.type === "listen_select" ||
      currentExercise.type === "dialogue_completion" ||
      currentExercise.type === "conversation_response" ||
      currentExercise.type === "romaji_to_kana" ||
      currentExercise.type === "fill_blank" ||
      currentExercise.type === "missing_particle" ||
      currentExercise.type === "ja_to_en" ||
      currentExercise.type === "en_to_ja" ||
      currentExercise.type === "grammar_correction"
    ) {
      const normSelected = normalizeJapaneseText(selectedOption);
      const normCorrect = normalizeJapaneseText(
        typeof currentExercise.correctAnswer === "string"
          ? currentExercise.correctAnswer
          : currentExercise.correctAnswer[0]
      );
      isCorrect = normSelected === normCorrect;

      // Check alternatives
      if (!isCorrect && currentExercise.acceptedAlternatives) {
        isCorrect = currentExercise.acceptedAlternatives.some(
          (alt) => normalizeJapaneseText(alt) === normSelected
        );
      }
    } else if (currentExercise.type === "word_bank") {
      const joinedSelected = wordBankSelected.join("");
      const target = Array.isArray(currentExercise.correctAnswer)
        ? currentExercise.correctAnswer.join("")
        : currentExercise.correctAnswer;
      isCorrect = normalizeJapaneseText(joinedSelected) === normalizeJapaneseText(target);
    } else if (
      currentExercise.type === "typing_practice" ||
      currentExercise.type === "kana_to_romaji" ||
      currentExercise.type === "listen_type"
    ) {
      const normInput = typedInput.trim().toLowerCase();
      const normTarget = (
        typeof currentExercise.correctAnswer === "string"
          ? currentExercise.correctAnswer
          : currentExercise.correctAnswer[0]
      )
        .trim()
        .toLowerCase();

      isCorrect = normInput === normTarget;

      if (!isCorrect && currentExercise.acceptedAlternatives) {
        isCorrect = currentExercise.acceptedAlternatives.some(
          (alt) => alt.trim().toLowerCase() === normInput
        );
      }
    } else if (currentExercise.type === "match_pairs") {
      // Pair match is correct if all pairs are matched
      const totalPairs = currentExercise.pairs?.length || 0;
      isCorrect = Object.keys(matchedPairs).length >= totalPairs && totalPairs > 0;
    } else if (currentExercise.type === "writing_canvas") {
      isCorrect = true; // Drawing practice completed
    }

    let userAnswerStr = "";
    if (currentExercise.type === "word_bank") {
      userAnswerStr = wordBankSelected.join("");
    } else if (
      currentExercise.type === "typing_practice" ||
      currentExercise.type === "kana_to_romaji" ||
      currentExercise.type === "listen_type"
    ) {
      userAnswerStr = typedInput;
    } else if (currentExercise.type === "match_pairs") {
      userAnswerStr = `${Object.keys(matchedPairs).length} pairs matched`;
    } else {
      userAnswerStr = selectedOption;
    }

    setSubmittedUserAnswer(userAnswerStr);

    const expectedStr = Array.isArray(currentExercise.correctAnswer)
      ? currentExercise.correctAnswer.join(" / ")
      : currentExercise.correctAnswer;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setStatus("checked_correct");
    } else {
      // Record pedagogical mistake into LearnerModel
      const { concept, errorType } = classifyMistakeConcept(
        currentExercise.prompt,
        userAnswerStr || "None",
        expectedStr,
        currentExercise.skillTag
      );

      recordMistake({
        skill: currentExercise.skillTag,
        concept,
        lessonId: lesson.id,
        questionId: currentExercise.id,
        prompt: currentExercise.prompt,
        userAnswer: userAnswerStr || "No answer",
        correctAnswer: expectedStr,
        errorType,
        severity: "medium",
      });

      setStatus("checked_incorrect");
    }
  };

  const handleRetry = () => {
    setSelectedOption("");
    setWordBankSelected([]);
    setTypedInput("");
    setMatchedPairs({});
    setSelectedPairLeft(null);
    clearCanvas();
    setStatus("answering");
  };

  const handleContinue = () => {
    if (currentIndex + 1 < lesson.exercises.length) {
      setCurrentIndex((prev) => prev + 1);
      setStatus("answering");
    } else {
      // Finish lesson
      const finalScore = Math.round(((score + (status === "checked_correct" ? 1 : 0)) / lesson.exercises.length) * 100);
      const txId = `tx_${lesson.id}_${Date.now()}`;

      // Automatic Lesson-to-SRS Enrollment
      const store = AppDataStore.getInstance();
      const existingSRS = store.loadSRSItems();
      const existingKeys = new Set(existingSRS.map((i) => i.key));
      const newSRS: SRSItem[] = [];

      lesson.exercises.forEach((ex) => {
        const target = typeof ex.correctAnswer === "string" ? ex.correctAnswer : ex.correctAnswer[0];
        if (ex.pairs) {
          ex.pairs.forEach((pair) => {
            const key = `pair_${pair.id}`;
            if (!existingKeys.has(key)) {
              newSRS.push(
                createSRSItem("vocabulary", key, pair.japanese, pair.romaji || pair.japanese, pair.english)
              );
              existingKeys.add(key);
            }
          });
        } else if (ex.skillTag === "vocabulary" || ex.skillTag === "kana" || ex.skillTag === "kanji") {
          const key = `lex_${ex.id}`;
          if (!existingKeys.has(key) && target && target.length < 15) {
            newSRS.push(createSRSItem(ex.skillTag, key, target, target, ex.explanation.slice(0, 45)));
            existingKeys.add(key);
          }
        }
      });

      if (newSRS.length > 0) {
        store.saveSRSItems([...existingSRS, ...newSRS]);
        setEnrolledSRSCount(newSRS.length);
      }

      recordLessonCompletion({
        lessonId: lesson.id,
        xpEarned: lesson.xpReward,
        score: finalScore,
        transactionId: txId,
        nextLessonId,
      });

      setStatus("finished");
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  };

  // Drawing Canvas Methods (Touch & Mouse unified)
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
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#e11d48";
    const { x, y } = getCanvasCoords(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Progress percentage
  const progressPercent = Math.round(((currentIndex + 1) / lesson.exercises.length) * 100);

  return (
    <div className="min-h-screen bg-primary/5 flex flex-col justify-between p-4 sm:p-6 max-w-3xl mx-auto w-full">
      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-3xl p-6 max-w-sm w-full text-center shadow-card">
            <h3 className="font-bold text-lg text-ink mb-2">Leave lesson?</h3>
            <p className="text-xs text-subtle mb-6">
              Your current progress in this lesson will not be saved until completion.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-border font-semibold text-xs hover:bg-subtle"
              >
                Keep Learning
              </button>
              <button
                onClick={onExit}
                className="flex-1 py-2.5 rounded-xl bg-danger text-white font-bold text-xs"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <button
          onClick={() => setShowExitConfirm(true)}
          className="p-2 rounded-xl text-subtle hover:bg-subtle transition-colors"
          aria-label="Exit lesson"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Progress Bar */}
        <div className="flex-1 bg-subtle h-3 rounded-full overflow-hidden border border-border">
          <div
            className="bg-primary h-full transition-all duration-300 rounded-full"
            style={{ width: `${status === "intro" ? 0 : progressPercent}%` }}
          />
        </div>

        <span className="text-xs font-bold text-subtle">
          {currentIndex + 1} / {lesson.exercises.length}
        </span>
      </div>

      {/* LESSON INTRO SEQUENCE */}
      {status === "intro" && (
        <div className="bg-surface border border-border rounded-3xl p-6 sm:p-10 shadow-card my-auto text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-primary-light text-primary flex items-center justify-center mx-auto text-3xl shadow-soft">
            📖
          </div>
          <div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary-light text-primary">
              JLPT {lesson.jlpt} • Level {lesson.level}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-ink mt-3">{lesson.title}</h1>
            <p className="text-sm font-jp text-subtle mt-1">{lesson.japaneseTitle}</p>
            <p className="text-sm text-subtle mt-3 max-w-md mx-auto">{lesson.description}</p>
          </div>

          <div className="bg-subtle rounded-2xl p-4 text-left border border-border max-w-md mx-auto">
            <h4 className="font-bold text-xs text-ink mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Learning Objectives:</span>
            </h4>
            <ul className="text-xs text-subtle space-y-1.5 list-disc list-inside">
              {lesson.objectives.map((obj, i) => (
                <li key={i}>{obj}</li>
              ))}
            </ul>
          </div>

          <button
            onClick={handleStartLesson}
            className="w-full max-w-md py-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-2xl shadow-soft text-base transition-all"
          >
            Start Lesson (+{lesson.xpReward} XP)
          </button>
        </div>
      )}

      {/* EXERCISE RUNNER */}
      {(status === "answering" || status === "checked_correct" || status === "checked_incorrect") &&
        currentExercise && (
          <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 shadow-card my-auto space-y-6">
            {/* Prompt & Skill Header */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                  {currentExercise.skillTag} • {currentExercise.type.replace(/_/g, " ")}
                </span>
                {currentExercise.hint && (
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="text-xs text-subtle flex items-center gap-1 hover:text-ink"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{showHint ? "Hide Hint" : "Hint"}</span>
                  </button>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-ink flex items-center gap-3">
                <span>{currentExercise.prompt}</span>
                {currentExercise.promptAudio && (
                  <button
                    onClick={() => synth.speak(currentExercise.promptAudio!, preferences.audioSpeed)}
                    className="p-2 rounded-xl bg-primary-light text-primary hover:scale-105 transition-transform"
                    aria-label="Play Japanese audio"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                )}
              </h2>
              {showHint && currentExercise.hint && (
                <div className="mt-2 text-xs text-amber-600 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                  💡 Hint: {currentExercise.hint}
                </div>
              )}
            </div>

            {/* EXERCISE TYPE RENDERING */}

            {/* 1. Multiple Choice / Recognition / Fill Blank */}
            {currentExercise.options &&
              currentExercise.type !== "match_pairs" &&
              currentExercise.type !== "word_bank" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentExercise.options.map((option, idx) => (
                    <button
                      key={idx}
                      disabled={status !== "answering"}
                      onClick={() => {
                        setSelectedOption(option);
                        if (preferences.soundEffects) {
                          synth.speak(option, preferences.audioSpeed);
                        }
                      }}
                      className={`p-4 rounded-2xl border text-left font-jp text-base font-semibold transition-all ${
                        selectedOption === option
                          ? "border-primary bg-primary-light/50 text-ink shadow-soft"
                          : "border-border bg-card hover:bg-subtle text-ink"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

            {/* 2. Word Bank Assembly */}
            {currentExercise.type === "word_bank" && (
              <div className="space-y-4">
                {/* Sentence assembly area */}
                <div className="min-h-[60px] p-4 rounded-2xl border-2 border-dashed border-border bg-subtle flex flex-wrap gap-2 items-center">
                  {wordBankSelected.length === 0 ? (
                    <span className="text-xs text-muted">Tap word chips below to construct sentence...</span>
                  ) : (
                    wordBankSelected.map((word, wIdx) => (
                      <button
                        key={wIdx}
                        disabled={status !== "answering"}
                        onClick={() => {
                          setWordBankSelected((prev) => prev.filter((_, idx) => idx !== wIdx));
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-primary text-white font-jp font-semibold text-sm shadow-soft hover:bg-primary-hover"
                      >
                        {word} ✕
                      </button>
                    ))
                  )}
                </div>

                {/* Available Word Chips */}
                <div className="flex flex-wrap gap-2">
                  {currentExercise.wordBank?.map((word, bIdx) => (
                    <button
                      key={bIdx}
                      disabled={status !== "answering"}
                      onClick={() => {
                        setWordBankSelected((prev) => [...prev, word]);
                        if (preferences.soundEffects) synth.speak(word, preferences.audioSpeed);
                      }}
                      className="px-4 py-2 rounded-xl border border-border bg-card hover:bg-subtle font-jp font-semibold text-sm shadow-soft"
                    >
                      {word}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Typing Practice / Listen Type */}
            {(currentExercise.type === "typing_practice" ||
              currentExercise.type === "kana_to_romaji" ||
              currentExercise.type === "listen_type") && (
              <div className="space-y-3">
                <input
                  type="text"
                  disabled={status !== "answering"}
                  value={typedInput}
                  onChange={(e) => setTypedInput(e.target.value)}
                  placeholder="Type romaji or Japanese..."
                  className="w-full p-4 rounded-2xl border border-border bg-card text-ink font-semibold focus:outline-none focus:ring-2 focus:ring-primary text-base"
                />
              </div>
            )}

            {/* 4. Match Pairs */}
            {currentExercise.type === "match_pairs" && currentExercise.pairs && (
              <div className="grid grid-cols-2 gap-4">
                {/* Left (Japanese) */}
                <div className="space-y-2">
                  {currentExercise.pairs.map((p) => {
                    const isMatched = !!matchedPairs[p.japanese];
                    const isSelected = selectedPairLeft === p.japanese;
                    return (
                      <button
                        key={p.id}
                        disabled={isMatched || status !== "answering"}
                        onClick={() => setSelectedPairLeft(p.japanese)}
                        className={`w-full p-3.5 rounded-xl border font-jp font-bold text-sm text-center transition-all ${
                          isMatched
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 line-through"
                            : isSelected
                            ? "border-primary bg-primary text-white"
                            : "border-border bg-card hover:bg-subtle text-ink"
                        }`}
                      >
                        {p.japanese}
                      </button>
                    );
                  })}
                </div>

                {/* Right (English) */}
                <div className="space-y-2">
                  {currentExercise.pairs.map((p) => {
                    const isMatched = Object.values(matchedPairs).includes(p.english);
                    return (
                      <button
                        key={p.id}
                        disabled={isMatched || status !== "answering" || !selectedPairLeft}
                        onClick={() => {
                          if (!selectedPairLeft) return;
                          // Check if this pair matches
                          const matchingPair = currentExercise.pairs?.find(
                            (pair) => pair.japanese === selectedPairLeft && pair.english === p.english
                          );
                          if (matchingPair) {
                            setMatchedPairs((prev) => ({ ...prev, [selectedPairLeft]: p.english }));
                            setSelectedPairLeft(null);
                          } else {
                            // Incorrect pair selection
                            setSelectedPairLeft(null);
                          }
                        }}
                        className={`w-full p-3.5 rounded-xl border font-semibold text-xs text-center transition-all ${
                          isMatched
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 line-through"
                            : "border-border bg-card hover:bg-subtle text-ink"
                        }`}
                      >
                        {p.english}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 5. Writing Canvas Practice */}
            {currentExercise.type === "writing_canvas" && (
              <div className="space-y-3 text-center">
                <canvas
                  ref={canvasRef}
                  width={280}
                  height={280}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  aria-label="Japanese character stroke writing canvas"
                  className="mx-auto border-2 border-dashed border-border rounded-2xl bg-white shadow-soft cursor-crosshair touch-none"
                />
                <button
                  onClick={clearCanvas}
                  className="text-xs text-subtle hover:text-ink font-semibold flex items-center justify-center gap-1 mx-auto"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Canvas</span>
                </button>
              </div>
            )}
          </div>
        )}

      {/* LESSON FINISHED SCREEN */}
      {status === "finished" && (
        <div className="bg-surface border border-border rounded-3xl p-6 sm:p-10 shadow-card my-auto text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-primary-light text-primary flex items-center justify-center mx-auto text-4xl shadow-soft">
            🏆
          </div>
          <div>
            <h1 className="text-3xl font-bold text-ink">Lesson Complete!</h1>
            <p className="text-sm text-subtle mt-1 font-jp">お疲れ様でした！</p>
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
            <div className="p-3.5 rounded-2xl bg-subtle border border-border">
              <div className="text-xs text-subtle">Earned</div>
              <div className="font-bold text-lg text-primary">+{lesson.xpReward} XP</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-subtle border border-border">
              <div className="text-xs text-subtle">Accuracy</div>
              <div className="font-bold text-lg text-emerald-600">
                {Math.round((score / lesson.exercises.length) * 100)}%
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-subtle border border-border">
              <div className="text-xs text-subtle">Gems</div>
              <div className="font-bold text-lg text-blue-500">+10 💎</div>
            </div>
          </div>

          {enrolledSRSCount > 0 && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 max-w-sm mx-auto flex items-center justify-center gap-2">
              <Repeat className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>+{enrolledSRSCount} items enrolled into your Review Center (SM-2)!</span>
            </div>
          )}

          <button
            onClick={onExit}
            className="w-full max-w-sm py-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-2xl shadow-soft text-base transition-all"
          >
            Continue Learning
          </button>
        </div>
      )}

      {/* BOTTOM ACTION BAR */}
      {status !== "intro" && status !== "finished" && (
        <div className="mt-6">
          {/* Progressive Hint Button */}
          {status === "answering" && currentExercise?.hint && (
            <div className="mb-3 text-center">
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="text-xs text-subtle hover:text-ink font-semibold inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-subtle border border-border transition-colors"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>{showHint ? "Hide Hint" : "Need a Hint? (ヒント)"}</span>
              </button>
              {showHint && (
                <div className="mt-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 text-left animate-fadeIn">
                  💡 <strong>Hint:</strong> {currentExercise.hint}
                </div>
              )}
            </div>
          )}

          {/* Correct Feedback Banner */}
          {status === "checked_correct" && (
            <div className="mb-4 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-sm">正解！ Correct!</div>
                <div className="text-xs mt-0.5">{currentExercise?.explanation}</div>
              </div>
            </div>
          )}

          {/* Intelligent Error Feedback Banner */}
          {status === "checked_incorrect" && (
            <div className="mb-4 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-800 dark:text-rose-300 space-y-2">
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-xs text-rose-700 dark:text-rose-400">
                    ❌ Your answer: <span className="line-through">{submittedUserAnswer || "(none)"}</span>
                  </div>
                  <div className="font-bold text-sm text-emerald-700 dark:text-emerald-300">
                    ✅ Correct:{" "}
                    {Array.isArray(currentExercise?.correctAnswer)
                      ? currentExercise?.correctAnswer.join(" / ")
                      : currentExercise?.correctAnswer}
                  </div>
                </div>
              </div>
              <div className="text-xs pt-1.5 border-t border-rose-500/20 text-subtle leading-relaxed">
                💡 <strong>Why:</strong> {currentExercise?.explanation}
              </div>
            </div>
          )}

          {status === "answering" ? (
            <button
              onClick={handleCheck}
              className="w-full py-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-2xl shadow-soft text-base transition-all"
            >
              Check Answer
            </button>
          ) : status === "checked_incorrect" ? (
            <div className="flex gap-3">
              <button
                onClick={handleRetry}
                className="w-1/3 py-4 border-2 border-amber-500/40 hover:bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold rounded-2xl text-sm transition-all flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retry</span>
              </button>
              <button
                onClick={handleContinue}
                className="flex-1 py-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-2xl shadow-soft text-base transition-all flex items-center justify-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleContinue}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-soft text-base transition-all flex items-center justify-center gap-2"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
