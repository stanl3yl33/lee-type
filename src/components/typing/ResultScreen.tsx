"use client";

import { TestResults } from "@/lib/calculateResults";
import { DataPoint } from "@/hooks/useTypingGame";
import { ResultGraph } from "../graph/ResultGraph";

type ResultsScreenProps = {
  /** the calculated stats from useTypingGame */
  results: TestResults;
  /** called when the user clicks restart */
  onRestart?: () => void;
  mode: "time" | "words";
  /** time mode = secs | word mode = word count*/
  testLength: number;
  elapsedSeconds: number | null;
  wpmHistory: DataPoint[];
};

/**
 * Displays the results of a completed typing test.
 */
export function ResultsScreen({
  results,
  onRestart,
  mode,
  testLength,
  elapsedSeconds,
  wpmHistory,
}: ResultsScreenProps) {
  return (
    <div className="w-full">
      {/* main stats row */}
      <div className="flex gap-12 items-start">
        {/* left column */}
        <div className="flex flex-col gap-4 min-w-32">
          {/* wpm */}
          <div>
            <p className="text-untyped text-sm">wpm</p>
            <p className="text-accent text-6xl font-medium leading-none">
              {results.wpm}
            </p>
          </div>

          {/* accuracy */}
          <div>
            <p className="text-untyped text-sm">acc</p>
            <p className="text-accent text-6xl font-medium leading-none">
              {results.accuracy}%
            </p>
          </div>
        </div>

        {/* center column - graph placeholder for Phase 3 */}
        <div className="flex-1 flex flex-col gap-4">
          {/* <p className="text-untyped text-sm">graph coming in Phase 3</p> */}
          <ResultGraph wpmHistory={wpmHistory} />

          {/* characters breakdown — correct / incorrect / extra / missed */}
          <div>
            <p className="text-untyped text-sm">characters</p>
            <div className="relative group inline-block">
              <p className="text-correct text-2xl cursor-default">
                {results.characters.correct}/{results.characters.incorrect}/
                {results.characters.extra}/{results.characters.missed}
              </p>
              <div
                className="
                absolute bottom-full left-0 mb-2
                bg-black/85 text-untyped text-xs 
                rounded px-3 py-2 whitespace-nowrap
                invisible group-hover:visible
                opacity-0 group-hover:opacity-100
                transition-opacity duration-150
              "
              >
                <p>correct</p>
                <p>incorrect</p>
                <p>extra</p>
                <p>missed</p>
              </div>
            </div>
          </div>

          {/* consistency */}
          <div>
            <p className="text-untyped text-sm">consistency</p>
            <div className="relative group inline-block">
              <p className="text-correct text-2xl cursor-default">
                {Math.round(results.consistency)}%
              </p>
              <div
                className="
        absolute bottom-full left-0 mb-2
        bg-black/85 text-untyped text-xs
        rounded px-3 py-2 whitespace-nowrap
        invisible group-hover:visible
        opacity-0 group-hover:opacity-100
        transition-opacity duration-150
      "
              >
                {results.consistency.toFixed(2)}%
              </div>
            </div>
          </div>
        </div>

        {/* right column */}
        <div className="flex flex-col gap-4 ">
          {/* test type */}
          <div>
            <p className="text-untyped text-sm">test type</p>
            <p className="text-accent">
              {mode} {testLength}
            </p>
            <p className="text-accent">english</p>
          </div>

          {/* raw wpm */}
          <div>
            <p className="text-untyped text-sm">raw</p>
            <p className="text-correct text-2xl">{results.rawWpm}</p>
          </div>

          {/* time */}
          <div>
            <p className="text-untyped text-sm">time</p>
            <p className="text-correct text-2xl">
              {mode === "time"
                ? `${testLength}'s`
                : elapsedSeconds == null
                  ? "-"
                  : `${Math.round(elapsedSeconds)}'s`}
            </p>
          </div>
        </div>
      </div>

      {/* restart button */}
      {onRestart && (
        <div className="mt-8">
          <button
            onClick={onRestart}
            className="text-untyped hover:text-correct transition-colors text-sm"
          >
            restart
          </button>
        </div>
      )}
    </div>
  );
}
