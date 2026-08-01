"use client";

type ConfirmModalProps = {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({
  isOpen,
  message,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
      onClick={onCancel}
    >
      <div
        className="bg-background rounded-lg p-8 w-80 font-mono"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-correct text-sm mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 py-2 rounded text-sm bg-incorrect text-background font-medium hover:opacity-90 transition-opacity"
          >
            delete
          </button>
          <button
            onClick={onCancel}
            className="flex-1 py-2 rounded text-sm text-untyped hover:text-correct transition-colors"
          >
            cancel
          </button>
        </div>
      </div>
    </div>
  );
}
