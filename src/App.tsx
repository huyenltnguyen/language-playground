import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import PinyinToneInput from './PinyinToneInput';

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
      <nav style={{ padding: '1rem', backgroundColor: '#f0f0f0' }}>
        <Link to="/" style={{ marginRight: '1rem', color: '#61dafb' }}>Home</Link>
        <Link to="/pinyin-tone-input" style={{ color: '#61dafb' }}>Pinyin Tone Input</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pinyin-tone-input" element={<PinyinToneInput />} />
      </Routes>
    </div>
  );
}

export default App;
