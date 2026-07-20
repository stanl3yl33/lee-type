import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PRESET_THEMES, Theme } from "@/styles/themes";

type ThemeState = {
  // name of currently active theme
  activeTheme: Theme;

  // settter for changing active state
  setActiveTheme: (theme: Theme) => void;
};

const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      activeTheme: PRESET_THEMES[0],
      setActiveTheme: (theme) => set({ activeTheme: theme }),
    }),
    { name: "theme-store" },
  ),
);

export default useThemeStore;
