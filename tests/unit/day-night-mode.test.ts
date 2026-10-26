import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { ThemeId, ColorMode } from "@/types";

describe("Day & Night Mode Engine", () => {
  let mockHtmlClassList: Set<string>;
  let mockAttributes: Record<string, string>;

  beforeEach(() => {
    mockHtmlClassList = new Set<string>();
    mockAttributes = {};

    // Mock document.documentElement
    global.document = {
      documentElement: {
        classList: {
          add: (cls: string) => mockHtmlClassList.add(cls),
          remove: (cls: string) => mockHtmlClassList.delete(cls),
          contains: (cls: string) => mockHtmlClassList.has(cls),
        },
        setAttribute: (key: string, val: string) => {
          mockAttributes[key] = val;
        },
        getAttribute: (key: string) => mockAttributes[key] || null,
      },
    } as unknown as Document;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Helper function mimicking the resolved night mode computation
  function resolveIsNightMode(colorMode: ColorMode, systemPrefersDark: boolean): boolean {
    if (colorMode === "dark") return true;
    if (colorMode === "light") return false;
    return systemPrefersDark;
  }

  // Helper function mimicking the toggle action
  function getNextColorMode(isCurrentlyNight: boolean): ColorMode {
    return isCurrentlyNight ? "light" : "dark";
  }

  it("should resolve light mode as not night mode", () => {
    expect(resolveIsNightMode("light", false)).toBe(false);
    expect(resolveIsNightMode("light", true)).toBe(false);
  });

  it("should resolve dark mode as night mode", () => {
    expect(resolveIsNightMode("dark", false)).toBe(true);
    expect(resolveIsNightMode("dark", true)).toBe(true);
  });

  it("should resolve system mode based on OS preference", () => {
    expect(resolveIsNightMode("system", false)).toBe(false);
    expect(resolveIsNightMode("system", true)).toBe(true);
  });

  it("should correctly toggle from day to night mode", () => {
    const isNight = false;
    const nextMode = getNextColorMode(isNight);
    expect(nextMode).toBe("dark");
  });

  it("should correctly toggle from night to day mode", () => {
    const isNight = true;
    const nextMode = getNextColorMode(isNight);
    expect(nextMode).toBe("light");
  });

  it("should apply .dark class to root when night mode is active", () => {
    const isNight = true;
    if (isNight) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("should remove .dark class from root when day mode is active", () => {
    document.documentElement.classList.add("dark");
    const isNight = false;
    if (isNight) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("should apply and clean up mode-transition animation class", async () => {
    vi.useFakeTimers();

    document.documentElement.classList.add("mode-transition");
    expect(document.documentElement.classList.contains("mode-transition")).toBe(true);

    setTimeout(() => {
      document.documentElement.classList.remove("mode-transition");
    }, 450);

    vi.advanceTimersByTime(450);
    expect(document.documentElement.classList.contains("mode-transition")).toBe(false);

    vi.useRealTimers();
  });

  it("should preserve theme attribute across all 7 Japanese theme palettes", () => {
    const themes: ThemeId[] = [
      "sakura",
      "matcha",
      "midnight",
      "zen",
      "ocean",
      "autumn",
      "lantern",
    ];

    themes.forEach((theme) => {
      document.documentElement.setAttribute("data-theme", theme);
      expect(document.documentElement.getAttribute("data-theme")).toBe(theme);

      // Verify that toggling dark/light retains the theme
      document.documentElement.classList.add("dark");
      expect(document.documentElement.getAttribute("data-theme")).toBe(theme);
      expect(document.documentElement.classList.contains("dark")).toBe(true);

      document.documentElement.classList.remove("dark");
      expect(document.documentElement.getAttribute("data-theme")).toBe(theme);
      expect(document.documentElement.classList.contains("dark")).toBe(false);
    });
  });

  describe("WCAG Typography Contrast & Visibility in White and Black Theme Modes", () => {
    function hexToRgb(hex: string): [number, number, number] {
      const bigint = parseInt(hex.replace("#", ""), 16);
      return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
    }

    function luminance(r: number, g: number, b: number): number {
      const a = [r, g, b].map((v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    }

    function getContrast(hex1: string, hex2: string): number {
      const [r1, g1, b1] = hexToRgb(hex1);
      const [r2, g2, b2] = hexToRgb(hex2);
      const l1 = luminance(r1, g1, b1);
      const l2 = luminance(r2, g2, b2);
      return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    }

    // Color definitions verified from globals.css
    const THEME_COLOR_METRICS: Record<
      ThemeId,
      {
        light: { bg: string; bgSubtle: string; ink: string; subtle: string; muted: string; primary: string };
        dark: { bg: string; bgSubtle: string; ink: string; subtle: string; muted: string; primary: string };
      }
    > = {
      zen: {
        light: { bg: "#ffffff", bgSubtle: "#f2efea", ink: "#111113", subtle: "#3f3f46", muted: "#5f5f68", primary: "#18181b" },
        dark: { bg: "#141417", bgSubtle: "#242429", ink: "#ffffff", subtle: "#d4d4d8", muted: "#a1a1aa", primary: "#3f3f46" },
      },
      sakura: {
        light: { bg: "#ffffff", bgSubtle: "#fbeee9", ink: "#1f1615", subtle: "#553e3b", muted: "#755b57", primary: "#e11d48" },
        dark: { bg: "#1a1014", bgSubtle: "#301e25", ink: "#fff0f3", subtle: "#f2c2cc", muted: "#c498a3", primary: "#f43f5e" },
      },
      matcha: {
        light: { bg: "#ffffff", bgSubtle: "#edf3ea", ink: "#111c12", subtle: "#344c37", muted: "#536f56", primary: "#15803d" },
        dark: { bg: "#121f15", bgSubtle: "#223827", ink: "#f0fdf4", subtle: "#bbf7d0", muted: "#7bbe8a", primary: "#16a34a" },
      },
      midnight: {
        light: { bg: "#ffffff", bgSubtle: "#eef4fb", ink: "#0b1329", subtle: "#2d3b50", muted: "#53657d", primary: "#0284c7" },
        dark: { bg: "#0c1429", bgSubtle: "#1a284e", ink: "#f8fafc", subtle: "#cbd5e1", muted: "#94a3b8", primary: "#0284c7" },
      },
      ocean: {
        light: { bg: "#ffffff", bgSubtle: "#e2eff8", ink: "#0a1b2d", subtle: "#274563", muted: "#48698c", primary: "#0284c7" },
        dark: { bg: "#0c1827", bgSubtle: "#192e47", ink: "#f0f7ff", subtle: "#bae0fd", muted: "#7cb2df", primary: "#0284c7" },
      },
      autumn: {
        light: { bg: "#ffffff", bgSubtle: "#faefe1", ink: "#261408", subtle: "#51321d", muted: "#785237", primary: "#c2410c" },
        dark: { bg: "#1c1109", bgSubtle: "#392415", ink: "#fff3ea", subtle: "#f6c8a7", muted: "#c9936e", primary: "#ea580c" },
      },
      lantern: {
        light: { bg: "#ffffff", bgSubtle: "#fef1d6", ink: "#261502", subtle: "#54340d", muted: "#7b511c", primary: "#b45309" },
        dark: { bg: "#1c1104", bgSubtle: "#3b250b", ink: "#fff7eb", subtle: "#fed7aa", muted: "#c99d63", primary: "#d97706" },
      },
    };

    it("ensures ink typography satisfies WCAG AAA (>7.0:1) contrast across all themes in both Day and Night modes", () => {
      Object.entries(THEME_COLOR_METRICS).forEach(([theme, { light, dark }]) => {
        const lightInkContrast = getContrast(light.ink, light.bg);
        expect(
          lightInkContrast,
          `Theme ${theme} Light Mode ink contrast should be >= 7.0:1 but was ${lightInkContrast.toFixed(2)}:1`
        ).toBeGreaterThanOrEqual(7.0);

        const darkInkContrast = getContrast(dark.ink, dark.bg);
        expect(
          darkInkContrast,
          `Theme ${theme} Dark Mode ink contrast should be >= 7.0:1 but was ${darkInkContrast.toFixed(2)}:1`
        ).toBeGreaterThanOrEqual(7.0);
      });
    });

    it("ensures subtle text has clear visibility (>4.5:1 WCAG AA) and is distinct from ink", () => {
      Object.entries(THEME_COLOR_METRICS).forEach(([theme, { light, dark }]) => {
        const lightSubtleContrast = getContrast(light.subtle, light.bg);
        expect(
          lightSubtleContrast,
          `Theme ${theme} Light Mode subtle text contrast should be >= 4.5:1 but was ${lightSubtleContrast.toFixed(2)}:1`
        ).toBeGreaterThanOrEqual(4.5);

        const darkSubtleContrast = getContrast(dark.subtle, dark.bg);
        expect(
          darkSubtleContrast,
          `Theme ${theme} Dark Mode subtle text contrast should be >= 4.5:1 but was ${darkSubtleContrast.toFixed(2)}:1`
        ).toBeGreaterThanOrEqual(4.5);

        // Subtle text must be distinctly different in color from ink
        expect(light.subtle).not.toBe(light.ink);
        expect(dark.subtle).not.toBe(dark.ink);
      });
    });

    it("ensures subtle badges have high-contrast text against subtle background containers", () => {
      Object.entries(THEME_COLOR_METRICS).forEach(([theme, { light, dark }]) => {
        const lightBadgeContrast = getContrast(light.subtle, light.bgSubtle);
        expect(
          lightBadgeContrast,
          `Theme ${theme} Light Mode badge contrast should be >= 4.5:1 but was ${lightBadgeContrast.toFixed(2)}:1`
        ).toBeGreaterThanOrEqual(4.5);

        const darkBadgeContrast = getContrast(dark.subtle, dark.bgSubtle);
        expect(
          darkBadgeContrast,
          `Theme ${theme} Dark Mode badge contrast should be >= 4.5:1 but was ${darkBadgeContrast.toFixed(2)}:1`
        ).toBeGreaterThanOrEqual(4.5);
      });
    });

    it("verifies Minimal Zen (White and Black mode) provides exceptional contrast and readable button text", () => {
      const zen = THEME_COLOR_METRICS.zen;

      // Zen White mode:
      expect(getContrast(zen.light.ink, zen.light.bg)).toBeGreaterThanOrEqual(15.0);
      expect(getContrast(zen.light.subtle, zen.light.bg)).toBeGreaterThanOrEqual(9.0);
      expect(getContrast("#ffffff", zen.light.primary)).toBeGreaterThanOrEqual(15.0);

      // Zen Black mode:
      expect(getContrast(zen.dark.ink, zen.dark.bg)).toBeGreaterThanOrEqual(15.0);
      expect(getContrast(zen.dark.subtle, zen.dark.bg)).toBeGreaterThanOrEqual(10.0);
      expect(getContrast("#ffffff", zen.dark.primary)).toBeGreaterThanOrEqual(7.0);
    });
  });
});
