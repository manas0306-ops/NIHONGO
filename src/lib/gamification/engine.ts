import { DailyQuest, GamificationState, Achievement } from "@/types";

export const INITIAL_GAMIFICATION_STATE: GamificationState = {
  xp: 0,
  streak: 0,
  lastActiveDate: "",
  hearts: 5,
  maxHearts: 5,
  gems: 100,
  level: 1,
  streakFreeze: 1,
  unlockedLessons: ["lesson_a_1"], // First lesson unlocked by default
  completedLessons: {},
};

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_step",
    title: "First Step",
    japaneseTitle: "第一歩",
    description: "Complete your very first Japanese lesson.",
    icon: "🌱",
    progress: 0,
    target: 1,
    isUnlocked: false,
  },
  {
    id: "kana_novice",
    title: "Kana Novice",
    japaneseTitle: "仮名初心者",
    description: "Master 10 Hiragana or Katakana characters.",
    icon: "✍️",
    progress: 0,
    target: 10,
    isUnlocked: false,
  },
  {
    id: "streak_flame_3",
    title: "Steady Spark",
    japaneseTitle: "三日坊主脱出",
    description: "Maintain a 3-day study streak.",
    icon: "🔥",
    progress: 0,
    target: 3,
    isUnlocked: false,
  },
  {
    id: "streak_flame_7",
    title: "Week Warrior",
    japaneseTitle: "一週間継続",
    description: "Maintain a 7-day study streak.",
    icon: "⚡",
    progress: 0,
    target: 7,
    isUnlocked: false,
  },
  {
    id: "kanji_apprentice",
    title: "Kanji Apprentice",
    japaneseTitle: "漢字見習い",
    description: "Learn your first 5 Kanji characters.",
    icon: "🏮",
    progress: 0,
    target: 5,
    isUnlocked: false,
  },
  {
    id: "centurion_xp",
    title: "Centurion",
    japaneseTitle: "百戦錬磨",
    description: "Accumulate 500 total XP.",
    icon: "🏆",
    progress: 0,
    target: 500,
    isUnlocked: false,
  },
  {
    id: "storyteller",
    title: "Story Explorer",
    japaneseTitle: "物語の旅人",
    description: "Complete your first reading story.",
    icon: "📖",
    progress: 0,
    target: 1,
    isUnlocked: false,
  },
];

export const INITIAL_DAILY_QUESTS: DailyQuest[] = [
  {
    id: "quest_daily_xp_30",
    title: "Earn 30 XP",
    description: "Study and complete lessons to earn 30 XP today.",
    xpReward: 15,
    gemReward: 10,
    progress: 0,
    target: 30,
    isCompleted: false,
    category: "xp",
  },
  {
    id: "quest_complete_lesson",
    title: "Complete 1 Lesson",
    description: "Finish any curriculum lesson or dojo practice.",
    xpReward: 20,
    gemReward: 10,
    progress: 0,
    target: 1,
    isCompleted: false,
    category: "lessons",
  },
  {
    id: "quest_review_srs",
    title: "Review 5 Cards",
    description: "Strengthen your memory in the Review Center.",
    xpReward: 15,
    gemReward: 15,
    progress: 0,
    target: 5,
    isCompleted: false,
    category: "reviews",
  },
];

/**
 * Format date in user's timezone as YYYY-MM-DD
 */
export function getLocalDateString(date: Date = new Date(), timezone?: string): string {
  try {
    const tz = timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return formatter.format(date);
  } catch {
    return date.toISOString().split("T")[0];
  }
}

/**
 * Update user streak based on activity date
 */
export function updateStreak(
  currentState: GamificationState,
  activityDateStr: string
): { newStreak: number; streakFreezeUsed: boolean; updatedStreakFreeze: number } {
  const { streak, lastActiveDate, streakFreeze } = currentState;

  if (!lastActiveDate) {
    return { newStreak: 1, streakFreezeUsed: false, updatedStreakFreeze: streakFreeze };
  }

  if (lastActiveDate === activityDateStr) {
    return { newStreak: streak, streakFreezeUsed: false, updatedStreakFreeze: streakFreeze };
  }

  // Calculate day difference
  const lastDate = new Date(lastActiveDate);
  const currentDate = new Date(activityDateStr);
  const diffTime = currentDate.getTime() - lastDate.getTime();
  const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

  if (diffDays === 1) {
    // Consecutive day
    return { newStreak: streak + 1, streakFreezeUsed: false, updatedStreakFreeze: streakFreeze };
  } else if (diffDays === 2 && streakFreeze > 0) {
    // Missed one day, but protected by streak freeze!
    return { newStreak: streak + 1, streakFreezeUsed: true, updatedStreakFreeze: streakFreeze - 1 };
  } else {
    // Streak broken
    return { newStreak: 1, streakFreezeUsed: false, updatedStreakFreeze: streakFreeze };
  }
}

/**
 * Calculate user level from total XP
 */
export function calculateLevel(xp: number): number {
  // Level 1: 0 - 99 XP
  // Level 2: 100 - 249 XP
  // Level 3: 250 - 449 XP
  // Level N: ~ 50 * N * (N - 1)
  if (xp <= 0) return 1;
  const level = Math.floor(Math.sqrt(xp / 50)) + 1;
  return Math.max(1, level);
}
