import React, { useState, useMemo } from "react";
import { Autocomplete, TextField } from "@mui/material";
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

  // For Autocomplete, keep selected value in options if not present
  const optionsWithSelected = useMemo(() => {
    if (
      selectedCharacter &&
      !characterOptions.some(
        (opt) =>
          opt.character === selectedCharacter.character &&
          opt.pinyin === selectedCharacter.pinyin
      )
    ) {
      return [selectedCharacter, ...characterOptions];
    }
    return characterOptions;
  }, [characterOptions, selectedCharacter]);

  return (
    <div className={styles.container}>
      <header>
        <h1>Smart Pinyin Input</h1>
        <p>
          Type pinyin with tone numbers to see corresponding Chinese characters.
        </p>
        <div className={styles.inputContainer}>
          <Autocomplete
            options={optionsWithSelected}
            value={selectedCharacter}
            onChange={(event, newValue) => {
              setSelectedCharacter(newValue);
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
              setSelectedCharacter(null);
            }}
            getOptionLabel={(option) =>
              option ? `${option.character} (${option.pinyin})` : ""
            }
            isOptionEqualToValue={(option, value) =>
              option?.character === value?.character &&
              option?.pinyin === value?.pinyin
            }
            filterOptions={(options) => options}
            noOptionsText="No characters found for this pinyin"
            renderOption={(props, option) => {
              // Merge our custom class with MUI's classes on the root <li>
              return (
                <li
                  {...props}
                  className={styles.option + " " + (props.className || "")}
                >
                  <span className={styles.character}>{option.character}</span>
                  <span className={styles.pinyin}>{option.pinyin}</span>
                </li>
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Type pinyin (e.g., ma3, mǎ, li3, lǐ)"
                variant="outlined"
                fullWidth
              />
            )}
            classes={{
              listbox: styles.listbox,
              paper: styles.paper,
              noOptions: styles.noOptions,
            }}
            sx={{ maxWidth: 400 }}
            autoHighlight
            openOnFocus
          />
        </div>
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
