import React from "react";

type ComponentNameProps = {
  character: string;
  characterInput: string;
};

export function Character({ character, characterInput }: ComponentNameProps) {
  return <div>{character}</div>;
}
