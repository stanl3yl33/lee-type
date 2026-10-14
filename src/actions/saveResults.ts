"use server";

import { saveTest, type SaveTestInput } from "@/data/tests";

type SaveResult =
  | { ok: true }
  | { ok: false; reason: "signed-out" | "invalid" | "error" };

// sanity ceilings
const MAX_WPM = 500;
const MAX_COUNT = 100_000;
const MAX_DURATION_SECONDS = 86_400;

// validity checks for values
// returns bool and treat value as a number
function isInt(value: unknown, min: number, max: number): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= min &&
    value <= max
  );
}

// returns bool and treat value as a number
function isNumberInRange(
  value: unknown,
  min: number,
  max: number,
): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) && // include decimals
    value >= min &&
    value <= max
  );
}

// everything arriving is untrusted, need to check the arrived data
function parseInput(raw: unknown): SaveTestInput | null {
  if (typeof raw !== "object" || raw === null) return null;

  // raw shape: { wpm: int, mode: "time", ...} => need to check if values are as they say
  const {
    wpm,
    rawWpm,
    accuracy,
    consistency,
    correctChars,
    incorrectChars,
    extraChars,
    missedChars,
    mode,
    testLength,
    durationSeconds,
  } = raw as Record<string, unknown>;

  // checking if any of the fields is of wrong type.
  if (
    !isInt(wpm, 0, MAX_WPM) ||
    !isInt(rawWpm, 0, MAX_WPM) ||
    !isInt(accuracy, 0, 100) ||
    !isNumberInRange(consistency, 0, 100) ||
    !isInt(correctChars, 0, MAX_COUNT) ||
    !isInt(incorrectChars, 0, MAX_COUNT) ||
    !isInt(extraChars, 0, MAX_COUNT) ||
    !isInt(missedChars, 0, MAX_COUNT) ||
    !isInt(testLength, 1, MAX_COUNT) ||
    !isNumberInRange(durationSeconds, 0, MAX_DURATION_SECONDS)
  ) {
    return null;
  }

  if (mode !== "time" && mode !== "words") return null;

  return {
    wpm,
    rawWpm,
    accuracy,
    consistency,
    correctChars,
    incorrectChars,
    extraChars,
    missedChars,
    mode,
    testLength,
    durationSeconds,
  };
}

export async function saveResult(input: SaveTestInput): Promise<SaveResult> {
  // parse input + check validity
  const clean = parseInput(input);
  if (!clean) return { ok: false, reason: "invalid" };

  try {
    const saved = await saveTest(clean);
    return saved ? { ok: true } : { ok: false, reason: "signed-out" };
  } catch (error) {
    console.error("saveResult failed:", error);
    return { ok: false, reason: "error" };
  }
}
