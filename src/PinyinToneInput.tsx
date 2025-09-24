import React, { useState } from "react";
import toPinyinTones from "pinyin-tone";
import styles from "./PinyinToneInput.module.css";

function PinyinToneInput() {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputText = event.target.value;
    const convertedText = toPinyinTones(inputText);
    setInputValue(convertedText);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Pinyin Tone Input</h1>
        <p>
          Type alphanumeric letters and see them converted to Pinyin with
          diacritical marks!
        </p>
        <div className={styles.inputContainer}>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Type pinyin with numbers (e.g., ni3 hao3)"
            className={styles.input}
            aria-label="Enter pinyin with numbers"
          />
        </div>
        <p className={styles.example}>
          Example: Type "ni3 hao3" to see "nǐ hǎo"
        </p>
      </header>
    </div>
  );
}

export default PinyinToneInput;
