"use server";

import { saveTest, type SaveTestInput } from "@/data/tests";
import type { DataPoint } from "@/hooks/useTypingGame";
import { MAX_HISTORY_POINTS } from "@/lib/limits";

type SaveResult =
  | { ok: true }
  | { ok: false; reason: "signed-out" | "invalid" | "error" };

// sanity ceilings
const MAX_WPM = 500;
const MAX_COUNT = 100_000;
const MAX_DURATION_SECONDS = 86_400;
const MAX_SERIES_VALUE = 5_000; // for graph point checks (in terms of wpm)

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

function parseHistory(value: unknown): DataPoint[] | null {
  if (!Array.isArray(value)) return null; // return null if value passed is not an array
  if (value.length === 0 || value.length > MAX_HISTORY_POINTS) return null;

  const clean: DataPoint[] = [];
  // check if array's elements are of datapoint and are within reasonable limit
  for (const point of value) {
    if (typeof point !== "object" || point === null) return null;
    const {
      second,
      wpm,
      raw: rawWpm,
      burst,
      errors,
    } = point as Record<string, unknown>;

    if (
      !isInt(second, 1, MAX_HISTORY_POINTS) ||
      second !== clean.length + 1 ||
      !isInt(wpm, 0, MAX_SERIES_VALUE) ||
      !isInt(rawWpm, 0, MAX_SERIES_VALUE) ||
      !isInt(burst, 0, MAX_SERIES_VALUE) ||
      !isInt(errors, 0, MAX_COUNT)
    ) {
      return null;
    }

    clean.push({ second, wpm, raw: rawWpm, burst, errors });
  }
  return clean;
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
    wpmHistory,
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

  // don't save history if its oversized or invalid.
  const history = parseHistory(wpmHistory);
  if (wpmHistory != null && history === null) {
    console.warn("saveResult: wpm history rejected, saving stats only");
  }

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
    wpmHistory: history,
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
