"use client";

import useThemeStore from "@/store/useThemeStore";

// applies active theme as css variable at root level
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((state) => state.activeTheme);

  return (
    <div
      style={
        {
          "--color-correct": theme.correct,
          "--color-incorrect": theme.incorrect,
          "--color-untyped": theme.untyped,
          "--color-cursor": theme.cursor,
          "--color-accent": theme.accent,
          "--color-background": theme.background,
          minHeight: "100vh",
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
