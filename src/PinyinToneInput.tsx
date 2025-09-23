import React, { useState } from 'react';
import toPinyinTones from 'pinyin-tone';
import './App.css';

function PinyinToneInput() {
  const [inputValue, setInputValue] = useState('');

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
          Type alphanumeric letters and see them converted to Pinyin with diacritical marks!
        </p>
        <div style={{ margin: '2rem 0' }}>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Type pinyin with numbers (e.g., ni3 hao3)"
            style={{
              padding: '0.5rem',
              fontSize: '1.2rem',
              width: '400px',
              maxWidth: '80vw',
              border: '2px solid #61dafb',
              borderRadius: '4px',
              outline: 'none',
            }}
          />
        </div>
        <p style={{ color: '#61dafb', fontSize: '0.9rem' }}>
          Example: Type "ni3 hao3" to see "nǐ hǎo"
        </p>
      </header>
    </div>
  );
}

export default PinyinToneInput;