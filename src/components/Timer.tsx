"use client";

import React, { useEffect, useState } from "react";
import useTypingSettingsStore from "@/store/useTypingSettingsStore";
// import useThemeStore from "@/store/useThemeStore";

export function Timer() {
  // let countDown = useTypingSettingsStore((state) => state.)
  // const [timer, setTimer] = useState<number>(
  //   useTypingSettingsStore((state) => state.timeMode.preset)
  // );

  const presetTime = useTypingSettingsStore((state) => state.timeMode.preset);
  const customTime = useTypingSettingsStore(
    (state) => state.timeMode.customDuration
  );

  // time used for the useState
  const time = presetTime === "custom" ? customTime : presetTime;

  const [countDown, setCountDown] = useState<number>(time);
  const [startTimer, setStartTimer] = useState<boolean>(false);

  useEffect(() => {
    // setInterval(setTimer((prevTime) => prevTime - 1));

    // decrements the time every sec pass:
    // stops at 0

    if (startTimer === true) {
      const id = setInterval(() => {
        setCountDown((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(id); // stops timer
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      // clean up funciton for the timer.
      // mostly used if user navigates to other page which cleans up timer
      return () => clearInterval(id);
    }
  }, [startTimer]);

  return (
    <div>
      {/* placeholder for now */}
      {countDown > 0 ? <p>Time Left: {countDown}</p> : <p>Times up!</p>}
      <button onClick={() => setStartTimer(true)}>Start test btn</button>

      {/* remove reset button. only used for testing purposes */}
      <button
        onClick={() => {
          setStartTimer(false);
          setCountDown(time);
        }}
      >
        restart timer
      </button>
    </div>
  );
}
