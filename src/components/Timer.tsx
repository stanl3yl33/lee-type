"use client";

type TimerProp = {
  countDown: number;
};

export function Timer({ countDown }: TimerProp) {
  return (
    <div className="text-4xl font-medium mb-6 text-accent">{countDown}</div>
  );
}
