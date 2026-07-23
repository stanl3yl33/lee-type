"use client";

import useThemeStore from "@/store/useThemeStore";
import { PRESET_THEMES, Theme } from "@/styles/themes";

export default function SettingPage() {
  const activeTheme = useThemeStore((state) => state.activeTheme);
  const setActiveTheme = useThemeStore((state) => state.setActiveTheme);

  return (
    <div className="max-w-5xl mx-auto px-8 py-6 font-mono">
      {/* theme section */}
      <section className="mb-12">
        {/* section header */}
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-untyped text-sm">theme</h2>
          <div className="h-px flex-1 bg-untyped opacity-20" />
        </div>

        {/* preset theme grid */}
        <div className="grid grid-cols-3 gap-2">
          {PRESET_THEMES.map((theme) => (
            <ThemeButton
              key={theme.name}
              theme={theme}
              isActive={activeTheme.name === theme.name}
              onSelect={() => setActiveTheme(theme)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

type ThemeButtonProps = {
  theme: Theme;
  isActive: boolean;
  onSelect: () => void;
};

function ThemeButton({ theme, isActive, onSelect }: ThemeButtonProps) {
  return (
    <button
      onClick={onSelect}
      className={`
        flex items-center justify-between
        w-full px-4 py-3 rounded text-sm font-mono
        transition-all duration-150
        ${
          isActive
            ? "ring-2 ring-offset-1 ring-offset-background ring-accent"
            : "hover:opacity-90"
        }
      `}
      style={{ backgroundColor: theme.background }}
    >
      {/* theme name */}
      <span style={{ color: theme.accent }}>{theme.name}</span>

      {/* color preview dots */}
      <div className="flex items-center gap-1">
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: theme.correct }}
        />
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: theme.incorrect }}
        />
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: theme.untyped }}
        />
      </div>
    </button>
  );
}
