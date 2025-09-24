import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import styles from "./App.module.css";
import PinyinToneInput from "./PinyinToneInput";

function Home() {
  return (
    <main className={styles.container}>
      <h1>Language Playground</h1>
      <ul>
        <li>
          <Link to="/pinyin-tone-input">Pinyin Tone Input</Link>
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
      </Routes>
    </div>
  );
}

export default App;
