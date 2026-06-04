import React from "react";

type CharacterProps = {
  character: string;
  characterInput: string;
  isCursor: boolean;
};

/**
 * component that renders single character and colors it based on correctness
 * @param param0
 * @returns
 */
export function Character({ character, characterInput }: ComponentNameProps) {
  return <div>{character}</div>;
}
