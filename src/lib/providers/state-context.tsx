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
  isNightMode: boolean;
  toggleDayNightMode: () => void;
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
  const [isNightMode, setIsNightMode] = useState<boolean>(false);
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

  // Theme & Day/Night Mode sync with DOM
  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;

    // Set Theme
    root.setAttribute("data-theme", preferences.theme);

    // Calculate active night mode
    const calculateIsNight = () => {
      if (preferences.colorMode === "dark") return true;
      if (preferences.colorMode === "light") return false;
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    };

    const night = calculateIsNight();
    setIsNightMode(night);

    if (night) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [preferences.theme, preferences.colorMode]);

  // Listen for OS system dark mode changes if set to system
  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = (e: MediaQueryListEvent) => {
      if (preferences.colorMode === "system") {
        setIsNightMode(e.matches);
        if (e.matches) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    };
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [preferences.colorMode]);

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences((prev) => {
      const next = { ...prev, ...updates };
      store.savePreferences(next);
      return next;
    });
  };

  const toggleDayNightMode = () => {
    if (typeof window !== "undefined") {
      // Add smooth transition animation class for 450ms
      const root = document.documentElement;
      root.classList.add("mode-transition");
      setTimeout(() => {
        root.classList.remove("mode-transition");
      }, 450);
    }

    // Toggle between light and dark based on currently resolved night status
    const nextMode: ColorMode = isNightMode ? "light" : "dark";
    updatePreferences({ colorMode: nextMode });
  };

  // Global keyboard shortcut: Pressing 'D' (when not in an input/textarea) toggles Day/Night mode
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }

      if ((e.key === "d" || e.key === "D") && !e.ctrlKey && !e.altKey && !e.metaKey) {
        e.preventDefault();
        toggleDayNightMode();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isNightMode]);

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
        isNightMode,
        toggleDayNightMode,
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
