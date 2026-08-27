"use client";
type ToggleOptions<T> = {
  label: string;
  value: T;
  style?: React.CSSProperties;
};

type ToggleGroupProps<T> = {
  options: ToggleOptions<T>[];
  selected: T;
  onChange: (value: T) => void;
};

export function ToggleGroup<T>({
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
          className={`px-2 text-sm transition-colors ${
            selected === option.value
              ? "text-accent"
              : "text-untyped hover:text-correct"
          }`}
          style={option.style}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
