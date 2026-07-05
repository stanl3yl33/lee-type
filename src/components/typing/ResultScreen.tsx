"use client";

import useTypingSettingsStore from "@/store/useTypingSettingsStore";
import { TestResults } from "@/lib/calculateResults";

type ResultsScreenProps = {
  /** the calculated stats from useTypingGame */
  results: TestResults;
  /** called when the user clicks restart */
  onRestart: () => void;
};

/**
 * Displays the results of a completed typing test.
 */
export function ResultsScreen({ results, onRestart }: ResultsScreenProps) {
  const presetTime = useTypingSettingsStore((state) => state.timeMode.preset);
  const customTime = useTypingSettingsStore(
    (state) => state.timeMode.customDuration,
  );
  const totalTime = presetTime === "custom" ? customTime : presetTime;

  return (
    <div className="w-full font-mono">
      {/* main stats row */}
      <div className="flex gap-12 items-start">
        {/* left column */}
        <div className="flex flex-col gap-4 min-w-32">
          {/* wpm */}
          <div>
            <p className="text-gray-500 text-sm">wpm</p>
            <p className="text-yellow-400 text-6xl font-medium leading-none">
              {results.wpm}
            </p>
          </div>

          {/* accuracy */}
          <div>
            <p className="text-gray-500 text-sm">acc</p>
            <p className="text-yellow-400 text-6xl font-medium leading-none">
              {results.accuracy}%
            </p>
          </div>
        </div>

        {/* center column - graph placeholder for Phase 3 */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="w-full h-40 border border-gray-800 rounded flex items-center justify-center">
            <p className="text-gray-700 text-sm">graph coming in Phase 3</p>
          </div>

          {/* characters breakdown — correct / incorrect / extra / missed */}
          <div>
            <p className="text-gray-500 text-sm">characters</p>

            {/* group lets the tooltip react to hovering the parent */}
            <div className="relative group inline-block">
              <p className="text-white text-2xl cursor-default">
                {results.characters.correct}/{results.characters.incorrect}/
                {results.characters.extra}/{results.characters.missed}
              </p>

              {/* tooltip — only shows label names to explain the order of the numbers */}
              <div
                className="
      absolute bottom-full left-0 mb-2
      bg-gray-800 text-gray-300 text-xs font-mono
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

          {/* consistency — placeholder until per-second WPM sampling is added */}
          <div>
            <p className="text-gray-500 text-sm">consistency</p>
            <p className="text-white text-2xl">—</p>
          </div>
        </div>

        {/* right column */}
        <div className="flex flex-col gap-4">
          {/* test type */}
          <div>
            <p className="text-gray-500 text-sm">test type</p>
            <p className="text-yellow-400">time {totalTime}</p>
            <p className="text-yellow-400">english</p>
          </div>

          {/* raw wpm */}
          <div>
            <p className="text-gray-500 text-sm">raw</p>
            <p className="text-white text-2xl">{results.rawWpm}</p>
          </div>

          {/* time */}
          <div>
            <p className="text-gray-500 text-sm">time</p>
            <p className="text-white text-2xl">{totalTime}s</p>
          </div>
        </div>
      </div>

      {/* restart button */}
      <div className="mt-8">
        <button
          onClick={onRestart}
          className="text-gray-500 hover:text-white transition-colors text-sm"
        >
          restart
        </button>
      </div>
    </div>
  );
}
