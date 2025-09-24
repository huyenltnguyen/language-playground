import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import logo from "./logo.svg";
import styles from "./App.module.css";
import PinyinToneInput from "./PinyinToneInput";

function Home() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

function App() {
  return (
    <div>
      <nav className={styles.nav}>
        <Link to="/" className={styles.link} data-home>
          Home
        </Link>
        <Link to="/pinyin-tone-input" className={styles.link}>
          Pinyin Tone Input
        </Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pinyin-tone-input" element={<PinyinToneInput />} />
      </Routes>
    </div>
  );
}

export default App;
