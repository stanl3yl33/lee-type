export type Theme = {
  name: string;
  correct: string;
  incorrect: string;
  untyped: string;
  cursor: string;
  background: string;
  accent: string;
};

// Built-in preset themes
export const PRESET_THEMES: Theme[] = [
  {
    name: "bingsu",
    correct: "#f0d6e8", // lighter pink — more contrast against untyped
    incorrect: "#ca4754", // keep the red
    untyped: "#6b4f63", // darker/more muted so correct stands out more
    cursor: "#f0d6e8",
    background: "#2b1d2e",
    accent: "#f0d6e8",
  },
  {
    name: "botanical",
    correct: "#f0f0e8", // off-white — clearly typed
    incorrect: "#cc4444", // red for errors
    untyped: "#5a7a6a", // muted dark green — dimmed
    cursor: "#f0f0e8",
    background: "#6b8f7a", // sage green background
    accent: "#f0f0e8",
  },
  {
    name: "dark",
    correct: "#ffffff",
    incorrect: "#ff4444",
    untyped: "#555555",
    cursor: "#ffffff",
    background: "#111111",
    accent: "#ffffff",
  },
  {
    name: "midnight",
    correct: "#93c5fd",
    incorrect: "#f87171",
    untyped: "#475569",
    cursor: "#93c5fd",
    background: "#0f172a",
    accent: "#93c5fd",
  },
  {
    name: "carbon",
    correct: "#f4f4f4",
    incorrect: "#ee4035",
    untyped: "#444444",
    cursor: "#f4f4f4",
    background: "#1a1a1a",
    accent: "#f4f4f4",
  },
];
