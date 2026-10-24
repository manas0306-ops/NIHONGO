import {
  UserPreferences,
  GamificationState,
  SRSItem,
  DailyQuest,
  Achievement,
  UserStats,
  LearnerModel,
  MistakeRecord,
  WeakAreaSummary,
} from "@/types";
import {
  INITIAL_GAMIFICATION_STATE,
  INITIAL_ACHIEVEMENTS,
  INITIAL_DAILY_QUESTS,
  updateStreak,
  getLocalDateString,
  calculateLevel,
} from "../gamification/engine";
import { calculateSM2 } from "../spaced-repetition/sm2";
import { INITIAL_LEARNER_MODEL, computeSkillMastery } from "../learning/model";

const STORAGE_KEYS = {
  PREFS: "nekonihongo_user_preferences_v1",
  GAME_STATE: "nekonihongo_gamification_state_v1",
  SRS_ITEMS: "nekonihongo_srs_items_v1",
  QUESTS: "nekonihongo_daily_quests_v1",
  ACHIEVEMENTS: "nekonihongo_achievements_v1",
  STATS: "nekonihongo_user_stats_v1",
  COMPLETION_TXS: "nekonihongo_tx_records_v1",
  LEARNER_MODEL: "nekonihongo_learner_model_v1",
};

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: "sakura",
  colorMode: "system",
  audioSpeed: 1.0,
  showFurigana: true,
  showRomaji: true,
  soundEffects: true,
  reducedMotion: false,
  fontSize: "base",
  dailyXpGoal: 30,
  dailyStudyMinutes: 15,
  abilityLevel: "beginner",
  primaryGoal: "conversation",
  timezone: typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "UTC",
  hasCompletedOnboarding: false,
};

export class AppDataStore {
  private static instance: AppDataStore;

  public static getInstance(): AppDataStore {
    if (!AppDataStore.instance) {
      AppDataStore.instance = new AppDataStore();
    }
    return AppDataStore.instance;
  }

  // Load preferences
  public loadPreferences(): UserPreferences {
    if (typeof window === "undefined") return DEFAULT_PREFERENCES;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PREFS);
      return data ? { ...DEFAULT_PREFERENCES, ...JSON.parse(data) } : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  }

  public savePreferences(prefs: UserPreferences): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEYS.PREFS, JSON.stringify(prefs));
    } catch (e) {
      console.warn("Storage write failed", e);
    }
  }

  // Load Gamification State
  public loadGamificationState(): GamificationState {
    if (typeof window === "undefined") return INITIAL_GAMIFICATION_STATE;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GAME_STATE);
      return data ? { ...INITIAL_GAMIFICATION_STATE, ...JSON.parse(data) } : INITIAL_GAMIFICATION_STATE;
    } catch {
      return INITIAL_GAMIFICATION_STATE;
    }
  }

  public saveGamificationState(state: GamificationState): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(state));
    } catch (e) {
      console.warn("Storage write failed", e);
    }
  }

  // Load SRS Items
  public loadSRSItems(): SRSItem[] {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SRS_ITEMS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public saveSRSItems(items: SRSItem[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEYS.SRS_ITEMS, JSON.stringify(items));
    } catch (e) {
      console.warn("Storage write failed", e);
    }
  }

  // Record SRS review
  public recordSRSReview(srsItemId: string, grade: number): { updatedItem: SRSItem | null; allItems: SRSItem[] } {
    const items = this.loadSRSItems();
    const idx = items.findIndex((i) => i.id === srsItemId);
    if (idx === -1) return { updatedItem: null, allItems: items };

    const item = items[idx];
    const result = calculateSM2(
      grade,
      item.repetitions,
      item.intervalDays,
      item.easeFactor,
      new Date()
    );

    const updated: SRSItem = {
      ...item,
      intervalDays: result.intervalDays,
      repetitions: result.repetitions,
      easeFactor: result.easeFactor,
      dueDate: result.dueDate,
      lastReviewedDate: new Date().toISOString(),
      correctCount: grade >= 3 ? item.correctCount + 1 : item.correctCount,
      incorrectCount: grade < 3 ? item.incorrectCount + 1 : item.incorrectCount,
      masteryLevel: result.masteryLevel,
    };

    items[idx] = updated;
    this.saveSRSItems(items);

    // Update Learner Model demonstrated retention
    const currentModel = this.loadLearnerModel();
    const gameState = this.loadGamificationState();
    const completedCount = Object.keys(gameState.completedLessons).length;
    const mastery = computeSkillMastery(items, currentModel.mistakes, completedCount);
    this.saveLearnerModel({
      ...currentModel,
      skills: mastery.skills,
      overallMastery: mastery.overallMastery,
      progressPercentage: mastery.progressPercentage,
    });

    return { updatedItem: updated, allItems: items };
  }

  // Load Quests
  public loadQuests(): DailyQuest[] {
    if (typeof window === "undefined") return INITIAL_DAILY_QUESTS;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUESTS);
      return data ? JSON.parse(data) : INITIAL_DAILY_QUESTS;
    } catch {
      return INITIAL_DAILY_QUESTS;
    }
  }

  public saveQuests(quests: DailyQuest[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEYS.QUESTS, JSON.stringify(quests));
    } catch (e) {
      console.warn("Storage write failed", e);
    }
  }

  // Load Achievements
  public loadAchievements(): Achievement[] {
    if (typeof window === "undefined") return INITIAL_ACHIEVEMENTS;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      return data ? JSON.parse(data) : INITIAL_ACHIEVEMENTS;
    } catch {
      return INITIAL_ACHIEVEMENTS;
    }
  }

  public saveAchievements(achievements: Achievement[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
    } catch (e) {
      console.warn("Storage write failed", e);
    }
  }

  // Load Learner Model (Demonstrated Mastery & Mistakes)
  public loadLearnerModel(): LearnerModel {
    if (typeof window === "undefined") return INITIAL_LEARNER_MODEL;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LEARNER_MODEL);
      return data ? { ...INITIAL_LEARNER_MODEL, ...JSON.parse(data) } : INITIAL_LEARNER_MODEL;
    } catch {
      return INITIAL_LEARNER_MODEL;
    }
  }

  public saveLearnerModel(model: LearnerModel): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEYS.LEARNER_MODEL, JSON.stringify(model));
    } catch (e) {
      console.warn("Storage write failed for learner model", e);
    }
  }

  // Record a structured pedagogical mistake
  public recordMistake(
    mistake: Omit<MistakeRecord, "id" | "timestamp" | "resolved" | "reviewCount">
  ): MistakeRecord {
    const currentModel = this.loadLearnerModel();
    const newRecord: MistakeRecord = {
      ...mistake,
      id: `err_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
      resolved: false,
      reviewCount: 0,
    };

    const updatedMistakes = [newRecord, ...currentModel.mistakes].slice(0, 100); // retain recent 100
    const srsItems = this.loadSRSItems();
    const gameState = this.loadGamificationState();
    const completedCount = Object.keys(gameState.completedLessons).length;

    const mastery = computeSkillMastery(srsItems, updatedMistakes, completedCount);
    const updatedModel: LearnerModel = {
      ...currentModel,
      mistakes: updatedMistakes,
      skills: mastery.skills,
      overallMastery: mastery.overallMastery,
      progressPercentage: mastery.progressPercentage,
    };

    this.saveLearnerModel(updatedModel);
    return newRecord;
  }

  // Resolve mistakes by concept (e.g. after targeted practice)
  public resolveMistakesByConcept(concept: string): void {
    const currentModel = this.loadLearnerModel();
    const updatedMistakes = currentModel.mistakes.map((m) =>
      m.concept === concept ? { ...m, resolved: true, reviewCount: m.reviewCount + 1 } : m
    );

    const srsItems = this.loadSRSItems();
    const gameState = this.loadGamificationState();
    const completedCount = Object.keys(gameState.completedLessons).length;

    const mastery = computeSkillMastery(srsItems, updatedMistakes, completedCount);
    const updatedModel: LearnerModel = {
      ...currentModel,
      mistakes: updatedMistakes,
      skills: mastery.skills,
      overallMastery: mastery.overallMastery,
      progressPercentage: mastery.progressPercentage,
    };

    this.saveLearnerModel(updatedModel);
  }

  // Record Lesson Completion with idempotency check
  public recordLessonCompletion(params: {
    lessonId: string;
    xpEarned: number;
    score: number;
    transactionId: string;
    nextLessonId?: string;
  }): { success: boolean; duplicate: boolean; updatedState: GamificationState } {
    const currentState = this.loadGamificationState();

    // Check duplicate transaction ID
    let txs: string[] = [];
    try {
      txs = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMPLETION_TXS) || "[]");
    } catch {
      txs = [];
    }

    if (txs.includes(params.transactionId)) {
      return { success: true, duplicate: true, updatedState: currentState };
    }

    // Save transaction ID
    txs.push(params.transactionId);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.COMPLETION_TXS, JSON.stringify(txs));
    }

    // Calculate streak
    const todayStr = getLocalDateString();
    const streakResult = updateStreak(currentState, todayStr);

    const newXp = currentState.xp + params.xpEarned;
    const newLevel = calculateLevel(newXp);

    const unlocked = new Set(currentState.unlockedLessons);
    if (params.nextLessonId) {
      unlocked.add(params.nextLessonId);
    }

    const completed = { ...currentState.completedLessons };
    const prevAttempts = completed[params.lessonId]?.attempts || 0;
    completed[params.lessonId] = {
      completedAt: new Date().toISOString(),
      score: Math.max(params.score, completed[params.lessonId]?.score || 0),
      attempts: prevAttempts + 1,
    };

    const updatedState: GamificationState = {
      ...currentState,
      xp: newXp,
      level: newLevel,
      streak: streakResult.newStreak,
      streakFreeze: streakResult.updatedStreakFreeze,
      lastActiveDate: todayStr,
      gems: currentState.gems + 10,
      unlockedLessons: Array.from(unlocked),
      completedLessons: completed,
    };

    this.saveGamificationState(updatedState);

    // Update quests
    const quests = this.loadQuests().map((q) => {
      let progress = q.progress;
      if (q.category === "xp") progress += params.xpEarned;
      if (q.category === "lessons") progress += 1;
      const isCompleted = progress >= q.target;
      return { ...q, progress, isCompleted };
    });
    this.saveQuests(quests);

    // Update achievements
    const achievements = this.loadAchievements().map((a) => {
      let prog = a.progress;
      if (a.id === "first_step") prog = 1;
      if (a.id === "centurion_xp") prog = newXp;
      if (a.id === "streak_flame_3") prog = streakResult.newStreak;
      if (a.id === "streak_flame_7") prog = streakResult.newStreak;

      const isUnlocked = a.isUnlocked || prog >= a.target;
      return {
        ...a,
        progress: prog,
        isUnlocked,
        unlockedAt: isUnlocked && !a.unlockedAt ? new Date().toISOString() : a.unlockedAt,
      };
    });
    this.saveAchievements(achievements);

    // Update Learner Model (Demonstrated Mastery & Retention)
    const srsItems = this.loadSRSItems();
    const currentModel = this.loadLearnerModel();
    const completedCount = Object.keys(completed).length;
    const mastery = computeSkillMastery(srsItems, currentModel.mistakes, completedCount);
    this.saveLearnerModel({
      ...currentModel,
      skills: mastery.skills,
      overallMastery: mastery.overallMastery,
      progressPercentage: mastery.progressPercentage,
    });

    return { success: true, duplicate: false, updatedState };
  }

  // Reset progress with confirmation
  public resetAllProgress(): void {
    if (typeof window === "undefined") return;
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
  }
}
