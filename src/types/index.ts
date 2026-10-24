export type ThemeId =
  | "sakura"
  | "matcha"
  | "midnight"
  | "zen"
  | "ocean"
  | "autumn"
  | "lantern";

export type ColorMode = "light" | "dark" | "system";

export type AbilityLevel =
  | "beginner"
  | "know_hiragana"
  | "know_kana"
  | "basic_vocab"
  | "intermediate"
  | "advanced";

export type LearningGoal =
  | "travel"
  | "anime"
  | "conversation"
  | "reading_writing"
  | "school"
  | "jlpt"
  | "professional";

export type DailyStudyTime = 5 | 10 | 15 | 20;

export type JLPTLevel = "N5" | "N4" | "N3" | "N2" | "N1";

export type CurriculumLevel = "A" | "B" | "C" | "D" | "E";

export type ExerciseType =
  | "multiple_choice"
  | "ja_to_en"
  | "en_to_ja"
  | "word_bank"
  | "drag_and_drop"
  | "fill_blank"
  | "missing_particle"
  | "match_pairs"
  | "match_audio_text"
  | "listen_select"
  | "listen_type"
  | "kana_recognition"
  | "kanji_recognition"
  | "reading_comprehension"
  | "grammar_correction"
  | "dialogue_completion"
  | "conversation_response"
  | "romaji_to_kana"
  | "kana_to_romaji"
  | "typing_practice"
  | "speech_pronunciation"
  | "writing_canvas";

export interface PairMatchItem {
  id: string;
  japanese: string;
  english: string;
  romaji?: string;
}

export interface Exercise {
  id: string;
  type: ExerciseType;
  prompt: string;
  japanesePrompt?: string;
  promptAudio?: string;
  options?: string[];
  correctAnswer: string | string[];
  acceptedAlternatives?: string[];
  wordBank?: string[];
  pairs?: PairMatchItem[];
  missingPartIndex?: number;
  explanation: string;
  hint?: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  skillTag: "kana" | "kanji" | "vocabulary" | "grammar" | "listening" | "speaking" | "reading";
  audioReference?: string;
  referenceStrokeOrder?: string[];
}

export interface Lesson {
  id: string;
  unitId: string;
  title: string;
  japaneseTitle: string;
  description: string;
  order: number;
  level: CurriculumLevel;
  jlpt: JLPTLevel;
  durationMinutes: number;
  objectives: string[];
  grammarNotes?: string;
  vocabularyList?: string[];
  kanjiList?: string[];
  prerequisites: string[];
  exercises: Exercise[];
  xpReward: number;
}

export interface Unit {
  id: string;
  order: number;
  title: string;
  japaneseTitle: string;
  description: string;
  level: CurriculumLevel;
  jlpt: JLPTLevel;
  iconName: string;
  color: string;
  lessons: Lesson[];
}

export interface UserPreferences {
  theme: ThemeId;
  colorMode: ColorMode;
  audioSpeed: number; // 0.75, 1.0, 1.25
  showFurigana: boolean;
  showRomaji: boolean;
  soundEffects: boolean;
  reducedMotion: boolean;
  fontSize: "sm" | "base" | "lg";
  dailyXpGoal: number;
  dailyStudyMinutes: DailyStudyTime;
  abilityLevel: AbilityLevel;
  primaryGoal: LearningGoal;
  timezone: string;
  hasCompletedOnboarding: boolean;
  placementScore?: number;
}

export interface GamificationState {
  xp: number;
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  hearts: number;
  maxHearts: number;
  gems: number;
  level: number;
  streakFreeze: number;
  unlockedLessons: string[];
  completedLessons: Record<string, { completedAt: string; score: number; attempts: number }>;
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  gemReward: number;
  progress: number;
  target: number;
  isCompleted: boolean;
  category: "xp" | "lessons" | "reviews" | "perfect";
}

export interface Achievement {
  id: string;
  title: string;
  japaneseTitle: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress: number;
  target: number;
  isUnlocked: boolean;
}

export interface SRSItem {
  id: string;
  type: "kana" | "kanji" | "vocabulary" | "grammar";
  key: string;
  japanese: string;
  reading: string;
  meaning: string;
  intervalDays: number;
  repetitions: number;
  easeFactor: number;
  dueDate: string; // ISO date string
  lastReviewedDate?: string;
  correctCount: number;
  incorrectCount: number;
  masteryLevel: "learning" | "reviewing" | "mastered";
}

export interface KanaCharacter {
  kana: string;
  romaji: string;
  type: "hiragana" | "katakana";
  category: "gojuon" | "dakuten" | "handakuten" | "yoon";
  audioKey: string;
  strokes: number;
  mnemonic: string;
  strokeSvgPath?: string[];
  similarKana?: string[];
}

export interface KanjiItem {
  character: string;
  meaning: string;
  onyomi: string[];
  kunyomi: string[];
  strokes: number;
  grade: number;
  jlpt: JLPTLevel;
  radical: string;
  parts: string[];
  mnemonic: string;
  examples: {
    japanese: string;
    reading: string;
    english: string;
  }[];
}

export interface GrammarEntry {
  id: string;
  pattern: string;
  title: string;
  level: JLPTLevel;
  meaning: string;
  formation: string;
  explanation: string;
  register: "casual" | "polite" | "formal" | "humble" | "honorific";
  commonMistakes: string;
  examples: {
    japanese: string;
    furigana: string;
    romaji: string;
    english: string;
    audioText?: string;
  }[];
  relatedGrammar?: string[];
}

export interface StoryDialogueLine {
  speaker: string;
  avatar: string;
  japanese: string;
  furigana: string;
  romaji: string;
  english: string;
}

export interface StoryQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Story {
  id: string;
  title: string;
  japaneseTitle: string;
  level: JLPTLevel;
  summary: string;
  culturalNote?: string;
  dialogue: StoryDialogueLine[];
  questions: StoryQuestion[];
  vocabularyHighlights: { word: string; reading: string; meaning: string }[];
}

export interface UserStats {
  totalLessonsCompleted: number;
  totalExercisesAttempted: number;
  accuracyRate: number;
  totalXp: number;
  totalStudyMinutes: number;
  vocabularyMasteredCount: number;
  kanjiMasteredCount: number;
  grammarMasteredCount: number;
  kanaMasteredCount: number;
  weeklyActivity: { date: string; xp: number; minutes: number }[];
}

export type SkillType =
  | "kana"
  | "kanji"
  | "vocabulary"
  | "grammar"
  | "listening"
  | "speaking"
  | "reading";

export type ErrorType =
  | "particle_confusion"
  | "verb_conjugation"
  | "reading_error"
  | "kana_confusion"
  | "vocabulary_meaning"
  | "audio_distinction"
  | "keigo_register"
  | "general_mistake";

export interface MistakeRecord {
  id: string;
  skill: SkillType;
  concept: string; // e.g. "は vs が", "に vs で", "さ vs き", "食べる te-form"
  lessonId?: string;
  questionId: string;
  prompt: string;
  userAnswer: string;
  correctAnswer: string;
  errorType: ErrorType;
  timestamp: string;
  severity: "low" | "medium" | "high";
  resolved: boolean;
  reviewCount: number;
}

export interface SkillMastery {
  skill: SkillType;
  level: number; // 0 to 100 percentage based on retention
  itemsAttempted: number;
  itemsMastered: number;
  accuracy: number;
  lastPracticed?: string;
}

export interface LearnerModel {
  schemaVersion: number;
  skills: Record<SkillType, SkillMastery>;
  mistakes: MistakeRecord[];
  recentPerformance: {
    date: string;
    accuracy: number;
    studyMinutes: number;
    exercisesCompleted: number;
  }[];
  overallMastery: number; // 0 to 100 percentage (weighted retention)
  progressPercentage: number; // completed lessons / total lessons
}

export interface WeakAreaSummary {
  concept: string;
  skill: SkillType;
  errorCount: number;
  lastMistakeDate: string;
  exampleProblem: {
    prompt: string;
    userAnswer: string;
    correctAnswer: string;
  };
}
