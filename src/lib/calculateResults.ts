export type TestResults = {
  wpm: number;
  rawWpm: number;
  accuracy: number;
};

/** calculates WPM based on correct words  */
function calculateWPM(
  wordList: string[],
  wordStorage: string[],
  elapsedSeconds: number,
): number {
  const correctWords = wordStorage.filter(
    (typed, i) => typed === wordList[i],
  ).length;
  const mins = elapsedSeconds / 60;
  if (mins === 0) return 0;
  return Math.round(correctWords / mins);
}

/** calculates WPM based on all words regardless of correctness */
function calculateRawWPM(
  wordStorage: string[],
  elapsedSeconds: number,
): number {
  const mins = elapsedSeconds / 60;
  if (mins === 0) return 0;
  return Math.round(wordStorage.length / mins);
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
): TestResults {
  return {
    wpm: calculateWPM(wordList, wordStorage, elapsedSeconds),
    rawWpm: calculateRawWPM(wordStorage, elapsedSeconds),
    accuracy: calculateAccuracy(wordList, wordStorage),
  };
}
