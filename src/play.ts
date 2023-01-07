import { getNext, MusicData } from "./midi";

// The joke is terrible, and so is this code.
// I might clean it up one day, but why would I bother.

let honkIndex = 0;
const HONKS = document.querySelectorAll<HTMLAudioElement>("audio.audio-honk");
// Did a frequency plot in Audacity, hopefully adjusting by these will give a good result
const HONK_BASE_FREQS = [671, 674, 672, 671, 668];
const QUACK = document.querySelector<HTMLAudioElement>("audio.audio-quack")!;
const BIG_GOOSE = document.querySelector<HTMLButtonElement>("#big-goose")!;
const BIG_GOOSE_LABEL =
  document.querySelector<HTMLParagraphElement>("#big-goose-label")!;
const SKIP = document.querySelector<HTMLButtonElement>("#skip")!;

let noteIndex = 0;
let currentSong: MusicData | undefined;

// Number of degrees the goose can rotate in each direction
const GOOSE_CRAZINESS = 5;

async function getNextSongData() {
  const prevSong = currentSong;
  currentSong = undefined;

  let tries = 0;
  while (tries < 5) {
    // eslint-disable-next-line no-await-in-loop
    const newSong = await getNext();
    if (!prevSong || newSong.meta.id !== prevSong.meta.id) {
      currentSong = newSong;
      return currentSong;
    }

    // Limit the number of tries to prevent infinite loopiness
    tries++;
  }

  currentSong = prevSong;
  return prevSong;
}

async function nextSong() {
  const song = await getNextSongData();

  if (!song) {
    return;
  }

  noteIndex = 0;
  BIG_GOOSE_LABEL.textContent = `Now playing: ${song.meta.emoji} (${song.meta.name})`;
}

function playEndSound() {
  QUACK.play();
}

function playSound() {
  if (!currentSong || noteIndex >= currentSong.notes.length) {
    playEndSound();
    nextSong();
    return;
  }

  const note = currentSong.notes[noteIndex]!;
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
  handle = setTimeout(() => removeActiveStyles(), 200);
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
  BIG_GOOSE.addEventListener("pointerdown", onMouseDown);
  BIG_GOOSE.addEventListener("keydown", onKey);
  SKIP.addEventListener("click", nextSong);

  nextSong();
}
