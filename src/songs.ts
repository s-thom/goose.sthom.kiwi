import { Midi } from "@tonejs/midi";

export interface Song {
  id: string;
  name: string;
  emoji: string;
  notes: number[];
}

export type SongMeta = Pick<Song, "id" | "name" | "emoji">;

const songs: SongMeta[] = [
  { id: "cantina", name: "Cantina Band (Star Wars)", emoji: "🎷👽" },
  { id: "chicken", name: "Chicken Dance", emoji: "🐔💃" },
  { id: "blue-danube", name: "Blue Danube", emoji: "🟦🏞" },
  { id: "still-alive", name: "Still Alive (Portal)", emoji: "🍰🤖" },
  { id: "panther", name: "The Pink Panther", emoji: "🎀🐆" },
  { id: "benny-hill", name: "Benny Hill", emoji: "🏃‍♂️🌄" },
  { id: "popcorn", name: "Popcorn", emoji: "🍿" },
  { id: "gladiators", name: "Entry of the Gladiators", emoji: "🤡" },
  { id: "sandstorm", name: "Sandstorm", emoji: "🏜⛈" },
  { id: "nevergonna", name: "Never gonna give you up", emoji: "🎙🕺" },
  { id: "all-star", name: "All Star", emoji: "🌠🌟" },
];

/** https://gist.github.com/YuxiUx/ef84328d95b10d0fcbf537de77b936cd */
function noteToFreq(note: number) {
  const A = 440; // frequency of A (coomon value is 440Hz)
  return (A / 32) * 2 ** ((note - 9) / 12);
}

export class SongLoader {
  private readonly cache: { [key: string]: number[] } = {};

  private currentSongIndex = -1;

  private async getNotes(id: string): Promise<number[]> {
    if (this.cache[id]) {
      return this.cache[id];
    }

    const midi = await Midi.fromUrl(`/midi/${id}.mid`);

    const notes = midi.tracks[0].notes.map((n) => noteToFreq(n.midi));

    this.cache[id] = notes;
    return notes;
  }

  public async getNext(): Promise<Song> {
    this.currentSongIndex = (this.currentSongIndex + 1) % songs.length;

    const song = songs[this.currentSongIndex];
    const notes = await this.getNotes(song.id);

    if (typeof umami !== "undefined") {
      umami.trackEvent("change-song", { type: "change-song", songId: song.id });
    }

    return {
      id: song.id,
      name: song.name,
      emoji: song.emoji,
      notes,
    };
  }

  public async getSongById(id: string) {
    const index = songs.findIndex((song) => song.id === id);
    if (index === -1) {
      throw new Error(`No song with ID ${id}`);
    }

    // Re-use the getNext() method because I'm lazy.
    this.currentSongIndex = index - 1;
    return this.getNext();
  }

  // eslint-disable-next-line class-methods-use-this
  public getSongList() {
    return songs;
  }
}
