import { init as initFooter } from "./footer";
import "./index.css";
import { init as initPlay } from "./play";

if (document.readyState !== "loading") {
  initPlay();
  initFooter();
} else {
  document.addEventListener("DOMContentLoaded", () => {
    initFooter();
    initPlay();
  });
}
