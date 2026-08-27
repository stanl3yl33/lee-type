import { Character } from "./Character";
import useTypingSettingsStore from "@/store/useTypingSettingsStore";

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

  const isCompletedIncorrect =
    !isActive && typedWord !== "" && typedWord !== word;

  const caretStyle = useTypingSettingsStore((state) => state.caretStyle);

  return (
    <span
      className={`inline-flex ${isCompletedIncorrect ? "border-b-2 border-incorrect" : ""}`}
      // className={`inline-flex gap-[0.15rem] ${isCompletedIncorrect ? "border-b-2 border-incorrect" : ""}`}
    >
      {Array.from({ length: maxLen }, (_, i) => {
        const expectedChar = word[i];
        const typedChar = typedWord[i];

        const isCursor = isActive && i === typedWord.length;

        return (
          <Character
            key={`${i}-${expectedChar ?? typedChar}`}
            character={expectedChar} // typed pass expected char -> show input char
            characterInput={typedChar}
            isCursor={isCursor} // currently active word and up to last type character
          />
        );
      })}
      {/* when all characters are typed, add cursor after the last one */}
      {/* {isActive && typedWord.length >= maxLen && (
        <Character
          key="end-cursor"
          character={undefined}
          characterInput={undefined}
          isCursor={true}
        />
      )} */}
      {isActive && typedWord.length >= maxLen && (
        <span className="relative w-0 overflow-visible">
          {caretStyle === "default" && (
            <span className="absolute left-0 top-1 bottom-1 w-0.5 bg-cursor animate-pulse" />
          )}
          {caretStyle === "block" && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 animate-pulse rounded-sm w-[0.6em] h-[1.1em] bg-cursor opacity-35" />
          )}
          {caretStyle === "underline" && (
            <span className="absolute bottom-0 left-0 h-px w-[0.55em] bg-cursor animate-pulse" />
          )}
        </span>
      )}
    </span>
  );
}
