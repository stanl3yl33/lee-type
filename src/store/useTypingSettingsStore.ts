import { create } from "zustand";
import { persist } from "zustand/middleware";

type TypingModeType = "time" | "words";
type TimePresetType = 15 | 30 | 60 | 120 | "custom";
type WordPresetType = 10 | 25 | 50 | 100 | "custom";

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

  setMode: (mode: TypingModeType) => void;
  setTimePreset: (value: TimePresetType) => void;
  setWordPreset: (value: WordPresetType) => void;
  setCustomTime: (value: number) => void;
  setCustomLength: (value: number) => void;
};

// use 'persist' middleware such that the user's settings get saved across page reloads
const useTypingSettingsStore = create<TypingSettingState>()(
  persist(
    (set) => ({
      // default mode = time
      mode: "time",

      // default settings for timeMode
      timeMode: {
        preset: 30,
        customDuration: 60,
      },

      // default setting for wordMode
      wordMode: {
        preset: 25,
        customLength: 40,
      },

      // setter functions that call set()
      setMode: (mode) => set({ mode }),

      // syntax of set: set((state) => newState)
      setTimePreset: (preset) =>
        set(
          // taking the current state s and modifying the timeMode state:
          (s) => ({
            timeMode: {
              // spread what is currently in the timeMode
              ...s.timeMode,

              // add the new preset:
              preset,
            },
          })
        ),

      setWordPreset: (preset) =>
        set(
          // taking the current state s and modifying the wordMode state:
          (s) => ({
            wordMode: {
              // spread what is currently in the wordMode
              ...s.wordMode,

              // add the new preset:
              preset,
            },
          })
        ),

      // custom time and length setters:
      setCustomTime: (customTime) =>
        set((s) => ({
          timeMode: {
            ...s.timeMode,

            // modifying the customTime
            customDuration: customTime,
          },
        })),

      setCustomLength: (customLengthVal) =>
        set((s) => ({
          wordMode: {
            ...s.wordMode,

            // modifying the customLength
            customLength: customLengthVal,
          },
        })),
    }),
    {
      name: "typing-settings-store", // key for localStorage
    }
  )
);

export default useTypingSettingsStore;
