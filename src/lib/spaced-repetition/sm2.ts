import { SRSItem } from "@/types";

export interface SM2Result {
  intervalDays: number;
  repetitions: number;
  easeFactor: number;
  dueDate: string;
  masteryLevel: "learning" | "reviewing" | "mastered";
  lapses: number;
}

/**
 * Calculates the next review date and intervals using the canonical SM-2 algorithm.
 * @param grade Score from 0 to 5:
 *   5 - Perfect response
 *   4 - Correct response after a hesitation
 *   3 - Correct response recalled with serious difficulty
 *   2 - Incorrect response; where the correct one seemed easy to recall
 *   1 - Incorrect response; the correct one remembered
 *   0 - Complete blackout (forgot)
 * @param repetitions Current number of consecutive successful reviews
 * @param currentInterval Current interval in days
 * @param currentEaseFactor Current ease factor (default 2.5, min 1.3)
 * @param baseDate Reference date (defaults to now)
 * @param currentLapses Prior count of lapses (forgetting after previously learning)
 */
export function calculateSM2(
  grade: number,
  repetitions: number,
  currentInterval: number,
  currentEaseFactor: number,
  baseDate: Date = new Date(),
  currentLapses: number = 0
): SM2Result {
  const clampedGrade = Math.max(0, Math.min(5, Math.round(grade)));
  let newRepetitions = repetitions;
  let newInterval = currentInterval;
  let newEaseFactor = currentEaseFactor;
  let newLapses = currentLapses;

  if (clampedGrade >= 3) {
    if (newRepetitions === 0) {
      newInterval = 1;
    } else if (newRepetitions === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(currentInterval * currentEaseFactor);
    }
    newRepetitions += 1;
  } else {
    // A lapse occurs when an item that was previously learned (repetitions > 0) is failed (grade < 3)
    if (repetitions > 0) {
      newLapses += 1;
    }
    newRepetitions = 0;
    newInterval = 1;
  }

  // Update Ease Factor (EF)
  // EF' = EF + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02))
  newEaseFactor =
    currentEaseFactor +
    (0.1 - (5 - clampedGrade) * (0.08 + (5 - clampedGrade) * 0.02));

  if (newEaseFactor < 1.3) {
    newEaseFactor = 1.3;
  }
  newEaseFactor = Math.round(newEaseFactor * 100) / 100;

  // Calculate Next Due Date
  const dueDateObj = new Date(baseDate);
  dueDateObj.setDate(dueDateObj.getDate() + newInterval);
  const dueDate = dueDateObj.toISOString();

  // Determine Mastery Level
  let masteryLevel: "learning" | "reviewing" | "mastered" = "learning";
  if (newInterval >= 21) {
    masteryLevel = "mastered";
  } else if (newInterval >= 4) {
    masteryLevel = "reviewing";
  }

  return {
    intervalDays: newInterval,
    repetitions: newRepetitions,
    easeFactor: newEaseFactor,
    dueDate,
    masteryLevel,
    lapses: newLapses,
  };
}

/**
 * Filter items that are due for review today or overdue.
 */
export function getDueItems(items: SRSItem[], targetDate: Date = new Date()): SRSItem[] {
  const targetIso = targetDate.toISOString();
  return items.filter((item) => item.dueDate <= targetIso);
}

/**
 * Create a new SRS item tracker from curriculum data
 */
export function createSRSItem(
  type: "kana" | "kanji" | "vocabulary" | "grammar" | "sentence" | "listening",
  key: string,
  japanese: string,
  reading: string,
  meaning: string
): SRSItem {
  const now = new Date().toISOString();
  return {
    id: `srs_${type}_${key}`,
    type,
    key,
    japanese,
    reading,
    meaning,
    intervalDays: 0,
    repetitions: 0,
    easeFactor: 2.5,
    dueDate: now,
    correctCount: 0,
    incorrectCount: 0,
    lapses: 0,
    history: [],
    masteryLevel: "learning",
  };
}
