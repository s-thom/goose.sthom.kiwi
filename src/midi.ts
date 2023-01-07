import { Midi } from "@tonejs/midi";

interface MusicMeta {
  id: string;
  name: string;
  emoji: string;
}

export interface MusicData {
  meta: MusicMeta;
  notes: number[];
}

const KNOWN_FILES: MusicMeta[] = [
  { id: "popcorn", name: "Popcorn", emoji: "🍿" },
];

const CACHE: { [key: string]: number[] } = {};

/** https://gist.github.com/YuxiUx/ef84328d95b10d0fcbf537de77b936cd */
function noteToFreq(note: number) {
  const A = 440; // frequency of A (coomon value is 440Hz)
  return (A / 32) * 2 ** ((note - 9) / 12);
}

async function getNotes(id: string): Promise<number[]> {
  if (CACHE[id]) {
    return CACHE[id];
  }

  const midi = await Midi.fromUrl(`/midi/${id}.mid`);

  const notes = midi.tracks[0].notes.map((n) => noteToFreq(n.midi));

  CACHE[id] = notes;
  return notes;
}

export async function getNext(): Promise<MusicData> {
  const meta = KNOWN_FILES[Math.floor(Math.random() * KNOWN_FILES.length)];
  const notes = await getNotes(meta.id);

  return {
    meta,
    notes,
  };
}
