import React, { useState, useMemo } from "react";
import styles from "./SmartPinyinInput.module.css";

interface CharacterOption {
  character: string;
  pinyin: string;
}

const pinyinCharacterMap: Record<string, CharacterOption[]> = {
  ma3: [
    { character: "马", pinyin: "mǎ" },
    { character: "码", pinyin: "mǎ" },
  ],
  mǎ: [
    { character: "马", pinyin: "mǎ" },
    { character: "码", pinyin: "mǎ" },
  ],
  li3: [
    { character: "里", pinyin: "lǐ" },
    { character: "李", pinyin: "lǐ" },
    { character: "理", pinyin: "lǐ" },
    { character: "礼", pinyin: "lǐ" },
  ],
  lǐ: [
    { character: "里", pinyin: "lǐ" },
    { character: "李", pinyin: "lǐ" },
    { character: "理", pinyin: "lǐ" },
    { character: "礼", pinyin: "lǐ" },
  ],
};

function SmartPinyinInput() {
  const [inputValue, setInputValue] = useState("");
  const [selectedCharacter, setSelectedCharacter] =
    useState<CharacterOption | null>(null);

  const characterOptions = useMemo(() => {
    const normalizedInput = inputValue.toLowerCase().trim();
    return pinyinCharacterMap[normalizedInput] || [];
  }, [inputValue]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    setSelectedCharacter(null);
  };

  const handleOptionSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIndex = parseInt(event.target.value, 10);
    if (selectedIndex >= 0 && selectedIndex < characterOptions.length) {
      setSelectedCharacter(characterOptions[selectedIndex]);
    } else {
      setSelectedCharacter(null);
    }
  };

  return (
    <div className={styles.container}>
      <header>
        <h1>Smart Pinyin Input</h1>
        <p>
          Type pinyin with tone numbers to see corresponding Chinese characters.
        </p>
        <div className={styles.inputContainer}>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Type pinyin (e.g., ma3, mǎ, li3, lǐ)"
            className={styles.input}
            aria-label="Enter pinyin with numbers"
          />
        </div>
        {characterOptions.length > 0 && (
          <div className={styles.comboboxContainer}>
            <label htmlFor="character-select" className={styles.label}>
              Select a character:
            </label>
            <select
              id="character-select"
              onChange={handleOptionSelect}
              className={styles.combobox}
              defaultValue=""
            >
              <option value="" disabled>
                Choose a character...
              </option>
              {characterOptions.map((option, index) => (
                <option key={index} value={index}>
                  {option.character}
                </option>
              ))}
            </select>
          </div>
        )}
        {selectedCharacter && (
          <p className={styles.result}>
            Selected word: {selectedCharacter.character} (
            {selectedCharacter.pinyin})
          </p>
        )}
        <p className={styles.example}>
          Example: Type "ma3" or "mǎ" to see options for 马, 码 or "li3"/"lǐ"
          for 里, 李, 理, 礼
        </p>
      </header>
    </div>
  );
}

export default SmartPinyinInput;
