export type Theme = {
  name: string;
  correct: string;
  incorrect: string;
  extraError: string;
  untyped: string;
  cursor: string;
  background: string;
  accent: string;
};

export const PRESET_THEMES: Theme[] = [
  {
    name: "bingsu",
    correct: "#f0d6e8",
    incorrect: "#ca4754",
    extraError: "#7e2a33",
    untyped: "#6b4f63",
    cursor: "#f0d6e8",
    background: "#2b1d2e",
    accent: "#f0d6e8",
  },
  {
    name: "dark",
    correct: "#ffffff",
    incorrect: "#ff4444",
    extraError: "#992222",
    untyped: "#555555",
    cursor: "#ffffff",
    background: "#111111",
    accent: "#ffffff",
  },
  {
    name: "midnight",
    correct: "#93c5fd",
    incorrect: "#f87171",
    extraError: "#7e2a33",
    untyped: "#475569",
    cursor: "#93c5fd",
    background: "#0f172a",
    accent: "#93c5fd",
  },
  {
    name: "carbon",
    correct: "#f4f4f4",
    incorrect: "#ee4035",
    extraError: "#8b1a15",
    untyped: "#444444",
    cursor: "#f4f4f4",
    background: "#1a1a1a",
    accent: "#f4f4f4",
  },
  {
    name: "botanical",
    correct: "#f0f0e8",
    incorrect: "#cc4444",
    extraError: "#7a2222",
    untyped: "#5a7a6a",
    cursor: "#f0f0e8",
    background: "#6b8f7a",
    accent: "#f0f0e8",
  },
];
