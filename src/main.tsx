import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App";
import { SoundProvider } from "./contexts/SoundContext";
import { ThemeProvider } from "./contexts/ThemeContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SoundProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </SoundProvider>
  </StrictMode>
);
