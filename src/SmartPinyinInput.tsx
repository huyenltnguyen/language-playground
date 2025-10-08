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
};

export function SmartPinyinInput() {
  const [inputValue, setInputValue] = useState("");
  const [selectedCharacter, setSelectedCharacter] =
    useState<CharacterOption | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

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
        <div className={styles.exerciseContainer}>
          <div
            className={styles.exerciseText}
            role="group"
            aria-labelledby="exercise-instruction"
          >
            <span id="exercise-instruction">
              Type the Pinyin to see the corresponding Chinese character:
            </span>{" "}
            <Autocomplete
              options={optionsWithSelected}
              value={
                (inputValue.trim() === "" ? null : selectedCharacter) as
                  | CharacterOption
                  | undefined
              }
              onChange={(event, newValue) => {
                setSelectedCharacter(newValue);
                setIsInputFocused(false); // Close dropdown on select
              }}
              inputValue={inputValue}
              onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
                if (newInputValue.trim() === "") {
                  setSelectedCharacter(null);
                }
              }}
              getOptionLabel={(option) => (option ? option.character : "")}
              isOptionEqualToValue={(option, value) =>
                option?.character === value?.character &&
                option?.pinyin === value?.pinyin
              }
              filterOptions={(options) => options}
              open={isInputFocused && optionsWithSelected.length > 0}
              popupIcon={null}
              renderOption={(props, option) => {
                // Merge our custom class with MUI's classes on the root <li>
                return (
                  <li
                    {...props}
                    className={styles.option + " " + (props.className || "")}
                  >
                    <span className={styles.character}>{option.character}</span>
                  </li>
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="ma3 or mǎ"
                  variant="standard"
                  className={styles.blankInput}
                  aria-label="Enter pinyin to find Chinese characters"
                  sx={{
                    "& .MuiInput-input": {
                      paddingLeft: "16px !important",
                      paddingRight: "16px !important",
                    },
                  }}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                />
              )}
              classes={{
                listbox: styles.listbox,
                paper: styles.paper,
              }}
              disableClearable
              autoHighlight
              openOnFocus
            />
          </div>
        </div>
      </header>
    </div>
  );
}
