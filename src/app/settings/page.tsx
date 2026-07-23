"use client";

import useThemeStore from "@/store/useThemeStore";
import { PRESET_THEMES, Theme } from "@/styles/themes";
import useTypingSettingsStore from "@/store/useTypingSettingsStore";
import { useState } from "react";
import { ToggleGroup } from "@/components/ui/ToggleGroup";

export default function SettingPage() {
  const activeTheme = useThemeStore((state) => state.activeTheme);
  const setActiveTheme = useThemeStore((state) => state.setActiveTheme);
  const [toggleCaret, setToggleCaret] = useState<boolean>(true);

  const caretStyle = useTypingSettingsStore((state) => state.caretStyle);
  const setCaretStyle = useTypingSettingsStore((state) => state.setCaretStyle);
  const [toggleTheme, setToggleTheme] = useState<boolean>(true);

  return (
    <div className="max-w-5xl mx-auto px-8 py-6 font-mono">
      {/* caret style section */}
      <section className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <button
            className="text-untyped text-sm hover:text-accent transition-colors"
            onClick={() => setToggleCaret(!toggleCaret)}
          >
            caret style
          </button>
          <div className="h-px flex-1 bg-untyped opacity-20" />
          <span className="text-untyped text-xs">
            {toggleCaret ? "▾" : "▸"}
          </span>
        </div>

        {toggleCaret && (
          <ToggleGroup
            options={[
              { label: "off", value: "off" },
              { label: "default", value: "default" },
              { label: "block", value: "block" },
              { label: "underline", value: "underline" },
            ]}
            selected={caretStyle}
            onChange={setCaretStyle}
          />
        )}
      </section>

      {/* theme section */}
      <section className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <button
            className="text-untyped text-sm hover:text-accent transition-colors"
            onClick={() => setToggleTheme((prev) => !prev)}
          >
            theme
          </button>
          <div className="h-px flex-1 bg-untyped opacity-20" />
          <span className="text-untyped text-xs">
            {toggleTheme ? "▾" : "▸"}
          </span>
        </div>

        {toggleTheme && (
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
        )}
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
