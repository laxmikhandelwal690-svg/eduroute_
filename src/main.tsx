import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App";
import { SoundProvider } from "./contexts/SoundContext";
import { AuthProvider } from "./contexts/AuthContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SoundProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </SoundProvider>
  </StrictMode>
);
