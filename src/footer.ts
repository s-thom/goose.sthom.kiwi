// Honk
const BUTTON_SECLECTOR = "#footer-goose";
const TOOLTIP_TIMEOUT = 3000;
const TRANSITION_DURATION = 200;
const HEARTS = ["❤️", "🧡", "💛", "💚", "💙", "💜"];

let button = document.querySelector(BUTTON_SECLECTOR)!;
let current = 0;
let count = 0;

const delay = (ms: number) =>
  new Promise((res) => {
    setTimeout(res, ms);
  });

async function addHeart() {
  const heart = document.createElement("div");
  heart.classList.add("goose-heart");
  current = (current - 1 + HEARTS.length) % HEARTS.length;
  heart.textContent = HEARTS[current];
  heart.ariaHidden = "true";

  const translateX = Math.floor(Math.random() * 100);
  const translateY = Math.floor(Math.random() * 10);
  heart.style.left = `${translateX}%`;
  heart.style.transform = `translateX(-${translateX}%) translateY(${translateY}px) scale(${
    (count + 500) / 500
  })`;

  button.appendChild(heart);
  count++;

  if (
    typeof umami !== "undefined" &&
    (count === 1 || count === 5 || count % 10 === 0)
  ) {
    umami.trackEvent("goose", { count });
  }

  await delay(TOOLTIP_TIMEOUT);
  heart.classList.add("goose-heart-exit");

  await delay(TRANSITION_DURATION);
  button.removeChild(heart);
}

export function init() {
  button = document.querySelector(BUTTON_SECLECTOR)!;
  button.addEventListener("click", () => {
    addHeart();
  });
}
