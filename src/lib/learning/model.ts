import {
  LearnerModel,
  SkillType,
  SkillMastery,
  MistakeRecord,
  WeakAreaSummary,
  SRSItem,
  ErrorType,
} from "@/types";

const ALL_SKILLS: SkillType[] = [
  "kana",
  "kanji",
  "vocabulary",
  "grammar",
  "listening",
  "speaking",
  "reading",
];

export const INITIAL_SKILL_MASTERY: Record<SkillType, SkillMastery> = {
  kana: { skill: "kana", level: 0, itemsAttempted: 0, itemsMastered: 0, accuracy: 0 },
  kanji: { skill: "kanji", level: 0, itemsAttempted: 0, itemsMastered: 0, accuracy: 0 },
  vocabulary: { skill: "vocabulary", level: 0, itemsAttempted: 0, itemsMastered: 0, accuracy: 0 },
  grammar: { skill: "grammar", level: 0, itemsAttempted: 0, itemsMastered: 0, accuracy: 0 },
  listening: { skill: "listening", level: 0, itemsAttempted: 0, itemsMastered: 0, accuracy: 0 },
  speaking: { skill: "speaking", level: 0, itemsAttempted: 0, itemsMastered: 0, accuracy: 0 },
  reading: { skill: "reading", level: 0, itemsAttempted: 0, itemsMastered: 0, accuracy: 0 },
};

export const INITIAL_LEARNER_MODEL: LearnerModel = {
  schemaVersion: 1,
  skills: INITIAL_SKILL_MASTERY,
  mistakes: [],
  recentPerformance: [],
  overallMastery: 0,
  progressPercentage: 0,
};

/**
 * Infer the specific grammar/language concept causing a mistake.
 */
export function classifyMistakeConcept(
  prompt: string,
  userAnswer: string,
  correctAnswer: string,
  skill: SkillType
): { concept: string; errorType: ErrorType } {
  const normCorrect = correctAnswer.trim();
  const normUser = userAnswer.trim();

  // 1. Particle Confusion
  const particles = ["は", "が", "を", "に", "で", "へ", "の", "も", "から", "まで"];
  if (
    particles.includes(normCorrect) ||
    particles.includes(normUser) ||
    prompt.includes("particle") ||
    prompt.includes("助詞")
  ) {
    const pair = [normCorrect, normUser].sort().join(" vs ");
    return {
      concept: pair.includes("vs") ? `助詞 (${pair})` : `助詞 (${normCorrect})`,
      errorType: "particle_confusion",
    };
  }

  // 2. Kana Confusion
  if (skill === "kana") {
    const pair = [normCorrect, normUser].join(" / ");
    return {
      concept: `仮名 (${pair})`,
      errorType: "kana_confusion",
    };
  }

  // 3. Verb Conjugations (te-form, nai-form, past)
  if (
    prompt.includes("te-form") ||
    prompt.includes("negative") ||
    prompt.includes("past") ||
    prompt.includes("conjugat") ||
    prompt.includes("活用")
  ) {
    return {
      concept: `動詞活用 (${normCorrect})`,
      errorType: "verb_conjugation",
    };
  }

  // 4. Kanji Readings
  if (skill === "kanji") {
    return {
      concept: `漢字の読み (${prompt})`,
      errorType: "reading_error",
    };
  }

  // 5. Listening distinction
  if (skill === "listening") {
    return {
      concept: `聴解識別 (${normCorrect})`,
      errorType: "audio_distinction",
    };
  }

  // Default vocabulary or general
  return {
    concept: `${normCorrect} (Meaning)`,
    errorType: skill === "vocabulary" ? "vocabulary_meaning" : "general_mistake",
  };
}

/**
 * Recomputes skill-by-skill mastery from demonstrated retention (SRS + accuracy).
 * Strictly separates Progress, Mastery, and XP.
 */
export function computeSkillMastery(
  srsItems: SRSItem[],
  mistakes: MistakeRecord[],
  completedLessonCount: number,
  totalLessonCount: number = 30
): { skills: Record<SkillType, SkillMastery>; overallMastery: number; progressPercentage: number } {
  const skills: Record<SkillType, SkillMastery> = { ...INITIAL_SKILL_MASTERY };

  // Calculate SRS-based retention for kana, kanji, vocabulary, grammar
  const srsByType: Record<string, SRSItem[]> = {
    kana: [],
    kanji: [],
    vocabulary: [],
    grammar: [],
  };

  srsItems.forEach((item) => {
    if (srsByType[item.type]) {
      srsByType[item.type].push(item);
    }
  });

  (["kana", "kanji", "vocabulary", "grammar"] as const).forEach((type) => {
    const items = srsByType[type] || [];
    const total = items.length;
    if (total === 0) {
      skills[type] = {
        skill: type,
        level: 0,
        itemsAttempted: 0,
        itemsMastered: 0,
        accuracy: 0,
      };
      return;
    }

    const mastered = items.filter((i) => i.masteryLevel === "mastered" || i.intervalDays >= 21).length;
    const reviewing = items.filter((i) => i.masteryLevel === "reviewing" || i.intervalDays >= 4).length;
    const totalCorrect = items.reduce((sum, i) => sum + i.correctCount, 0);
    const totalReviews = items.reduce((sum, i) => sum + i.correctCount + i.incorrectCount, 0);

    const accuracy = totalReviews > 0 ? Math.round((totalCorrect / totalReviews) * 100) : 0;
    // Mastery score formula: 60% retention depth (mastered items) + 40% historical accuracy
    const level = Math.min(100, Math.round((mastered / Math.max(total, 5)) * 60 + (accuracy / 100) * 40));

    skills[type] = {
      skill: type,
      level,
      itemsAttempted: total,
      itemsMastered: mastered,
      accuracy,
    };
  });

  // Listening, Speaking, Reading estimates based on mistakes and completion
  const unresolvedMistakesBySkill: Record<string, number> = {};
  mistakes.filter((m) => !m.resolved).forEach((m) => {
    unresolvedMistakesBySkill[m.skill] = (unresolvedMistakesBySkill[m.skill] || 0) + 1;
  });

  (["listening", "speaking", "reading"] as const).forEach((skill) => {
    const errorPenalty = (unresolvedMistakesBySkill[skill] || 0) * 8;
    const baseProgress = Math.min(100, Math.round((completedLessonCount / totalLessonCount) * 100));
    const level = Math.max(0, Math.min(100, baseProgress - errorPenalty));

    skills[skill] = {
      skill,
      level,
      itemsAttempted: completedLessonCount * 3,
      itemsMastered: Math.max(0, Math.floor(level / 10)),
      accuracy: Math.max(0, 100 - errorPenalty),
    };
  });

  // Overall demonstrated mastery: average of all 7 skills
  const skillValues = Object.values(skills).map((s) => s.level);
  const overallMastery = Math.round(
    skillValues.reduce((a, b) => a + b, 0) / skillValues.length
  );

  const progressPercentage = Math.min(
    100,
    Math.round((completedLessonCount / Math.max(totalLessonCount, 1)) * 100)
  );

  return { skills, overallMastery, progressPercentage };
}

/**
 * Extracts the user's top weak areas from unresolved mistake records.
 */
export function identifyWeakAreas(mistakes: MistakeRecord[], limit: number = 4): WeakAreaSummary[] {
  const grouped: Record<string, { mistakes: MistakeRecord[]; latest: string }> = {};

  mistakes
    .filter((m) => !m.resolved)
    .forEach((m) => {
      if (!grouped[m.concept]) {
        grouped[m.concept] = { mistakes: [], latest: m.timestamp };
      }
      grouped[m.concept].mistakes.push(m);
      if (m.timestamp > grouped[m.concept].latest) {
        grouped[m.concept].latest = m.timestamp;
      }
    });

  const summaries: WeakAreaSummary[] = Object.entries(grouped).map(([concept, data]) => {
    const latestMistake = data.mistakes[data.mistakes.length - 1];
    return {
      concept,
      skill: latestMistake.skill,
      errorCount: data.mistakes.length,
      lastMistakeDate: data.latest,
      exampleProblem: {
        prompt: latestMistake.prompt,
        userAnswer: latestMistake.userAnswer,
        correctAnswer: latestMistake.correctAnswer,
      },
    };
  });

  // Sort by highest error count first, then by most recent mistake
  return summaries
    .sort((a, b) => b.errorCount - a.errorCount || b.lastMistakeDate.localeCompare(a.lastMistakeDate))
    .slice(0, limit);
}
