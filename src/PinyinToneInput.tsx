import React, { useState, useMemo } from "react";
import { convertUnspacedPinyin } from "pinyin-tone/v2";
import styles from "./PinyinToneInput.module.css";

/**
 * This component lets users type pinyin with tone numbers (e.g., "ni3hao3")
 * and displays the converted text with diacritical marks (e.g., "nǐhǎo").
 *
 * Strategy:
 * - We keep two pieces of state: rawInput and displayValue
 * - rawInput stores what the user actually typed: "ni3hao3"
 * - displayValue shows the converted version: "nǐhǎo"
 * - The input element displays the converted text, but all edits are tracked
 *   in terms of the raw input to avoid the library failing on mixed text like "nǐhao3"
 */
export function PinyinToneInput() {
  // Stores the actual typed characters with tone numbers: "ni3hao3"
  const [rawInput, setRawInput] = useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  // The converted text shown to the user: "nǐhǎo"
  const displayValue = useMemo(() => {
    return convertUnspacedPinyin(rawInput);
  }, [rawInput]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const input = inputRef.current;
    if (!input) return;

    const cursorPos = input.selectionStart ?? 0;
    const isAtEnd = cursorPos === displayValue.length;
    const hasSelection = input.selectionStart !== input.selectionEnd;

    // Backspace at the end: remove one character from raw input
    // Example: "ni3hao3" → "ni3hao" (removes "3", not "o")
    if (event.key === "Backspace" && isAtEnd && !hasSelection) {
      event.preventDefault();
      setRawInput(rawInput.slice(0, -1));
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    // User typed new characters at the end
    if (
      newValue.length > displayValue.length &&
      newValue.startsWith(displayValue)
    ) {
      const newChars = newValue.slice(displayValue.length);
      setRawInput(rawInput + newChars);
    }
    // User cleared everything, pasted, or made other changes
    // Just treat the new value as raw input
    else {
      setRawInput(newValue);
    }
  };

  return (
    <div className={styles.container}>
      <header>
        <h1>Pinyin Tone Input</h1>
        <p>
          Type alphanumeric letters and see them converted to Pinyin with
          diacritical marks.
        </p>
        <div className={styles.inputContainer}>
          <input
            ref={inputRef}
            type="text"
            value={displayValue}
            onKeyDown={handleKeyDown}
            onChange={handleInputChange}
            placeholder="Type pinyin with numbers (e.g., ni3 hao3)"
            className={styles.input}
            aria-label="Pinyin tone input"
          />
        </div>
        <p className={styles.example}>
          Example: Type "ni3 hao3" to see "nǐ hǎo"
        </p>
      </header>
    </div>
  );
}
