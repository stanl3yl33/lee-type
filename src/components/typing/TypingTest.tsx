"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Timer } from "../Timer";
import { Word } from "./Word";
import { WORD_BANK } from "@/data/words";

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

export function TypingTest() {
  // word list - starts with a batch and grows with every word typed
  const [wordList, setWordList] = useState<string[]>([]);

  const [typedInput, setTypedInput] = useState<string>("");

  // keeps track of currenlty active word
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);

  const [wordStorage, setWordStorage] = useState<string[]>([]);

  // boundary in which the user can backspace. Should be set on the most newest correctly spelt word
  const [indexBoundary, setIndexBoundary] = useState<number>(0);

  // timer control - temporary until full rewrite
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // used for togging signals
  const [resetSignal, setResetSignal] = useState<boolean>(false);

  // for calling the browser's scrollIntoView for specific words
  const wordsContainerRef = useRef<HTMLDivElement>(null);

  /**Called by Timer when countdown reaches zero */
  const handleFinish = useCallback(() => {
    setIsFinished(true);
    setIsRunning(false);
  }, []);

  /** Resets all game and their state back to the beginning */
  const handleRestart = useCallback(() => {
    setWordList(generateWords());
    setTypedInput("");
    setCurrentWordIndex(0);
    setWordStorage([]);
    setIndexBoundary(0);
    setIsRunning(false);
    setIsFinished(false);
    setResetSignal((prev) => !prev);
  }, []);

  useEffect(() => {
    setWordList(generateWords());
  }, []);

  // for keydown events regestering user input and 'clicking' for focusing on test?
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      //   when this is pressed, accumulated string input put into accumulating list and move onto 'next word input'
      if (e.key === " ") {
        e.preventDefault(); // optionally stop page from scrolling

        if (typedInput === "") return; // ignore space if nothing has been typed yet

        // Check the typed word was correct compared to the corresponding wordList at currentIndex
        // if so move the indexBoundary:
        if (typedInput === wordList[currentWordIndex]) {
          setIndexBoundary(currentWordIndex + 1);
        }

        // store the currently typed word into wordStorage state:
        setWordStorage((prev) => [...prev, typedInput]);

        // increment index -> work on next word in sequence
        setCurrentWordIndex((prev) => prev + 1);

        // clear typedInput to start next word
        setTypedInput("");

        // append one new random word so the list never runs out
        setWordList((prev) => [...prev, getRandomWord()]);
      } else if (e.key === "Backspace" && e.ctrlKey) {
        if (typedInput === "" && indexBoundary < currentWordIndex) {
          // with empty input -> do nothing
        } else {
          // console.log("deleting whole word");
          setTypedInput("");
        }

        // need to apply same boundary logic. moving back to prev word:
      } else if (e.key === "Backspace") {
        // case for going back to prev words if boundary allows us to do so
        if (typedInput === "" && indexBoundary < currentWordIndex) {
          // decrement the index to go back to prev word
          setCurrentWordIndex((prev) => prev - 1);

          // get previous typed word from wordStorage:
          setTypedInput(wordStorage[currentWordIndex - 1]);

          // pop/remove the prev word:
          setWordStorage((prev) => prev.slice(0, -1)); // removes last element from list

          // console.log("PREV WORD: ", typedInput);
        } else if (typedInput.length > 0) {
          // if there is content to be deleted, delete it via slice
          const backspaceResult = typedInput.slice(0, -1);
          setTypedInput(backspaceResult);
        } else {
          // empty input + at indexBoundary -> delete nothing
          console.log(
            "index boundary = ",
            indexBoundary,
            "\ncurrent word index = ",
            currentWordIndex,
          );
          console.log("word storage: ", wordStorage);
          return;
        }
      } else {
        if (skipKeys(e) === false) {
          if (!isRunning) setIsRunning(true);
          setTypedInput((prev) => prev + e.key);
        }
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [
    isFinished,
    isRunning,
    typedInput,
    currentWordIndex,
    wordStorage,
    indexBoundary,
    wordList,
  ]);

  return (
    <div className="max-w-3xl mx-auto p-8">
      <Timer
        isRunning={isRunning}
        onFinish={handleFinish}
        resetSignal={resetSignal}
      />

      {isFinished ? (
        // placeholder — proper results screen comes in Phase 2
        <p className="text-2xl text-white">
          Time&apos;s up! Results coming in Phase 2.
        </p>
      ) : (
        <div className="flex flex-wrap gap-3 text-2xl leading-relaxed font-mono">
          {wordList.map((word, index) => (
            <Word
              key={`${word}-${index}`}
              word={word}
              typedWord={
                index < currentWordIndex
                  ? (wordStorage[index] ?? "") // completed word
                  : index === currentWordIndex
                    ? typedInput // active word — live input
                    : "" // future word
              }
              isActive={index === currentWordIndex}
            />
          ))}
        </div>
      )}

      <button
        onClick={handleRestart}
        className="mt-8 text-sm text-gray-500 hover:text-white transition-colors"
      >
        restart
      </button>
    </div>
  );
}
