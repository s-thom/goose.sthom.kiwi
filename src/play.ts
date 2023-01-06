let currentIndex = 0;
const HONKS = document.querySelectorAll<HTMLAudioElement>("audio.audio-honk");
const QUACK = document.querySelector<HTMLAudioElement>("audio.audio-quack");
const BIG_GOOSE = document.querySelector<HTMLButtonElement>("#big-goose")!;

// Number of degrees the goose can rotate in each direction
const GOOSE_CRAZINESS = 15;

function playSound() {
  const honk = HONKS[currentIndex]!;
  honk.play();
  currentIndex = (currentIndex + 1) % HONKS.length;
}

function addActiveStyles() {
  BIG_GOOSE.style.setProperty("--tw-scale-x", "1.1");
  BIG_GOOSE.style.setProperty("--tw-scale-y", "1.1");
  BIG_GOOSE.style.setProperty(
    "--tw-rotate",
    `${(
      Math.floor((Math.random() - 0.5) * 2 * GOOSE_CRAZINESS * 100) / 100
    ).toString(10)}deg`
  );
}

function removeActiveStyles() {
  BIG_GOOSE.style.removeProperty("--tw-scale-x");
  BIG_GOOSE.style.removeProperty("--tw-scale-y");
  BIG_GOOSE.style.removeProperty("--tw-rotate");
}

let handle: number;

function queueAnim() {
  removeActiveStyles();
  requestAnimationFrame(() => addActiveStyles());
  if (handle) {
    clearTimeout(handle);
  }
  handle = setTimeout(() => removeActiveStyles(), 400);
}

function onMouseDown() {
  playSound();
  queueAnim();
}

function onKey(event: KeyboardEvent) {
  if (event.key === " " || event.key === "Enter") {
    onMouseDown();
  }
}

export function init() {
  // BIG_GOOSE.addEventListener("click", onClick);
  BIG_GOOSE.addEventListener("mousedown", onMouseDown);
  BIG_GOOSE.addEventListener("touchstart", onMouseDown);
  BIG_GOOSE.addEventListener("keydown", onKey);
}
