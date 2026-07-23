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
  // let colorClass = theme.untyped;

  // if (characterInput !== undefined) {
  //   // colorClass = characterInput === character ? theme.correct : theme.incorrect;
  //   // if character is undefined, the user has typed pass the word length -> always incorrect
  //   colorClass =
  //     character === undefined
  //       ? theme.incorrect
  //       : characterInput === character
  //         ? theme.correct
  //         : theme.incorrect;
  // }
  let colorClass = "text-untyped";

  if (characterInput !== undefined) {
    if (character === undefined) {
      colorClass = "text-incorrect";
    } else {
      colorClass =
        characterInput === character ? "text-correct" : "text-incorrect";
    }
  }

  return (
    <span className={`relative ${colorClass}`}>
      {isCursor && (
        <span
          className={`absolute left-0 top-1 bottom-1 w-0.5 bg-cursor animate-pulse`}
        />
      )}
      {/* Show incorrect character if typed pass expected last char in word */}
      {character ?? characterInput}
    </span>
  );
}
