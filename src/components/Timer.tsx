"use client";

type TimerProp = {
  countDown: number;
};

export function Timer({ countDown }: TimerProp) {
  return (
    <div className="text-4xl font-medium text-gray-400 mb-6">{countDown}</div>
  );
}
