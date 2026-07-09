"use client";

import useTypingSettingsStore from "@/store/useTypingSettingsStore";
import { ResultsScreen } from "./ResultScreen";
import { useTypingGame } from "@/hooks/useTypingGame";
import { Timer } from "../Timer";
import { Word } from "./Word";

/**
 * Core typing test component
 * All game logic lives in useTypingGame. This component only renders
 */
export function TypingTest() {
  const {
    wordList,
    typedInput,
    currentWordIndex,
    wordStorage,
    countDown,
    isFinished,
    results,
    handleRestart,
    mode,
    wordProgress,
    isRunning,
    elapsedSeconds,
  } = useTypingGame();

  const setMode = useTypingSettingsStore((state) => state.setMode);

  return (
    <div className="max-w-3xl mx-auto p-8">
      {isFinished ? (
        <ResultsScreen
          results={results!}
          onRestart={handleRestart}
          mode={mode}
          elapsedSeconds={elapsedSeconds}
        />
      ) : (
        <>
          {/* <Timer countDown={countDown} /> */}
          {/* mode toggle => only show when test hasn't started */}
          {!isRunning && !isFinished && (
            <div className="flex gap-4 mb-6 font-mono text-sm">
              <button
                onClick={() => setMode("time")}
                className={
                  mode === "time"
                    ? "text-yellow-400"
                    : "text-gray-500 hover:text-white transition-colors"
                }
              >
                time
              </button>
              <button
                onClick={() => setMode("words")}
                className={
                  mode === "words"
                    ? "text-yellow-400"
                    : "text-gray-500 hover:text-white transition-colors"
                }
              >
                words
              </button>
            </div>
          )}
          {mode === "time" ? (
            <Timer countDown={countDown} />
          ) : (
            <div className="text-4xl font-medium text-gray-400 mb-6">
              {wordProgress.current} /{" "}
              <span className="text-2xl">{wordProgress.total}</span>
            </div>
          )}

          <div className="flex flex-wrap gap-3 text-2xl leading-relaxed font-mono">
            {wordList.map((word, index) => (
              <Word
                key={`${word}-${index}`}
                word={word}
                typedWord={
                  index < currentWordIndex
                    ? (wordStorage[index] ?? "")
                    : index === currentWordIndex
                      ? typedInput
                      : ""
                }
                isActive={index === currentWordIndex}
              />
            ))}
          </div>

          <button
            onClick={handleRestart}
            className="mt-8 text-sm text-gray-500 hover:text-white transition-colors"
          >
            restart
          </button>
        </>
      )}
    </div>
  );
}
