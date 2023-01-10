import { createRoot } from "react-dom/client";
import { App } from "./components/App";
import "./index.css";

// The joke is terrible, and so is this code.

const root = document.querySelector("#root");
if (root) {
  createRoot(root).render(<App />);
}
