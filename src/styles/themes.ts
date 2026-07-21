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
  //   {
  //     name: "bingsu",
  //     correct: "#e2b6cf",
  //     incorrect: "#ca4754",
  //     untyped: "#b08fa3",
  //     cursor: "#e2b6cf",
  //     background: "#2b1d2e",
  //     accent: "#e2b6cf",
  //   },
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
