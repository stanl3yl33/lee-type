export type TestResults = {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  characters: CharacterCounts;
};
export type CharacterCounts = {
  correct: number;
  incorrect: number;
  extra: number;
  missed: number;
};

function calculateCharacters(
  wordList: string[],
  wordStorage: string[],
): CharacterCounts {
  let correct = 0;
  let incorrect = 0;
  let extra = 0;
  let missed = 0;

  const count = Math.min(wordList.length, wordStorage.length);

  for (let i = 0; i < count; i++) {
    const typedWord = wordStorage[i];
    const expectedWord = wordList[i];

    for (let c = 0; c < typedWord.length; c++) {
      if (c >= expectedWord.length) {
        extra++;
      } else if (typedWord[c] === expectedWord[c]) {
        correct++;
      } else {
        incorrect++;
      }
    }

    // only applies when typed word is shorter than the expected word
    if (typedWord.length < expectedWord.length) {
      missed += expectedWord.length - typedWord.length;
    }
  }
  return { correct, incorrect, extra, missed };
}

/** calculates WPM based on correct words  */
function calculateWPM(
  wordList: string[],
  wordStorage: string[],
  elapsedSeconds: number,
): number {
  if (elapsedSeconds === 0) return 0;

  const { correct } = calculateCharacters(wordList, wordStorage);
  // count spaces for correctly completed words
  const correctSpaces = wordStorage.filter(
    (typed, i) => typed === wordList[i],
  ).length;

  const mins = elapsedSeconds / 60;
  return Math.round((correct + correctSpaces) / 5 / mins);
}

/** calculates WPM based on all words regardless of correctness */
function calculateRawWPM(
  totalKeystrokes: number,
  elapsedSeconds: number,
): number {
  if (elapsedSeconds === 0) return 0;

  const mins = elapsedSeconds / 60;
  return Math.round(totalKeystrokes / 5 / mins);
}

/**Compares the typed characters against the expected characters */
function calculateAccuracy(wordList: string[], wordStorage: string[]): number {
  let correctChars = 0;
  let totalChars = 0;

  // guard against wordList / wordStorage ever being mismatched in lengths
  const count = Math.min(wordList.length, wordStorage.length);

  for (let i = 0; i < count; i++) {
    const typedWord = wordStorage[i];
    const expectedWord = wordList[i];

    totalChars += typedWord.length;

    for (let c = 0; c < typedWord.length; c++) {
      if (typedWord[c] === expectedWord[c]) {
        correctChars++;
      }
    }
  }
  if (totalChars === 0) return 0;
  return Math.round((correctChars / totalChars) * 100);
}

/** Return all three metrics in one obj */
export function calculateResults(
  wordList: string[],
  wordStorage: string[],
  elapsedSeconds: number,
  totalKeystrokes: number,
): TestResults {
  return {
    wpm: calculateWPM(wordList, wordStorage, elapsedSeconds),
    rawWpm: calculateRawWPM(totalKeystrokes, elapsedSeconds),
    accuracy: calculateAccuracy(wordList, wordStorage),
    characters: calculateCharacters(wordList, wordStorage),
  };
}
