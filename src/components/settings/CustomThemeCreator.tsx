"use client";

import { HexColorPicker } from "react-colorful";
import { useState, useEffect, useRef } from "react";
import { Theme, PRESET_THEMES } from "@/styles/themes";
import { Toast } from "../ui/Toast";
import useThemeStore from "@/store/useThemeStore";

const COLOR_SLOTS = [
  { label: "background", key: "background" },
  { label: "correct", key: "correct" },
  { label: "incorrect", key: "incorrect" },
  { label: "extra error", key: "extraError" },
  { label: "untyped", key: "untyped" },
  { label: "cursor", key: "cursor" },
  { label: "accent", key: "accent" },
];

export function CustomThemeCreator() {
  const customThemes = useThemeStore((state) => state.customThemes);
  const addCustomTheme = useThemeStore((state) => state.addCustomTheme);
  const setActiveTheme = useThemeStore((state) => state.setActiveTheme);

  const [name, setName] = useState<string>("");
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [colors, setColors] = useState({
    background: "#1a1a2e",
    correct: "#ffffff",
    incorrect: "#ff4444",
    extraError: "#992222",
    untyped: "#555555",
    cursor: "#ffffff",
    accent: "#ffffff",
  });
  const [success, setSuccess] = useState<boolean>(false);

  const savedRef = useRef(false);
  const prevThemeRef = useRef<Theme>(useThemeStore.getState().activeTheme);

  useEffect(() => {
    prevThemeRef.current = useThemeStore.getState().activeTheme;
  }, []);

  const pickerRef = useRef<HTMLDivElement>(null);

  // hanldes clicking outside of hex picker closes
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setActiveSlot(null);
      }
    };

    if (activeSlot) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeSlot]);

  // restore prev theme if user leaves page without saving
  useEffect(() => {
    return () => {
      if (!savedRef.current) {
        setActiveTheme(prevThemeRef.current);
      }
    };
  }, [setActiveTheme]);

  const handleColorChange = (color: string) => {
    if (!activeSlot) return;

    const updatedColors = { ...colors, [activeSlot]: color };
    setColors((prev) => ({ ...prev, [activeSlot]: color }));

    //apply the color that the user changed to:
    setActiveTheme({
      name: name.trim() || "__preview__",
      ...updatedColors,
    });
  };

  const handleLoadFromPreset = (preset: Theme) => {
    const { name, ...presetColors } = preset;
    setColors(presetColors);

    // active live preview from preset colors:
    setActiveTheme({
      name: name.trim() || "__preview__",
      ...presetColors,
    });
  };

  const handleSave = () => {
    if (!name.trim()) {
      setError("Please enter a unique theme name");
      return;
    }

    const presetNames = PRESET_THEMES.map((t) => t.name.toLowerCase());
    if (presetNames.includes(name.trim().toLowerCase())) {
      setError("This name is already used by preset theme");
      return;
    }

    const customNames = customThemes.map((t) => t.name.toLowerCase());
    if (customNames.includes(name.trim().toLowerCase())) {
      setError("This name is already used by a custom theme");
      return;
    }
    setError("");
    const newTheme: Theme = { name: name.trim(), ...colors };
    addCustomTheme(newTheme);
    setActiveTheme(newTheme);
    savedRef.current = true;
    setSuccess(true);
    setTimeout(() => setSuccess(false), 1000);
  };

  return (
    <div>
      {/* theme name input */}
      <div className="mb-6">
        <p className="text-untyped text-xs mb-2">theme name</p>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError("");
          }}
          placeholder="my theme"
          className="bg-background text-correct px-3 py-2 rounded text-sm w-64 focus:outline-none focus:ring-1 focus:ring-accent"
        />
        {error && <p className="text-incorrect text-xs mt-1">{error}</p>}
      </div>

      {/* color slots */}
      <div className="flex flex-col gap-3 mb-6">
        {COLOR_SLOTS.map((slot) => (
          <div key={slot.key} className="flex items-center gap-4">
            <span className="text-untyped text-sm w-24">{slot.label}</span>

            {/* hex value input */}
            <input
              type="text"
              value={colors[slot.key as keyof typeof colors]}
              onChange={(e) =>
                setColors((prev) => ({ ...prev, [slot.key]: e.target.value }))
              }
              className="bg-background text-correct px-3 py-1.5 rounded text-sm w-28 focus:outline-none focus:ring-1 focus:ring-accent"
              maxLength={7}
            />

            {/* color swatch + picker popover */}
            <div className="relative">
              {/* swatch button */}
              <button
                onClick={() =>
                  setActiveSlot(activeSlot === slot.key ? null : slot.key)
                }
                className="w-8 h-8 rounded border border-untyped/30 hover:scale-110 transition-transform"
                style={{
                  backgroundColor: colors[slot.key as keyof typeof colors],
                }}
              />

              {activeSlot === slot.key && (
                <div
                  ref={activeSlot === slot.key ? pickerRef : null}
                  className="absolute bottom-full left-0 mb-2 z-50"
                >
                  <HexColorPicker
                    color={colors[slot.key as keyof typeof colors]}
                    onChange={handleColorChange}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* load from preset */}
      <div className="mb-6">
        <p className="text-untyped text-xs mb-2">load from preset</p>
        <div className="flex gap-2 flex-wrap">
          {PRESET_THEMES.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handleLoadFromPreset(preset)}
              className="px-3 py-1.5 rounded text-sm transition-opacity hover:opacity-80"
              style={{ backgroundColor: preset.background }}
            >
              <span style={{ color: preset.accent }}>{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* save */}
      <button
        onClick={handleSave}
        disabled={success}
        className="px-6 py-2 rounded text-sm bg-accent text-background font-medium hover:opacity-90 transition-opacity"
      >
        {success ? "saved!" : "save theme"}
      </button>
      <Toast
        message="theme saved!"
        isVisible={success}
        onHide={() => setSuccess(false)}
      />
    </div>
  );
}
