"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import useTypingSettingsStore from "@/store/useTypingSettingsStore";
import { WORD_BANK } from "@/data/words";
import { calculateResults, TestResults } from "@/lib/calculateResults";

// utility functions:
/** Picks single random word from word bank */
function getRandomWord(): string {
  return WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)];
}

/** randomly picks 'count' number of words for typing test */
function generateWords(count: number = 50): string[] {
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    words.push(getRandomWord());
  }
  return words;
}

/**
 * Returns true for keys that should be ignored by the typing test.
 */
function skipKeys(e: KeyboardEvent): boolean {
  const ignored = new Set([
    "Shift",
    "Control",
    "Alt",
    "Meta", // Windows | Command key on mac
    "CapsLock",
    "Tab",
    "Escape",
    "Enter",
    "ArrowUp",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "PageUp",
    "PageDown",
    "Home",
    "End",
    "Insert",
    "Delete",
    "ContextMenu",
    "NumLock",
    "ScrollLock",
    "Pause",
    "PrintScreen",
  ]);

  // returns true if any of the keys above are pressed
  // if true -> input should be ignored / skipped
  return ignored.has(e.key);
}

/**
 * Owns all the typing game state logic. TypingTest component just renders what the hook returns
 */
export function useTypingGame(isModalOpen: boolean = false) {
  //Time mode settings
  const mode = useTypingSettingsStore((state) => state.mode);
  const wordPreset = useTypingSettingsStore((state) => state.wordMode.preset);
  const customLength = useTypingSettingsStore(
    (state) => state.wordMode.customLength,
  );

  // target word count for word mode
  const targetWordCount = wordPreset === "custom" ? customLength : wordPreset;

  // read time settings from global store
  // when the user changes their preferred time in settings, this updates automatically
  const presetTime = useTypingSettingsStore((state) => state.timeMode.preset);
  const customTime = useTypingSettingsStore(
    (state) => state.timeMode.customDuration,
  );
  const totalTime = presetTime === "custom" ? customTime : presetTime;

  const [wordList, setWordList] = useState<string[]>([]);
  const [typedInput, setTypedInput] = useState<string>("");
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [wordStorage, setWordStorage] = useState<string[]>([]);

  // prevents backspacing past most recently correctly typed word
  const [indexBoundary, setIndexBoundary] = useState<number>(0);

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const [countDown, setCountDown] = useState<number>(totalTime);
  const [results, setResults] = useState<TestResults | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  const startTimeRef = useRef<number | null>(null);
  const hasFinishedRef = useRef<boolean>(false);

  // helper method for handling finished test to reduce redundancy
  const finishGame = useCallback(
    (finalWordStorage: string[]) => {
      if (hasFinishedRef.current) return;
      hasFinishedRef.current = true;

      setIsFinished(true);
      setIsRunning(false);

      const elapsed = startTimeRef.current
        ? (Date.now() - startTimeRef.current) / 1000
        : totalTime;

      setElapsedSeconds(elapsed);
      const finalResults = calculateResults(
        wordList,
        finalWordStorage,
        elapsed,
      );
      setResults(finalResults);
    },
    [wordList, totalTime],
  );

  // populate word list on mount
  useEffect(() => {
    // setWordList(generateWords());
    if (mode === "words") {
      setWordList(generateWords(targetWordCount));
    } else {
      setWordList(generateWords());
    }
  }, [mode, targetWordCount]);

  // countdown interval: owned here instead of Timer to avoid race condition possibility
  useEffect(() => {
    if (!isRunning || mode === "words") return; // if mode === word -> safe guard it
    const id = setInterval(() => {
      setCountDown((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning, mode]);

  // Timer Finish condition - triggered when countDown hits zero
  useEffect(() => {
    if (countDown !== 0) return;
    if (hasFinishedRef.current) return;
    finishGame(wordStorage);
  }, [countDown, wordList, wordStorage, finishGame]);

  // reset countdown if totalTime changes while not running
  // handles the case where user changes time setting between tests in future
  useEffect(() => {
    if (!isRunning) {
      setCountDown(totalTime);
    }
  }, [totalTime, isRunning]);

  // Word Finish condition - trigger when the user types the last word
  useEffect(() => {
    if (mode !== "words") return; // safe guard against time mode
    if (currentWordIndex < targetWordCount) return;
    if (hasFinishedRef.current) return;

    finishGame(wordStorage);
  }, [
    currentWordIndex,
    mode,
    targetWordCount,
    wordList,
    wordStorage,
    finishGame,
  ]);

  // restart game logic:
  const handleRestart = useCallback(() => {
    // reset refs first — synchronous, immediate
    hasFinishedRef.current = false;
    startTimeRef.current = null;

    // reset all game state
    // setWordList(generateWords());
    setWordList(
      mode === "words" ? generateWords(targetWordCount) : generateWords(),
    );
    setTypedInput("");
    setCurrentWordIndex(0);
    setWordStorage([]);
    setIndexBoundary(0);
    setIsRunning(false);
    setIsFinished(false);
    setCountDown(totalTime);
    setResults(null);
    setElapsedSeconds(0);
  }, [totalTime, mode, targetWordCount]);

  // keydown handler:
  useEffect(() => {
    // stop listening once game is finished
    if (isFinished) return;

    const handleKeydown = (e: KeyboardEvent) => {
      // ignore all keystrokes while any modal is open to prevent test from starting
      if (isModalOpen) return;

      if (e.key === " ") {
        e.preventDefault();

        // ignore space if nothing typed yet
        if (typedInput === "") return;

        // advance boundary if word was correct
        // prevents backspacing past a correctly completed word
        if (typedInput === wordList[currentWordIndex]) {
          setIndexBoundary(currentWordIndex + 1);
        }

        // save typed word, advance to next
        setWordStorage((prev) => [...prev, typedInput]);
        setCurrentWordIndex((prev) => prev + 1);
        setTypedInput("");

        // append one new random word so the list never runs out
        // setWordList((prev) => [...prev, getRandomWord()]);

        if (mode === "time") {
          // only append new random words in list for time
          setWordList((prev) => [...prev, getRandomWord()]);
        }
      } else if (e.key === "Backspace" && e.ctrlKey) {
        // ctrl+backspace — delete the whole current word
        if (typedInput === "" && indexBoundary < currentWordIndex) {
          // at boundary with empty input — do nothing
        } else {
          setTypedInput("");
        }
      } else if (e.key === "Backspace") {
        if (typedInput === "" && indexBoundary < currentWordIndex) {
          // go back to the previous word and restore what was typed
          setCurrentWordIndex((prev) => prev - 1);
          setTypedInput(wordStorage[currentWordIndex - 1]);
          setWordStorage((prev) => prev.slice(0, -1));
        } else if (typedInput.length > 0) {
          // delete the last character
          setTypedInput((prev) => prev.slice(0, -1));
        }
      } else if (!skipKeys(e)) {
        // start timer on very first real keystroke
        if (!isRunning) {
          setIsRunning(true);
          startTimeRef.current = Date.now();
        }
        // setTypedInput((prev) => prev + e.key);
        const newInput = typedInput + e.key;
        setTypedInput(newInput);
        if (
          mode === "words" &&
          currentWordIndex === targetWordCount - 1 &&
          newInput === wordList[currentWordIndex]
        ) {
          setWordStorage((prev) => [...prev, newInput]);
          setCurrentWordIndex((prev) => prev + 1);
          setTypedInput("");
          finishGame([...wordStorage, newInput]); // pass update storage directly b/c states are async
        }
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [
    isFinished,
    isRunning,
    isModalOpen,
    typedInput,
    currentWordIndex,
    wordStorage,
    indexBoundary,
    wordList,
    mode,
    targetWordCount,
    finishGame,
  ]);

  // return everything TypingTest needs to render
  return {
    wordList,
    typedInput,
    currentWordIndex,
    wordStorage,
    countDown,
    isFinished,
    results,
    handleRestart,
    isRunning,
    elapsedSeconds,
    mode,
    wordProgress: {
      current: currentWordIndex,
      total: targetWordCount,
    },
  };
}
