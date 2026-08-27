"use client";

import useThemeStore from "@/store/useThemeStore";
import { PRESET_THEMES, Theme } from "@/styles/themes";
import useTypingSettingsStore from "@/store/useTypingSettingsStore";
import { useState } from "react";
import { ToggleGroup } from "@/components/ui/ToggleGroup";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { CustomThemeCreator } from "@/components/settings/CustomThemeCreator";

export default function SettingPage() {
  const activeTheme = useThemeStore((state) => state.activeTheme);
  const setActiveTheme = useThemeStore((state) => state.setActiveTheme);
  const customThemes = useThemeStore((state) => state.customThemes);
  const removeCustomTheme = useThemeStore((state) => state.removeCustomTheme);
  const [toggleTheme, setToggleTheme] = useState<boolean>(true);

  const caretStyle = useTypingSettingsStore((state) => state.caretStyle);
  const setCaretStyle = useTypingSettingsStore((state) => state.setCaretStyle);
  const [toggleCaret, setToggleCaret] = useState<boolean>(true);

  const fontSize = useTypingSettingsStore((state) => state.fontSize);
  const setFontSize = useTypingSettingsStore((state) => state.setFontSize);
  const fontFamily = useTypingSettingsStore((state) => state.fontFamily);
  const setFontFamily = useTypingSettingsStore((state) => state.setFontFamily);
  const [toggleFont, setToggleFont] = useState<boolean>(true);

  const [themeView, setThemeView] = useState<"preset" | "custom">("preset");
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const quickRestart = useTypingSettingsStore((state) => state.quickRestart);
  const setQuickRestart = useTypingSettingsStore(
    (state) => state.setQuickRestart,
  );

  return (
    <div className="max-w-5xl mx-auto px-8 py-6">
      {/* behavior / quick restart section */}
      {/* quick restart */}
      <div>
        <p className="text-untyped text-xs mb-3">quick restart</p>
        <ToggleGroup
          options={[
            { label: "off", value: "off" },
            { label: "tab", value: "tab" },
            { label: "esc", value: "esc" },
            { label: "enter", value: "enter" },
          ]}
          selected={quickRestart}
          onChange={setQuickRestart}
        />
      </div>

      {/* font size section */}
      <section className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <button
            className="text-untyped text-sm hover:text-accent transition-colors"
            onClick={() => setToggleFont(!toggleFont)}
          >
            font
          </button>
          <div className="h-px flex-1 bg-untyped opacity-20" />
          <span className="text-untyped text-xs">{toggleFont ? "▾" : "▸"}</span>
        </div>

        {toggleFont && (
          <div className="flex flex-col gap-8">
            {/* font size */}
            <div>
              <p className="text-untyped text-xs mb-3">size</p>
              <ToggleGroup
                options={[
                  { label: "small", value: "small" },
                  { label: "medium", value: "medium" },
                  { label: "large", value: "large" },
                ]}
                selected={fontSize}
                onChange={setFontSize}
              />
            </div>
            <div>
              <p className="text-untyped text-xs mb-3">Font Family</p>

              <ToggleGroup
                options={[
                  {
                    label: "Geist Mono",
                    value: "geist-mono",
                    style: { fontFamily: "var(--font-geist-mono)" },
                  },
                  {
                    label: "Fira Code",
                    value: "fira-code",
                    style: { fontFamily: "var(--font-fira-code)" },
                  },
                  {
                    label: "JetBrains Mono",
                    value: "jetbrains-mono",
                    style: { fontFamily: "var(--font-jetbrains-mono)" },
                  },
                  {
                    label: "Roboto Mono",
                    value: "roboto-mono",
                    style: { fontFamily: "var(--font-roboto-mono)" },
                  },
                  {
                    label: "Space Mono",
                    value: "space-mono",
                    style: { fontFamily: "var(--font-space-mono)" },
                  },
                  {
                    label: "Courier Prime",
                    value: "courier-prime",
                    style: { fontFamily: "var(--font-courier-prime)" },
                  },
                  {
                    label: "Nunito",
                    value: "nunito",
                    style: { fontFamily: "var(--font-nunito)" },
                  },
                  {
                    label: "Comic Neue",
                    value: "comic-neue",
                    style: { fontFamily: "var(--font-comic-neue)" },
                  },
                ]}
                selected={fontFamily}
                onChange={setFontFamily}
              />
            </div>
          </div>
        )}
      </section>

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
            onClick={() => setToggleTheme(!toggleTheme)}
          >
            theme
          </button>
          <div className="h-px flex-1 bg-untyped opacity-20" />
          <span className="text-untyped text-xs">
            {toggleTheme ? "▾" : "▸"}
          </span>
        </div>

        {toggleTheme && (
          <div className="flex flex-col gap-6">
            {/* preset / custom toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setThemeView("preset")}
                className={`px-4 py-1.5 rounded text-sm transition-colors ${
                  themeView === "preset"
                    ? "text-background bg-accent"
                    : "text-untyped hover:text-correct"
                }`}
              >
                preset
              </button>
              <button
                onClick={() => setThemeView("custom")}
                className={`px-4 py-1.5 rounded text-sm transition-colors ${
                  themeView === "custom"
                    ? "text-background bg-accent"
                    : "text-untyped hover:text-correct"
                }`}
              >
                custom
              </button>
            </div>

            {/* preset grid or custom creator based on toggle */}
            {themeView === "preset" ? (
              <div className="flex flex-col gap-6">
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

                {customThemes.length > 0 && (
                  <div className="flex flex-col gap-3">
                    <p className="text-untyped text-xs">custom</p>
                    <div className="grid grid-cols-3 gap-2">
                      {customThemes.map((theme: Theme) => (
                        <div key={theme.name} className="relative group">
                          <ThemeButton
                            theme={theme}
                            isActive={activeTheme.name === theme.name}
                            onSelect={() => setActiveTheme(theme)}
                          />
                          {/* delete button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setPendingDelete(theme.name);
                            }}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-incorrect text-background text-xs items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity flex"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <CustomThemeCreator />
            )}
          </div>
        )}
      </section>
      <ConfirmModal
        isOpen={pendingDelete !== null}
        message={`delete "${pendingDelete}"?`}
        onConfirm={() => {
          if (pendingDelete) {
            removeCustomTheme(pendingDelete);
            if (activeTheme.name === pendingDelete) {
              setActiveTheme(PRESET_THEMES[0]);
            }
          }
          setPendingDelete(null);
        }}
        onCancel={() => setPendingDelete(null)}
      />
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
