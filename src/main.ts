import "./index.css";
import { Player } from "./player";
import { SongLoader } from "./songs";
import { UiHandler } from "./ui";

// The joke is terrible, and so is this code.

// eslint-disable-next-line @typescript-eslint/no-use-before-define
const ui = new UiHandler(playSound, nextSong);
const songLoader = new SongLoader();
const player = new Player();

function delay(ms: number) {
  return new Promise((res) => {
    setTimeout(res, ms);
  });
}

async function nextSong() {
  const songPromise = songLoader.getNext();

  // Add a bit of a timeout before showing the loading text
  let isTakingTime = false;
  await Promise.race([
    songPromise,
    delay(100).then(() => {
      isTakingTime = true;
    }),
  ]);

  if (isTakingTime) {
    ui.setLabel({ state: "loading" });
    // Possibly make it slower so it looks like the loading is actually doing something
    await delay(200);
  }

  const song = await songPromise;
  if (!song) {
    player.resetPlayback();
    return;
  }

  player.setNotes(song.notes);
  player.resetPlayback();

  ui.setLabel({ state: "playing", song });
}

function playSound() {
  if (player.isComplete()) {
    player.playQuack();
    nextSong();
    return;
  }

  player.playHonk();
  player.advanceNote();
}

export function init() {
  nextSong();
}

if (document.readyState !== "loading") {
  nextSong();
} else {
  document.addEventListener("DOMContentLoaded", () => {
    nextSong();
  });
}
