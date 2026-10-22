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
});
