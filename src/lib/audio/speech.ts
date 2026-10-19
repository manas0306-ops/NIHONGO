export type SpeechStatus =
  | "unsupported"
  | "permission_required"
  | "ready"
  | "recording"
  | "processing"
  | "result_available"
  | "error";

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isMatch: boolean;
  score: number;
}

/**
 * Japanese Text-to-Speech synthesizer using standard Web Speech API.
 */
export class JapaneseAudioSynthesizer {
  private static instance: JapaneseAudioSynthesizer;
  private voice: SpeechSynthesisVoice | null = null;
  private isSupported: boolean = false;

  private constructor() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      this.isSupported = true;
      this.initVoice();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => this.initVoice();
      }
    }
  }

  public static getInstance(): JapaneseAudioSynthesizer {
    if (!JapaneseAudioSynthesizer.instance) {
      JapaneseAudioSynthesizer.instance = new JapaneseAudioSynthesizer();
    }
    return JapaneseAudioSynthesizer.instance;
  }

  private initVoice(): void {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const voices = window.speechSynthesis.getVoices();
    // Find Japanese voice
    const jaVoice = voices.find((v) => v.lang.startsWith("ja") || v.lang.includes("JP"));
    if (jaVoice) {
      this.voice = jaVoice;
    }
  }

  public speak(text: string, speed: number = 1.0): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel(); // Stop any pending speech

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ja-JP";
      utterance.rate = Math.max(0.5, Math.min(1.5, speed));
      if (this.voice) {
        utterance.voice = this.voice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = (e) => {
        console.warn("Speech synthesis notice:", e);
        resolve(); // Graceful degradation
      };

      window.speechSynthesis.speak(utterance);
    });
  }

  public stop(): void {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }

  public checkSupport(): boolean {
    return this.isSupported;
  }
}

/**
 * Normalize Japanese string by stripping punctuation, whitespace, and normalizing full-width chars.
 */
export function normalizeJapaneseText(text: string): string {
  return text
    .replace(/[\s\u3000、。！？!?,.\-~〜]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * Compare spoken transcript against reference Japanese text.
 */
export function compareSpeechRecognition(
  spoken: string,
  reference: string
): { isMatch: boolean; score: number } {
  const normSpoken = normalizeJapaneseText(spoken);
  const normRef = normalizeJapaneseText(reference);

  if (!normSpoken || !normRef) {
    return { isMatch: false, score: 0 };
  }

  if (normSpoken === normRef) {
    return { isMatch: true, score: 100 };
  }

  // Levenshtein distance similarity calculation
  const m = normSpoken.length;
  const n = normRef.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (normSpoken[i - 1] === normRef[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(dp[i - 1][j - 1] + 1, dp[i][j - 1] + 1, dp[i - 1][j] + 1);
      }
    }
  }

  const distance = dp[m][n];
  const maxLen = Math.max(m, n);
  const similarity = Math.max(0, Math.round(((maxLen - distance) / maxLen) * 100));

  return {
    isMatch: similarity >= 75,
    score: similarity,
  };
}
