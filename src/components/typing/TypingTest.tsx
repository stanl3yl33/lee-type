"use client";

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
  } = useTypingGame();

  return (
    <div className="max-w-3xl mx-auto p-8">
      {isFinished ? (
        <ResultsScreen results={results!} onRestart={handleRestart} />
      ) : (
        <>
          <Timer countDown={countDown} />

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
