"use client";

import { useEffect } from "react";

type ToastProp = {
  message: string;
  isVisible: boolean;
  onHide: () => void;
  duration?: number;
};

export function Toast({
  message,
  isVisible,
  onHide,
  duration = 2000,
}: ToastProp) {
  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(onHide, duration);
    return () => clearTimeout(timer);
  }, [isVisible, duration, onHide]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-6 right-6 z-50 font-mono">
      <div className="bg-correct text-background px-4 py-3 rounded text-sm font-medium shadow-lg animate-fade-in">
        {message}
      </div>
    </div>
  );
}
