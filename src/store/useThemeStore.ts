import { create } from "zustand";
import { persist } from "zustand/middleware";

type ThemeType = "dark" | "light" | "bingsu";

type ThemeState = {
  theme: ThemeType;
  setTheme: (value: ThemeType) => void;
};

const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "bingsu",
      setTheme: (opt) =>
        set({
          theme: opt,
        }),
    }),
    { name: "theme-setting-store" }
  )
);

export default useThemeStore;
