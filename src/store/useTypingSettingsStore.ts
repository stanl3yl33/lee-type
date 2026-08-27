import { create } from "zustand";
import { persist } from "zustand/middleware";

type TypingModeType = "time" | "words";
type TimePresetType = 15 | 30 | 60 | 120 | "custom";
type WordPresetType = 10 | 25 | 50 | 100 | "custom";

type CaretStyle = "off" | "default" | "block" | "underline";

type FontSize = "small" | "medium" | "large";
type FontFamily =
  | "geist-mono"
  | "fira-code"
  | "jetbrains-mono"
  | "roboto-mono"
  | "space-mono"
  | "courier-prime"
  | "nunito"
  | "comic-neue";

type QuickRestart = "off" | "tab" | "esc" | "enter";

type TypingSettingState = {
  mode: TypingModeType;

  timeMode: {
    preset: TimePresetType;
    customDuration: number;
  };

  wordMode: {
    preset: WordPresetType;
    customLength: number;
  };

  caretStyle: CaretStyle;
  fontSize: FontSize;
  fontFamily: FontFamily;
  quickRestart: QuickRestart;

  setMode: (mode: TypingModeType) => void;
  setTimePreset: (value: TimePresetType) => void;
  setWordPreset: (value: WordPresetType) => void;
  setCustomTime: (value: number) => void;
  setCustomLength: (value: number) => void;
  setCaretStyle: (style: CaretStyle) => void;
  setFontSize: (size: FontSize) => void;
  setFontFamily: (font: FontFamily) => void;
  setQuickRestart: (key: QuickRestart) => void;
};

// use 'persist' middleware such that the user's settings get saved across page reloads
const useTypingSettingsStore = create<TypingSettingState>()(
  persist(
    (set): TypingSettingState => ({
      mode: "time",
      timeMode: {
        preset: 30,
        customDuration: 60,
      },
      wordMode: {
        preset: 25,
        customLength: 40,
      },
      caretStyle: "default",
      fontSize: "medium",
      fontFamily: "geist-mono",
      quickRestart: "off",
      setMode: (mode) => set({ mode }),
      setTimePreset: (preset) =>
        set((s) => ({ timeMode: { ...s.timeMode, preset } })),
      setWordPreset: (preset) =>
        set((s) => ({ wordMode: { ...s.wordMode, preset } })),
      setCustomTime: (customTime) =>
        set((s) => ({
          timeMode: { ...s.timeMode, customDuration: customTime },
        })),
      setCustomLength: (customLengthVal) =>
        set((s) => ({
          wordMode: { ...s.wordMode, customLength: customLengthVal },
        })),
      setCaretStyle: (caretStyle) => set({ caretStyle }),
      setFontSize: (fontSize) => set({ fontSize }),
      setFontFamily: (fontFamily) => set({ fontFamily }),
      setQuickRestart: (quickRestart) => set({ quickRestart }),
    }),
    { name: "typing-settings-store" },
  ),
);

export default useTypingSettingsStore;
