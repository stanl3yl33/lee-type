import useTypingSettingsStore from "@/store/useTypingSettingsStore";

type CharacterProps = {
  /** Expected character from the word list */
  character: string | undefined;
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
  const caretStyle = useTypingSettingsStore((state) => state.caretStyle);

  let colorClass = "text-untyped";

  if (characterInput !== undefined) {
    if (character === undefined) {
      colorClass = "text-extra-error";
    } else {
      colorClass =
        characterInput === character ? "text-correct" : "text-incorrect";
    }
  }

  return (
    <span className={`relative ${colorClass} inline-block`}>
      {isCursor && caretStyle !== "off" && (
        <>
          {caretStyle === "default" && (
            <span className="absolute left-0 top-1 bottom-1 w-0.5 bg-cursor animate-pulse" />
          )}
          {caretStyle === "block" && (
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-sm w-[0.6em] h-[1.1em] bg-cursor opacity-35" />
          )}
          {caretStyle === "underline" && (
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-[0.55em] bg-cursor animate-pulse" />
          )}
        </>
      )}
      {/* Show incorrect character if typed pass expected last char in word */}
      <span className="relative z-10">{character ?? characterInput}</span>
    </span>
  );
}
