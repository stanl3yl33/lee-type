import React from "react";

const theme = {
  untyped: "text-gray-500",
  correct: "text-white",
  incorrect: "text-red-500",
  cursor: "bg-yellow-400",
};

type CharacterProps = {
  /** Expected character from the word list */
  character: string;
  /**
   * What the user typed at this position.
   * Undefined if the cursor hasn't reach this position yet.
   */
  characterInput: string | undefined;
  /** Whether cursor should appear before the character. */
  isCursor: boolean;
};

/**
 * Renders a single character with color feedback based on the correctness.
 */
export function Character({
  character,
  characterInput,
  isCursor,
}: CharacterProps) {
  let colorClass = theme.untyped;

  if (characterInput !== undefined) {
    colorClass = characterInput === character ? theme.correct : theme.incorrect;
  }

  return (
    <span className={`relative ${colorClass}`}>
      {isCursor && (
        <span
          className={`absolute left-0 top-1 bottom-1 w-0.5 ${theme.cursor} animate-pulse`}
        />
      )}
      {character}
    </span>
  );
}
