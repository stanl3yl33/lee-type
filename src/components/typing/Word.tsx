import { Character } from "./Character";

type WordProps = {
  word: string;
  typedWord: string; // user's input for the current word
  isActive: boolean; // is the word being typed currently
};

/**
 * component that renders single word and style it based on correctness
 * It handles correct, incorrect, untyped, and extra characters typed
 */
export function Word({ word, typedWord, isActive }: WordProps) {
  // Handles case if user types more than the actual word count
  const maxLen = Math.max(word.length, typedWord.length);

  return (
    <span className="inline-flex">
      {Array.from({ length: maxLen }, (_, i) => {
        const expectedChar = word[i];
        const typedChar = typedWord[i];

        return (
          <Character
            key={`${i}-${expectedChar ?? typedChar}`}
            character={expectedChar} // typed pass expected char -> show input char
            characterInput={typedChar}
            isCursor={isActive && i === typedWord.length} // currently active word and up to last type character
          />
        );
      })}
    </span>
  );
}
