"use client";

import useTypingSettingsStore from "@/store/useTypingSettingsStore";
import { ResultsScreen } from "./ResultScreen";
import { useTypingGame } from "@/hooks/useTypingGame";
import { Timer } from "../Timer";
import { Word } from "./Word";
import { ToggleGroup } from "../ui/ToggleGroup";
import { useState } from "react";
import { Modal } from "../ui/Modal";

const TIME_PRESETS = [15, 30, 60, 120] as const;
const WORD_PRESETS = [10, 25, 50, 100] as const;
const FONT_SIZE_CLASSES: Record<string, string> = {
  small: "text-xl",
  medium: "text-3xl",
  large: "text-5xl",
};

/**
 * Core typing test component
 * All game logic lives in useTypingGame. This component only renders
 */
export function TypingTest() {
  const [showCustomModal, setShowCustomModal] = useState<boolean>(false);
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
    wpmHistory,
  } = useTypingGame(showCustomModal);

  const setMode = useTypingSettingsStore((state) => state.setMode);
  const setTimePreset = useTypingSettingsStore((state) => state.setTimePreset);
  const setWordPreset = useTypingSettingsStore((state) => state.setWordPreset);
  const setCustomTime = useTypingSettingsStore((state) => state.setCustomTime);
  const setCustomLength = useTypingSettingsStore(
    (state) => state.setCustomLength,
  );
  const timePreset = useTypingSettingsStore((state) => state.timeMode.preset);
  const wordPreset = useTypingSettingsStore((state) => state.wordMode.preset);
  const customTime = useTypingSettingsStore(
    (state) => state.timeMode.customDuration,
  );
  const customLength = useTypingSettingsStore(
    (state) => state.wordMode.customLength,
  );

  const fontSize = useTypingSettingsStore((state) => state.fontSize);
  const fontSizeClass = FONT_SIZE_CLASSES[fontSize];

  const handleCustomApply = (value: number) => {
    if (mode === "time") {
      setCustomTime(value);
      setTimePreset("custom");
    } else {
      setCustomLength(value);
      setWordPreset("custom");
    }
    setShowCustomModal(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      {isFinished ? (
        <ResultsScreen
          results={results!}
          onRestart={handleRestart}
          mode={mode}
          elapsedSeconds={elapsedSeconds}
          wpmHistory={wpmHistory}
        />
      ) : (
        <>
          {!isRunning && !isFinished && (
            <div className="flex items-center gap-1 mb-8">
              {/* Mode selction */}
              <ToggleGroup
                options={[
                  { label: "time", value: "time" },
                  { label: "words", value: "words" },
                ]}
                selected={mode}
                onChange={setMode}
              />

              <span className="mx-2 text-gray-700">|</span>

              {/* settings for modes */}
              {mode === "time" ? (
                <ToggleGroup
                  options={TIME_PRESETS.map((p) => ({
                    label: String(p),
                    value: p,
                  }))}
                  selected={timePreset}
                  onChange={setTimePreset}
                />
              ) : (
                <ToggleGroup
                  options={WORD_PRESETS.map((p) => ({
                    label: String(p),
                    value: p,
                  }))}
                  selected={wordPreset}
                  onChange={setWordPreset}
                />
              )}

              {/* custom option */}
              <button
                onClick={() => setShowCustomModal(true)}
                className={`px-2  text-sm transition-colors ${
                  timePreset === "custom" || wordPreset === "custom"
                    ? "text-accent"
                    : "text-untyped hover:text-correct"
                }`}
              >
                custom
              </button>
            </div>
          )}
          {mode === "time" ? (
            <Timer countDown={countDown} />
          ) : (
            <div className="text-4xl font-medium text-accent mb-6">
              {wordProgress.current} /{" "}
              <span className="text-2xl">{wordProgress.total}</span>
            </div>
          )}

          <div
            className={`flex flex-wrap gap-3 ${fontSizeClass} leading-relaxed  tracking-[0.2rem]`}
          >
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
            className="mt-8 text-sm text-untyped hover:text-correct transition-colors"
          >
            restart
          </button>
        </>
      )}

      {showCustomModal && (
        <Modal
          isOpen={showCustomModal}
          title={mode === "time" ? "Test Duration" : "Custom word amount"}
          // might change time to allow mins and hrs
          description={
            mode === "time"
              ? "Enter duration amount in seconds"
              : "Enter number of words to type"
          }
          // presets -> either number or 'custom' as value
          defaultValue={
            mode === "time"
              ? typeof timePreset === "number"
                ? timePreset
                : customTime
              : typeof wordPreset === "number"
                ? wordPreset
                : customLength
          }
          onApply={handleCustomApply}
          onClose={() => setShowCustomModal(false)}
        />
      )}
    </div>
  );
}
