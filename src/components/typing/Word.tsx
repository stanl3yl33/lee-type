import React from "react";

type WordProps = {
  word: string;
  inputIndex: number;
  // word states include:
  // * inprogress (empty or some words correct)
  // * incorrect (invalid word)
  // * finished (complete correct)
  wordState: string;
};

export function ComponentName(props: ComponentNameProps) {
  return <div></div>;
}
