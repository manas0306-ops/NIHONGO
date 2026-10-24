"use client";

import React, { useState } from "react";
import { GRAMMAR_DATABASE } from "@/data/grammar";
import { GrammarEntry } from "@/types";
import { useApp } from "@/lib/providers/state-context";
import { JapaneseAudioSynthesizer } from "@/lib/audio/speech";
import {
  Search,
  Volume2,
  BookOpen,
  AlertCircle,
  FileText,
  CheckCircle2,
  Split,
  HelpCircle,
  Sparkles,
} from "lucide-react";

interface ComparisonPair {
  id: string;
  title: string;
  jpTitle: string;
  summary: string;
  left: {
    label: string;
    role: string;
    rule: string;
    example: { jp: string; en: string; audio: string };
  };
  right: {
    label: string;
    role: string;
    rule: string;
    example: { jp: string; en: string; audio: string };
  };
  quickRule: string;
  quiz: {
    sentence: string;
    options: string[];
    correct: string;
    explanation: string;
  };
}

const COMPARISON_PAIRS: ComparisonPair[] = [
  {
    id: "wa-vs-ga",
    title: "Topic は (wa) vs Subject が (ga)",
    jpTitle: "「は」と「が」の違い",
    summary:
      "The most famous nuance in Japanese. は marks what you are talking about (the topic), while が identifies the specific actor/subject that performs the action.",
    left: {
      label: "は (wa) — Topic Marker",
      role: "Sets the stage: 'As for X...'",
      rule: "The important new information comes AFTER は. Used for general truths, habitual actions, and contrasting statements.",
      example: {
        jp: "私は猫が好きです。",
        en: "As for me, I like cats. (Focus on 'like cats')",
        audio: "わたしはねこがすきです。",
      },
    },
    right: {
      label: "が (ga) — Subject Identifier",
      role: "Identifies the specific actor: 'X is the one that...'",
      rule: "The emphasis is ON the word before が. Used with verbs of existence (ある/いる), spontaneous sensory perception, and answering question words (誰が, 何が).",
      example: {
        jp: "私が田中です。",
        en: "I am Tanaka. (Focus on 'I am the one you are looking for')",
        audio: "わたしがたなかです。",
      },
    },
    quickRule:
      "Golden rule: If answering 'Who did it?' use が. If discussing general information about someone, use は.",
    quiz: {
      sentence: "誰____来ましたか？ (Who came?)",
      options: ["は", "が", "に"],
      correct: "が",
      explanation:
        "Question words (誰, 何, どこ) can never be marked by は because an unknown entity cannot be an established conversational topic. Always use が!",
    },
  },
  {
    id: "ni-vs-de",
    title: "Location に (ni) vs Location で (de)",
    jpTitle: "場所の「に」と「で」",
    summary:
      "Both indicate location or direction, but に is for static existence / targets of movement, while で is for active events or means/tools.",
    left: {
      label: "に (ni) — Static Presence / Destination",
      role: "Where something exists or where motion leads",
      rule: "Used with existence verbs (ある / いる), destinations (行く / 来る / 帰る), and specific times (7時に).",
      example: {
        jp: "東京に行きます。",
        en: "I am going to Tokyo. (Destination target)",
        audio: "とうきょうにいきます。",
      },
    },
    right: {
      label: "で (de) — Action Site / Tool & Means",
      role: "Where dynamic action takes place, or by what method",
      rule: "Used for the location of active verbs (勉強する / 食べる / 働く) and instruments (箸で食べる, 電車で行く).",
      example: {
        jp: "図書館で勉強します。",
        en: "I study at the library. (Active event happening at the site)",
        audio: "としょかんでべんきょうします。",
      },
    },
    quickRule:
      "Ask yourself: Is an active event happening there? → で. Is something simply sitting there or is it the destination? → に.",
    quiz: {
      sentence: "レストラン____寿司を食べました。 (I ate sushi at the restaurant.)",
      options: ["に", "で", "へ"],
      correct: "で",
      explanation:
        "Eating (食べる) is an active event happening at that location, so use the action-location particle で.",
    },
  },
  {
    id: "kara-vs-made",
    title: "Starting Point から (kara) vs Endpoint まで (made)",
    jpTitle: "起点「から」と終点「まで」",
    summary:
      "Indicate the boundary of time, space, and ranges. から marks the beginning; まで marks the ending limit.",
    left: {
      label: "から (kara) — From / Since",
      role: "Starting boundary of time or distance",
      rule: "Marks the origin point: 9時から (from 9 o'clock), 東京から (from Tokyo). In clauses, also means 'because'.",
      example: {
        jp: "会議は９時から始まります。",
        en: "The meeting starts from 9:00.",
        audio: "かいぎはくじからはじまります。",
      },
    },
    right: {
      label: "まで (made) — Until / Up to",
      role: "Ending boundary or final threshold",
      rule: "Marks the termination point: 5時まで (until 5 o'clock), 京都まで (up to Kyoto).",
      example: {
        jp: "午後５時まで働きます。",
        en: "I work until 5:00 PM.",
        audio: "ごごごじまではたらきます。",
      },
    },
    quickRule:
      "Often paired as 'A から B まで' (From A to B). Both work identically for both physical places and clock time.",
    quiz: {
      sentence: "東京____京都まで新幹線で行きました。 (I went from Tokyo to Kyoto by Shinkansen.)",
      options: ["から", "まで", "に"],
      correct: "から",
      explanation:
        "Tokyo is the starting origin point of the journey, followed by the destination limit Kyoto まで.",
    },
  },
  {
    id: "kore-vs-kono",
    title: "これ (kore) vs この (kono)",
    jpTitle: "指示詞「これ」と連体詞「この」",
    summary:
      "Both mean 'this' near the speaker, but これ stands entirely alone as a noun, whereas この must be attached directly to a noun.",
    left: {
      label: "これ (kore) — Standalone Demonstrative Noun",
      role: "Directly replaced with 'this thing'",
      rule: "Can stand alone followed immediately by a particle: これは、これを、これが.",
      example: {
        jp: "これは美味しいです。",
        en: "This is delicious. (No noun needed after 'kore')",
        audio: "これはおいしいです。",
      },
    },
    right: {
      label: "この (kono) — Demonstrative Noun Modifier",
      role: "Modifies the following noun: 'this [noun]'",
      rule: "CANNOT stand alone. It must be directly followed by a noun: この本、この人、このペン.",
      example: {
        jp: "この本は面白いです。",
        en: "This book is interesting. (Attached to 'hon')",
        audio: "このほんはおもしろいです。",
      },
    },
    quickRule:
      "Never say 'この は' (impossible syntax!). It must always be 'この [Noun] は'. If no noun follows, use これ.",
    quiz: {
      sentence: "____辞書は誰のですか？ (Whose dictionary is this?)",
      options: ["これ", "この", "ここ"],
      correct: "この",
      explanation:
        "The word 辞書 (dictionary) directly follows, so you must use the pre-noun adjectival modifier この, not the standalone pronoun これ.",
    },
  },
  {
    id: "aru-vs-iru",
    title: "Existence ある (aru) vs いる (iru)",
    jpTitle: "存在動詞「ある」と「いる」",
    summary:
      "Japanese distinguishes the existence of inanimate objects from sentient, living things with independent motion.",
    left: {
      label: "ある (aru) — Inanimate Existence",
      role: "Non-living items, plants, and abstract events",
      rule: "Used for furniture, books, cars, trees, flowers, and events (祭りがある). Polite: あります.",
      example: {
        jp: "机の上に本があります。",
        en: "There is a book on top of the desk.",
        audio: "つくえのうえにほんがあります。",
      },
    },
    right: {
      label: "いる (iru) — Animate Existence",
      role: "Living beings capable of independent physical movement",
      rule: "Used for people, dogs, cats, birds, and insects. Polite: います.",
      example: {
        jp: "庭に猫がいます。",
        en: "There is a cat in the garden.",
        audio: "にわにねこがいます。",
      },
    },
    quickRule:
      "Can it walk, crawl, or think? → いる. Is it stationary or a plant? → ある.",
    quiz: {
      sentence: "公園に子供が____。 (There are children in the park.)",
      options: ["あります", "います", "します"],
      correct: "います",
      explanation:
        "Children (子供) are living humans capable of autonomous movement, so animate existence います must be used.",
    },
  },
];

export default function GrammarStudioPage() {
  const { preferences } = useApp();
  const [activeTab, setActiveTab] = useState<"rules" | "comparisons">("rules");
  const [search, setSearch] = useState("");
  const [selectedGrammar, setSelectedGrammar] = useState<GrammarEntry>(GRAMMAR_DATABASE[0]);
  const [selectedPair, setSelectedPair] = useState<ComparisonPair>(COMPARISON_PAIRS[0]);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});

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

  const handleQuizSelect = (pairId: string, option: string) => {
    setQuizAnswers((prev) => ({ ...prev, [pairId]: option }));
    setQuizSubmitted((prev) => ({ ...prev, [pairId]: true }));
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary-light text-primary">
            Syntax & Rules
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-subtle text-subtle">
            JLPT N5-N3
          </span>
        </div>
        <h1 className="text-3xl font-bold text-ink mt-2">Grammar Studio (文法スタジオ)</h1>
        <p className="text-sm text-subtle">
          Structured grammar patterns with formation formulas, politeness registers, and side-by-side particle comparisons.
        </p>
      </div>

      {/* Primary Sub-Navigation Tab */}
      <div className="flex gap-2 border-b border-border pb-3">
        <button
          onClick={() => setActiveTab("rules")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "rules"
              ? "bg-primary text-white shadow-soft"
              : "bg-surface border border-border text-subtle hover:text-ink"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Grammar Catalog ({GRAMMAR_DATABASE.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("comparisons")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "comparisons"
              ? "bg-primary text-white shadow-soft"
              : "bg-surface border border-border text-subtle hover:text-ink"
          }`}
        >
          <Split className="w-4 h-4" />
          <span>Confusing Pair Comparisons ({COMPARISON_PAIRS.length})</span>
        </button>
      </div>

      {activeTab === "rules" ? (
        /* RULES CATALOG VIEW */
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

            <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
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
                onClick={() =>
                  playAudio(selectedGrammar.examples[0]?.audioText || selectedGrammar.pattern)
                }
                className="p-2 rounded-xl bg-primary-light text-primary hover:scale-105 transition-transform"
                title="Play Example Audio"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-ink">{selectedGrammar.title}</h2>
              <div className="text-base font-jp font-bold text-primary mt-1">
                {selectedGrammar.pattern}
              </div>
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
      ) : (
        /* CONFUSING PAIR COMPARISONS VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Pairs Selector */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-subtle uppercase tracking-wider block px-1">
              Select Nuance Pair
            </span>
            {COMPARISON_PAIRS.map((pair) => {
              const isSelected = selectedPair.id === pair.id;
              return (
                <div
                  key={pair.id}
                  onClick={() => setSelectedPair(pair)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? "border-primary bg-primary-light/40 shadow-soft"
                      : "border-border bg-surface hover:bg-subtle"
                  }`}
                >
                  <div className="font-bold text-sm text-ink">{pair.title}</div>
                  <div className="font-jp text-xs text-primary font-bold mt-0.5">{pair.jpTitle}</div>
                  <p className="text-xs text-subtle line-clamp-2 mt-1.5">{pair.summary}</p>
                </div>
              );
            })}
          </div>

          {/* Right: Side-by-Side Deep Comparison Card */}
          <div className="lg:col-span-2 bg-surface border border-border rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
            <div>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary-light text-primary">
                Deep-Dive Contrast
              </span>
              <h2 className="text-2xl font-bold text-ink mt-2">{selectedPair.title}</h2>
              <div className="text-sm font-jp font-bold text-primary">{selectedPair.jpTitle}</div>
              <p className="text-xs text-subtle mt-2 leading-relaxed">{selectedPair.summary}</p>
            </div>

            {/* Side-by-Side 2-Column Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Left Column */}
              <div className="p-4 rounded-2xl border border-primary/20 bg-primary-light/20 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="font-bold text-sm text-primary font-jp">{selectedPair.left.label}</div>
                  <div className="text-xs font-semibold text-ink">{selectedPair.left.role}</div>
                  <p className="text-xs text-subtle leading-relaxed">{selectedPair.left.rule}</p>
                </div>
                <div className="p-3 rounded-xl bg-card border border-border text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-primary">Example</span>
                    <button
                      onClick={() => playAudio(selectedPair.left.example.audio)}
                      className="p-1 rounded text-primary hover:bg-subtle"
                      aria-label="Play example audio"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="font-jp font-bold text-ink">{selectedPair.left.example.jp}</div>
                  <div className="text-muted text-[11px]">{selectedPair.left.example.en}</div>
                </div>
              </div>

              {/* Right Column */}
              <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="font-bold text-sm text-emerald-700 dark:text-emerald-300 font-jp">
                    {selectedPair.right.label}
                  </div>
                  <div className="text-xs font-semibold text-ink">{selectedPair.right.role}</div>
                  <p className="text-xs text-subtle leading-relaxed">{selectedPair.right.rule}</p>
                </div>
                <div className="p-3 rounded-xl bg-card border border-border text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-emerald-600">Example</span>
                    <button
                      onClick={() => playAudio(selectedPair.right.example.audio)}
                      className="p-1 rounded text-emerald-600 hover:bg-subtle"
                      aria-label="Play example audio"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="font-jp font-bold text-ink">{selectedPair.right.example.jp}</div>
                  <div className="text-muted text-[11px]">{selectedPair.right.example.en}</div>
                </div>
              </div>
            </div>

            {/* Golden Rule Callout */}
            <div className="p-4 rounded-2xl bg-subtle border border-border text-xs space-y-1">
              <div className="font-bold text-ink flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>Quick Decision Rule:</span>
              </div>
              <p className="text-subtle leading-relaxed">{selectedPair.quickRule}</p>
            </div>

            {/* Interactive Concept Check Mini-Quiz */}
            <div className="pt-4 border-t border-border space-y-3">
              <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-primary" />
                <span>Test Your Understanding:</span>
              </span>
              <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
                <div className="font-jp font-bold text-base text-ink">
                  {selectedPair.quiz.sentence}
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedPair.quiz.options.map((opt) => {
                    const isSelected = quizAnswers[selectedPair.id] === opt;
                    const isSubmitted = quizSubmitted[selectedPair.id];
                    const isCorrect = opt === selectedPair.quiz.correct;

                    let btnClass = "bg-surface border-border text-ink hover:border-primary";
                    if (isSubmitted) {
                      if (isCorrect) {
                        btnClass = "bg-emerald-500/20 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold";
                      } else if (isSelected) {
                        btnClass = "bg-rose-500/20 border-rose-500 text-rose-700 dark:text-rose-300";
                      }
                    } else if (isSelected) {
                      btnClass = "border-primary bg-primary-light text-primary font-bold";
                    }

                    return (
                      <button
                        key={opt}
                        onClick={() => handleQuizSelect(selectedPair.id, opt)}
                        className={`px-4 py-2 rounded-xl border text-xs font-jp transition-all ${btnClass}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {quizSubmitted[selectedPair.id] && (
                  <div
                    className={`p-3 rounded-xl text-xs space-y-1 animate-fadeIn ${
                      quizAnswers[selectedPair.id] === selectedPair.quiz.correct
                        ? "bg-emerald-500/10 text-emerald-800 dark:text-emerald-200"
                        : "bg-amber-500/10 text-amber-800 dark:text-amber-200"
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1">
                      {quizAnswers[selectedPair.id] === selectedPair.quiz.correct ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> 正解！ Correct!
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3.5 h-3.5" /> Try again!
                        </>
                      )}
                    </div>
                    <p>{selectedPair.quiz.explanation}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

