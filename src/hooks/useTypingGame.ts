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

// graph related data collection:
export type DataPoint = {
  second: number;
  wpm: number;
  burst: number;
  errors: number;
};

/** counts all characters in word storage -> used for burst calc*/
function countAllTypedChars(wordStorage: string[]): number {
  return wordStorage.reduce((total, word) => total + word.length, 0);
}

/** Calcs cumulative WPM at given second */
function calculateWpmAtSecond(
  wordList: string[],
  wordStorage: string[],
  elapsedSeconds: number,
): number {
  if (elapsedSeconds === 0) return 0;

  let correctChars = 0;
  const count = Math.min(wordList.length, wordStorage.length);

  for (let i = 0; i < count; i++) {
    const typed = wordStorage[i];
    const expected = wordList[i];
    if (!typed || !expected) continue;

    const len = Math.min(typed.length, expected.length);
    for (let c = 0; c < len; c++) {
      if (typed[c] === expected[c]) correctChars++;
    }
    // include space pressed in wpm calc
    if (typed === expected) correctChars++;
  }

  return Math.round(correctChars / 5 / (elapsedSeconds / 60));
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
  const quickRestart = useTypingSettingsStore((state) => state.quickRestart);

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

  // Points for result graph
  const [wpmHistory, setWpmHistory] = useState<DataPoint[]>([]);

  const startTimeRef = useRef<number | null>(null);
  const hasFinishedRef = useRef<boolean>(false);
  const tickCountRef = useRef(0);

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

  // refs for the interval data stat to prevent stale info
  const wordStorageRef = useRef<string[]>([]);
  const wordListRef = useRef<string[]>([]);

  // keep the refs in sync with their useState counterparts:
  useEffect(() => {
    wordStorageRef.current = wordStorage;
  }, [wordStorage]);
  useEffect(() => {
    wordListRef.current = wordList;
  }, [wordList]);

  const charsAtLastTickRef = useRef(0); // for burst calc - track total char type at each tick
  const errorsThisSecondRef = useRef(0);

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
    if (!isRunning) return;

    const id = setInterval(() => {
      const elapsed = startTimeRef.current
        ? (Date.now() - startTimeRef.current) / 1000
        : 0;

      const wpm = calculateWpmAtSecond(
        wordListRef.current,
        wordStorageRef.current,
        elapsed,
      );

      const currentChars = countAllTypedChars(wordStorageRef.current);
      const charsThisSecond = currentChars - charsAtLastTickRef.current;
      const burst = Math.round((charsThisSecond / 5) * 60);

      const errors = errorsThisSecondRef.current;

      tickCountRef.current += 1; // increments exactly once per real second now

      const newPoint: DataPoint = {
        second: tickCountRef.current,
        wpm,
        burst,
        errors,
      };

      // reset per-second trackers for the next tick
      charsAtLastTickRef.current = currentChars;
      errorsThisSecondRef.current = 0;

      setWpmHistory((prev) => [...prev, newPoint]);
      if (mode === "time") {
        setCountDown((prev) => (prev <= 1 ? 0 : prev - 1));
      }
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
    charsAtLastTickRef.current = 0;
    errorsThisSecondRef.current = 0;
    tickCountRef.current = 0;

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
    setWpmHistory([]);
  }, [totalTime, mode, targetWordCount]);

  // quick restart logic
  useEffect(() => {
    if (quickRestart === "off") return;

    const handleQuickRestart = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;

      if (
        (e.key === "Tab" && quickRestart === "tab") ||
        (e.key === "Escape" && quickRestart === "esc") ||
        (e.key === "Enter" && quickRestart === "enter")
      ) {
        e.preventDefault();
        handleRestart();
      }
    };

    window.addEventListener("keydown", handleQuickRestart);
    return () => window.removeEventListener("keydown", handleQuickRestart);
  }, [quickRestart, handleRestart]);

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

        const currentWord = wordList[currentWordIndex];
        const maxLength = currentWord ? currentWord.length + 10 : 20;
        if (typedInput.length >= maxLength) return; // stop accepting input

        const newInput = typedInput + e.key;
        setTypedInput(newInput);

        // track the error for graph data:
        // const curWord = wordList[currentWordIndex];
        // optional chain for 'correct' char in that index
        const expectedChar = currentWord?.[newInput.length - 1];
        if (expectedChar === undefined || e.key !== expectedChar) {
          errorsThisSecondRef.current += 1;
        }

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
    wpmHistory,
  };
}
