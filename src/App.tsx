import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import styles from "./App.module.css";
import PinyinToneInput from "./PinyinToneInput";
import SmartPinyinInput from "./SmartPinyinInput";
import MarkdownToRuby from "./MarkdownToRuby";
import FillInTheBlank from "./FillInTheBlank";

function Home() {
  return (
    <main className={styles.container}>
      <h1>Language Playground</h1>
      <ul>
        <li>
          <Link to="/pinyin-tone-input">Pinyin Tone Input</Link>
        </li>
        <li>
          <Link to="/smart-pinyin-input">Smart Pinyin Input</Link>
        </li>
        <li>
          <Link to="/markdown-to-ruby">Markdown to Ruby</Link>
        </li>
        <li>
          <Link to="/fill-in-the-blank">Fill in the Blank</Link>
        </li>
      </ul>
    </main>
  );
}

function App() {
  return (
    <div>
      <nav className={styles.nav}>
        <Link to="/" className={styles.link} data-home>
          Home
        </Link>
      </nav>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/pinyin-tone-input" element={<PinyinToneInput />} />
        <Route path="/smart-pinyin-input" element={<SmartPinyinInput />} />
        <Route path="/markdown-to-ruby" element={<MarkdownToRuby />} />
        <Route path="/fill-in-the-blank" element={<FillInTheBlank />} />
      </Routes>
    </div>
  );
}

export default App;
