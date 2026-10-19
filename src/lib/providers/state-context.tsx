"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  UserPreferences,
  GamificationState,
  DailyQuest,
  Achievement,
  SRSItem,
  ThemeId,
  ColorMode,
} from "@/types";
import { AppDataStore, DEFAULT_PREFERENCES } from "../database/store";
import { INITIAL_GAMIFICATION_STATE } from "../gamification/engine";

interface AppContextType {
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  gamification: GamificationState;
  quests: DailyQuest[];
  achievements: Achievement[];
  srsItems: SRSItem[];
  recordLessonCompletion: (params: {
    lessonId: string;
    xpEarned: number;
    score: number;
    transactionId: string;
    nextLessonId?: string;
  }) => { success: boolean; duplicate: boolean };
  recordSRSReview: (srsItemId: string, grade: number) => void;
  resetAllProgress: () => void;
  isLoaded: boolean;
  syncStatus: "local" | "cloud";
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [gamification, setGamification] = useState<GamificationState>(INITIAL_GAMIFICATION_STATE);
  const [quests, setQuests] = useState<DailyQuest[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [srsItems, setSrsItems] = useState<SRSItem[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [syncStatus] = useState<"local" | "cloud">("local");

  const store = AppDataStore.getInstance();

  // Initial load
  useEffect(() => {
    const prefs = store.loadPreferences();
    const game = store.loadGamificationState();
    const q = store.loadQuests();
    const a = store.loadAchievements();
    const s = store.loadSRSItems();

    setPreferences(prefs);
    setGamification(game);
    setQuests(q);
    setAchievements(a);
    setSrsItems(s);
    setIsLoaded(true);
  }, []);

  // Theme & Dark mode sync with DOM
  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;

    // Set Theme
    root.setAttribute("data-theme", preferences.theme);

    // Set Dark Mode
    if (preferences.colorMode === "dark") {
      root.classList.add("dark");
    } else if (preferences.colorMode === "light") {
      root.classList.remove("dark");
    } else {
      // System mode
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }, [preferences.theme, preferences.colorMode]);

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences((prev) => {
      const next = { ...prev, ...updates };
      store.savePreferences(next);
      return next;
    });
  };

  const recordLessonCompletion = (params: {
    lessonId: string;
    xpEarned: number;
    score: number;
    transactionId: string;
    nextLessonId?: string;
  }) => {
    const res = store.recordLessonCompletion(params);
    setGamification(res.updatedState);
    setQuests(store.loadQuests());
    setAchievements(store.loadAchievements());
    return { success: res.success, duplicate: res.duplicate };
  };

  const recordSRSReview = (srsItemId: string, grade: number) => {
    const res = store.recordSRSReview(srsItemId, grade);
    setSrsItems(res.allItems);
    // Also reward 5 XP for reviewing
    setGamification((prev) => {
      const next = { ...prev, xp: prev.xp + 5 };
      store.saveGamificationState(next);
      return next;
    });
  };

  const resetAllProgress = () => {
    store.resetAllProgress();
    setPreferences(DEFAULT_PREFERENCES);
    setGamification(INITIAL_GAMIFICATION_STATE);
    setQuests(store.loadQuests());
    setAchievements(store.loadAchievements());
    setSrsItems([]);
  };

  return (
    <AppContext.Provider
      value={{
        preferences,
        updatePreferences,
        gamification,
        quests,
        achievements,
        srsItems,
        recordLessonCompletion,
        recordSRSReview,
        resetAllProgress,
        isLoaded,
        syncStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
