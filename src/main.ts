import "./index.css";
import { init as initPlay } from "./play";

if (document.readyState !== "loading") {
  initPlay();
} else {
  document.addEventListener("DOMContentLoaded", () => {
    initPlay();
  });
}
