import { useCallback, useEffect, useState } from "react";
import { Player } from "../../player";
import { Song, SongLoader } from "../../songs";
import { delay } from "../../util";
import { GooseButton } from "../GooseButton";
import { TrackList } from "../TrackList";

export function App() {
  const [songLoader] = useState(() => new SongLoader());
  const [player] = useState(() => new Player());

  const [currentSong, setCurrentSong] = useState<Song>();
  const isLoading = !currentSong;

  const setSong = useCallback((song: Song) => {
    setCurrentSong(song);
    player.setNotes(song.notes);
    player.resetPlayback();
  }, []);

  const nextSong = useCallback(async (id?: string) => {
    const songPromise = id ? songLoader.getSongById(id) : songLoader.getNext();

    // Add a bit of a timeout before showing the loading text
    let isTakingTime = false;
    await Promise.race([
      songPromise,
      delay(100).then(() => {
        isTakingTime = true;
      }),
    ]);

    if (isTakingTime) {
      setCurrentSong(undefined);
      // Possibly make it slower so it looks like the loading is actually doing something
      await delay(200);
    }

    const song = await songPromise;
    setSong(song);
  }, []);

  useEffect(() => {
    nextSong();
  }, []);

  const onGooseClick = useCallback(() => {
    if (player.isComplete()) {
      player.playQuack();
      nextSong();
      return;
    }

    player.playHonk();
    player.advanceNote();
  }, []);

  return (
    <div className="flex w-full max-w-7xl flex-col gap-4 sm:grid sm:grid-cols-[0,1fr,15rem] md:grid-cols-[15rem,1fr,15rem] md:gap-6 lg:gap-8">
      <div></div>
      <div className="flex grow flex-col items-center justify-center gap-4 pt-20 sm:pt-0 md:gap-6 lg:gap-8">
        <GooseButton onClick={onGooseClick} />
        <p className="text-center">
          <span>Click the goose to play music.</span>
          <br />
          <span>
            {isLoading
              ? `Now playing: Loading... 🔄`
              : `Now playing: ${currentSong.emoji} (${currentSong.name})`}
          </span>
        </p>
      </div>
      <aside className="flex flex-col items-center justify-center gap-4 sm:max-w-md md:gap-6 lg:gap-8">
        <TrackList
          currentSong={currentSong}
          songs={songLoader.getSongList()}
          setSong={(id) => nextSong(id)}
        />
        <button
          className="rounded bg-slate-300 p-1 dark:bg-slate-800"
          onClick={() => nextSong()}
        >
          Next song ⏭
        </button>
      </aside>
    </div>
  );
}
