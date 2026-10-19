import { z } from "zod";

export const AbilityLevelSchema = z.enum([
  "beginner",
  "know_hiragana",
  "know_kana",
  "basic_vocab",
  "intermediate",
  "advanced",
]);

export const LearningGoalSchema = z.enum([
  "travel",
  "anime",
  "conversation",
  "reading_writing",
  "school",
  "jlpt",
  "professional",
]);

export const DailyStudyTimeSchema = z.union([
  z.literal(5),
  z.literal(10),
  z.literal(15),
  z.literal(20),
]);

export const ThemeIdSchema = z.enum([
  "sakura",
  "matcha",
  "midnight",
  "zen",
  "ocean",
  "autumn",
  "lantern",
]);

export const ColorModeSchema = z.enum(["light", "dark", "system"]);

export const OnboardingInputSchema = z.object({
  abilityLevel: AbilityLevelSchema,
  primaryGoal: LearningGoalSchema,
  dailyStudyMinutes: DailyStudyTimeSchema,
  dailyXpGoal: z.number().min(10).max(100),
  placementScore: z.number().optional(),
});

export const UserPreferencesSchema = z.object({
  theme: ThemeIdSchema,
  colorMode: ColorModeSchema,
  audioSpeed: z.number().min(0.5).max(2.0),
  showFurigana: z.boolean(),
  showRomaji: z.boolean(),
  soundEffects: z.boolean(),
  reducedMotion: z.boolean(),
  fontSize: z.enum(["sm", "base", "lg"]),
  dailyXpGoal: z.number().min(5).max(500),
  dailyStudyMinutes: DailyStudyTimeSchema,
  abilityLevel: AbilityLevelSchema,
  primaryGoal: LearningGoalSchema,
  timezone: z.string(),
  hasCompletedOnboarding: z.boolean(),
  placementScore: z.number().optional(),
});

export const ExerciseSubmissionSchema = z.object({
  exerciseId: z.string().min(1),
  lessonId: z.string().min(1),
  userAnswer: z.union([z.string(), z.array(z.string())]),
  timeSpentSeconds: z.number().min(0),
});

export const LessonCompletionSchema = z.object({
  lessonId: z.string().min(1),
  score: z.number().min(0).max(100),
  attempts: z.number().min(1),
  exercisesCompleted: z.number().min(1),
  timeSpentSeconds: z.number().min(0),
  transactionId: z.string().min(1), // Idempotency key to prevent duplicate rewards
});

export const SRSReviewSubmissionSchema = z.object({
  srsItemId: z.string().min(1),
  grade: z.number().min(0).max(5),
});
