import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PRESET_THEMES, Theme } from "@/styles/themes";

type ThemeState = {
  activeTheme: Theme;
  customThemes: Theme[];
  setActiveTheme: (theme: Theme) => void;
  addCustomTheme: (theme: Theme) => void;
  removeCustomTheme: (name: string) => void;
};

const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      activeTheme: PRESET_THEMES[0],
      customThemes: [],
      setActiveTheme: (theme) => set({ activeTheme: theme }),
      addCustomTheme: (theme) =>
        set((state) => ({
          customThemes: [...state.customThemes, theme],
        })),
      removeCustomTheme: (name) =>
        set((state) => ({
          customThemes: state.customThemes.filter((t) => t.name !== name),
        })),
    }),
    { name: "theme-store" },
  ),
);

export default useThemeStore;
