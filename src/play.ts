let honkIndex = 0;
const HONKS = document.querySelectorAll<HTMLAudioElement>("audio.audio-honk");
// Did a frequency plot in Audacity, hopefully adjusting by these will give a good result
const HONK_BASE_FREQS = [671, 674, 672, 671, 668];
const QUACK = document.querySelector<HTMLAudioElement>("audio.audio-quack")!;
const BIG_GOOSE = document.querySelector<HTMLButtonElement>("#big-goose")!;

let noteIndex = 0;
const NOTES = [523.25, 493.88, 440, 392, 349.23, 329.63, 293.66, 261.63].map(
  (n) => n * 2
);

// Number of degrees the goose can rotate in each direction
const GOOSE_CRAZINESS = 15;

function playEndSound() {
  QUACK.play();
  noteIndex = 0;
}

function playSound() {
  if (noteIndex >= NOTES.length) {
    playEndSound();
    return;
  }

  const note = NOTES[noteIndex]!;
  const honk = HONKS[honkIndex]!;
  const honkFreq = HONK_BASE_FREQS[honkIndex]!;

  const shiftAmount = note / honkFreq;

  honk.playbackRate = shiftAmount;
  honk.preservesPitch = false;
  honk.play();

  honkIndex = (honkIndex + 1) % HONKS.length;
  noteIndex++;
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
