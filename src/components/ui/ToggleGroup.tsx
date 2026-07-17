"use client";
type ToggleOptions<T> = {
  label: string;
  value: T;
};

type ToggleGroupProps<T> = {
  options: ToggleOptions<T>[];
  selected: T;
  onChange: (value: T) => void;
};

export function ToggleGropu<T>({
  options,
  selected,
  onChange,
}: ToggleGroupProps<T>) {
  return (
    <div className="flex items-center gap-1">
      {options.map((option) => (
        <button
          key={String(option.value)}
          onClick={() => onChange(option.value)}
          className={`px-2 font-mono text-sm transition-colors ${
            selected === option.value
              ? "text-yellow-400"
              : "text-gray-500 hover:text-white"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
