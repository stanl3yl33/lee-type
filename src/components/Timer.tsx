"use client";

import { useEffect, useState } from "react";
import useTypingSettingsStore from "@/store/useTypingSettingsStore";

type TimerProps = {
  /**
   * bool that decides if timer should be running or not. True on first keystroke
   */
  isRunning: boolean;
  /** callback fn called when countdown reaches zero. Logic from TypingTest component */
  onFinish: () => void;
  /** Bool that toggles to reset the timer */
  resetSignal: boolean;
};

/**
 * Displays the countdown and calls onFinish callback when the time runs out.
 * start and stop logic driven by TypingTest component
 */
export function Timer({ isRunning, onFinish, resetSignal }: TimerProps) {
  const presetTime = useTypingSettingsStore((state) => state.timeMode.preset);
  const customTime = useTypingSettingsStore(
    (state) => state.timeMode.customDuration,
  );

  const totalTime = presetTime === "custom" ? customTime : presetTime;

  const [countDown, setCountDown] = useState<number>(totalTime);

  // resets the countdown
  useEffect(() => {
    setCountDown(totalTime);
  }, [resetSignal, totalTime]);

  // countdown starts only when isRunning is true
  useEffect(() => {
    if (!isRunning) return;

    const id = setInterval(() => {
      setCountDown((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // cleanup fn - clears interval when isRunning chagnnes or component unmounts
    return () => clearInterval(id);
  }, [isRunning]);

  useEffect(() => {
    if (countDown === 0 && isRunning) {
      onFinish();
    }
  }, [countDown, isRunning, onFinish]);

  return (
    <div className="text-4xl font-medium text-gray-400 mb-6">{countDown}</div>
  );
}
