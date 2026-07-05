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
export function useTypingGame() {
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

  const startTimeRef = useRef<number | null>(null);
  const hasFinishedRef = useRef<boolean>(false);

  // populate word list on mount
  useEffect(() => {
    setWordList(generateWords());
  }, []);

  // countdown interval: owned here instead of Timer to avoid race condition possibility
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
    return () => clearInterval(id);
  }, [isRunning]);

  // Finish condition - triggered when countDown hits zero
  useEffect(() => {
    if (countDown !== 0) return;
    if (hasFinishedRef.current) return;

    // countDown is 0 and we haven't finished yet — end the game
    hasFinishedRef.current = true;

    setIsFinished(true);
    setIsRunning(false);

    const elapsedSeconds = startTimeRef.current
      ? (Date.now() - startTimeRef.current) / 1000
      : totalTime;

    const finalResults = calculateResults(
      wordList,
      wordStorage,
      elapsedSeconds,
    );
    setResults(finalResults);
  }, [countDown, wordList, wordStorage, totalTime]);

  // reset countdown if totalTime changes while not running
  // handles the case where user changes time setting between tests in future
  useEffect(() => {
    if (!isRunning) {
      setCountDown(totalTime);
    }
  }, [totalTime, isRunning]);

  // restart game logic:
  const handleRestart = useCallback(() => {
    // reset refs first — synchronous, immediate
    hasFinishedRef.current = false;
    startTimeRef.current = null;

    // reset all game state
    setWordList(generateWords());
    setTypedInput("");
    setCurrentWordIndex(0);
    setWordStorage([]);
    setIndexBoundary(0);
    setIsRunning(false);
    setIsFinished(false);
    setCountDown(totalTime);
    setResults(null);
  }, [totalTime]);

  // keydown handler:
  useEffect(() => {
    // stop listening once game is finished
    if (isFinished) return;

    const handleKeydown = (e: KeyboardEvent) => {
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
        setWordList((prev) => [...prev, getRandomWord()]);
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
        // else: empty input at boundary — do nothing
      } else if (!skipKeys(e)) {
        // start timer on very first real keystroke
        if (!isRunning) {
          setIsRunning(true);
          startTimeRef.current = Date.now();
        }
        setTypedInput((prev) => prev + e.key);
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);

    // every piece of state read inside handleKeydown must be listed here
    // omitting any of these causes stale closure bugs
  }, [
    isFinished,
    isRunning,
    typedInput,
    currentWordIndex,
    wordStorage,
    indexBoundary,
    wordList,
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
  };
}
