"use client";

import useThemeStore from "@/store/useThemeStore";
import useTypingSettingsStore from "@/store/useTypingSettingsStore";

const FONT_FAMILY_MAP: Record<string, string> = {
  "geist-mono": "var(--font-geist-mono)",
  "fira-code": "var(--font-fira-code)",
  "jetbrains-mono": "var(--font-jetbrains-mono)",
  "roboto-mono": "var(--font-roboto-mono)",
  "space-mono": "var(--font-space-mono)",
  "courier-prime": "var(--font-courier-prime)",
  "comic-neue": "var(--font-comic-neue",
};

// applies active theme as css variable at root level
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((state) => state.activeTheme);
  const fontFamily = useTypingSettingsStore((state) => state.fontFamily);

  return (
    <div
      style={
        {
          "--color-correct": theme.correct,
          "--color-incorrect": theme.incorrect,
          "--color-extra-error": theme.extraError,
          "--color-untyped": theme.untyped,
          "--color-cursor": theme.cursor,
          "--color-accent": theme.accent,
          "--color-background": theme.background,
          backgroundColor: theme.background,
          fontFamily: FONT_FAMILY_MAP[fontFamily],
          minHeight: "100vh",
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
