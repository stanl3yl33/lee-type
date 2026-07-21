"use client";

import { useState } from "react";

type ModalProps = {
  isOpen: boolean;
  title: string;
  defaultValue?: number; // prefill input bar with already preselected val at start
  description?: string;
  onApply: (value: number) => void;
  onClose: () => void;
};

/**
 * Generic modal for the custom option settings
 */
export function Modal({
  isOpen,
  title,
  defaultValue,
  description,
  onApply,
  onClose,
}: ModalProps) {
  const [input, setInput] = useState<string>(
    defaultValue !== undefined ? String(defaultValue) : "",
  );
  if (!isOpen) return null;

  const handleApply = () => {
    const value = parseInt(input);
    if (!value || value <= 0) return;
    onApply(value);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleApply();
    if (e.key === "Escape") onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-background rounded-lg p-8 w-96 font-mono"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-accent text-xl mb-4">{title}</h2>

        <input
          type="number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-correct/10 text-correct px-4 py-2 rounded mb-4 focus:outline-none focus:ring-1 focus:ring-accent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          autoFocus
        />

        {description && (
          <p className="text-untyped text-xs mb-4 leading-relaxed">
            {description}
          </p>
        )}

        <button
          onClick={handleApply}
          className="w-full text-background bg-accent hover:opacity-90 py-2 rounded transition-opacity font-medium"
        >
          apply
        </button>
      </div>
    </div>
  );
}
