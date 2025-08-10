"use client";

import React, { useReducer, useEffect, useState } from "react";

// type ComponentNameProps = {};

// export function TypingTest(props: ComponentNameProps) {
export function TypingTest() {
  // useReducer - keep track of game state
  // 'start' - begin test
  // 'finish' - user finishes the test
  // 'unfocus'? for when user is tabbed away
  const [typedInput, setTypedInput] = useState<string>("");
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0); // keeps track of currenlty active word
  const [wordStorage, setWordStorage] = useState<string[]>([]);

  // boundary in which the user can backspace. Should be set on the most newest correctly spelt word
  const [indexBoundary, setIndexBoundary] = useState<number>(0);

  // goals below:
  /**
   * 1) render text to type
   * 2) track user typing
   * 3) compare with actual text for validity
   * 4) handle transition between words
   */

  /**
   * typedInput => focuses on one current word. -> space bar === word is 'finished'
   * currentWordIndex => index of the current word based on given sequenced
   * typedWords => data structure that houses all the user input's that is being typed
   *    - if we type one word and press space, that word would go into this typedWords list
   *
   *  Need to have some sort of boundary where cursor cannot revert back to. (should be on the latest 'correctly' typed word)
   */

  // possible props to consider for Word.tsx

  // placeholder wordList
  const wordList = ["hi", "hello", "goodbye", "bruh", "this", "guy"];
  // useEffect - for keydown events regestering user input and 'clicking' for focusing on test?
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      // debuging:
      console.log(
        "key:",
        JSON.stringify(e.key),
        "code:",
        e.code,
        "type:",
        e.type
      );

      //   when this is pressed, accumulated string input put into accumulating list and move onto 'next word input'
      if (e.key === " ") {
        e.preventDefault(); // optionally stop page from scrolling
        console.log("space pressed, moving onto next word");

        // Check the typed word was correct compared to the corresponding wordList at currentIndex
        // if so move the indexBoundary:
        if (typedInput === wordList[currentWordIndex]) {
          //
          setIndexBoundary(currentWordIndex + 1);
          console.log("index boundary was moved!");
        }

        // store the currently typed word into wordStorage state:
        setWordStorage((prev) => [...prev, typedInput]);

        // increment index -> work on next word in sequence
        setCurrentWordIndex((prev) => prev + 1);
        console.log("Current word index: ", currentWordIndex);

        // clear typedInput to start next word
        setTypedInput("");
      } else if (e.key === "Backspace") {
        // case for going back to prev words if boundary allows us to do so
        if (typedInput === "" && indexBoundary < currentWordIndex) {
          // decrement the index to go back to prev word
          setCurrentWordIndex((prev) => prev - 1);

          // get previous typed word from wordStorage:
          setTypedInput(wordStorage[currentWordIndex - 1]);

          // pop/remove the prev word:
          setWordStorage((prev) => prev.slice(0, -1)); // removes last element from list

          console.log("PREV WORD: ", typedInput);
        } else if (typedInput.length > 0) {
          // if there is content to be deleted, delete it via slice
          const backspaceResult = typedInput.slice(0, -1);
          setTypedInput(backspaceResult);
        } else {
          // empty input + at indexBoundary -> delete nothing
          console.log("bruh");
          console.log(
            "index boundary = ",
            indexBoundary,
            "\ncurrent word index = ",
            currentWordIndex
          );
          console.log("word storage: ", wordStorage);
          return;
        }
      } else if (e.key === "Backspace" && e.ctrlKey) {
        console.log("deleting whole word");
      } else {
        setTypedInput((prev) => prev + e.key);
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [currentWordIndex, typedInput, indexBoundary, wordStorage, wordList]);

  //   console.log("test");
  console.log(typedInput);
  // use for prototyping:
  console.log("word storage:", wordStorage);
  const typeTest = "hello world how are you";
  //   const typeTestList = ["hello", "world", "how", "are", "you"];

  return (
    <div>
      {wordList.map((item, index) => (
        <p key={index}>{item}</p>
      ))}
    </div>
  );
}
