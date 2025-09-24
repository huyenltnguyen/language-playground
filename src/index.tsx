import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const isGithubPages = window.location.hostname === "huyenltnguyen.github.io";
const basename = isGithubPages ? "/language-playground" : "";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#181a1b",
      paper: "#23272a",
    },
    primary: {
      main: "#61dafb",
    },
    text: {
      primary: "#f3f3f3",
      secondary: "#90caf9",
    },
  },
  shape: {
    borderRadius: 4,
  },
});

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <BrowserRouter basename={basename}>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
