import { Fragment, useMemo } from "react";
import { Song, SongMeta } from "../../songs";

const NUM_COLUMNS = 3;

export interface TrackListProps {
  currentSong?: Song;
  songs: SongMeta[];
  setSong?: (id: string) => void;
}

export function TrackList({ currentSong, songs, setSong }: TrackListProps) {
  const [columns, numRows] = useMemo(() => {
    const arr: SongMeta[][] = [...Array(NUM_COLUMNS)].map(() => []);

    songs.forEach((song, index) => arr[index % NUM_COLUMNS].push(song));

    // Since columns are added to in order, the first column will always have the highest number of items.
    return [arr, arr[0].length];
  }, [songs]);

  return (
    <table>
      <thead className="sr-only">
        <tr>
          {columns.map((_, index) => (
            <Fragment key={index}>
              <th>Is playing</th>
              <th>Song name</th>
            </Fragment>
          ))}
        </tr>
      </thead>
      <tbody>
        {[...Array(numRows)].map((_, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((songsInColumn, columnIndex) => {
              const song = songsInColumn[rowIndex];
              if (!song) {
                return (
                  <Fragment key={columnIndex}>
                    <td></td>
                    <td></td>
                  </Fragment>
                );
              }
              return (
                <Fragment key={song.id}>
                  <td aria-label={currentSong?.id === song.id ? "Playing" : ""}>
                    {currentSong?.id === song.id ? "▶" : "➖"}
                  </td>
                  <td>
                    <button
                      className="w-full rounded bg-slate-300 p-1 dark:bg-slate-800"
                      aria-label={`Play ${song.name}`}
                      data-umami-event="select-song"
                      data-umami-event-songid={song.id}
                      onClick={setSong ? () => setSong(song.id) : undefined}
                    >
                      {song.emoji}
                    </button>
                  </td>
                </Fragment>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
