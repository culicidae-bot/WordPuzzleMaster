import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { GameProvider } from "./providers/game-provider";
createRoot(document.getElementById("root")).render(<GameProvider>
    <App />
  </GameProvider>);
