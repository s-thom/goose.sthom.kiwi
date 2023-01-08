import pmap from "p-map";

export interface HonkData {
  filename: string;
  frequency: number;
  buffer: AudioBuffer;
}

const honks: Pick<HonkData, "filename" | "frequency">[] = [
  { filename: "goose_honk_b_01.wav", frequency: 671 },
  { filename: "goose_honk_b_02.wav", frequency: 674 },
  { filename: "goose_honk_b_03.wav", frequency: 672 },
  { filename: "goose_honk_b_05.wav", frequency: 671 },
  { filename: "goose_honk_b_06.wav", frequency: 668 },
];
const quack: Pick<HonkData, "filename" | "frequency"> = {
  filename: "quack_5.mp3",
  frequency: 1,
};

async function getAudioBuffer(context: AudioContext, filename: string) {
  const response = await fetch(`/audio/${filename}`);
  const responseBuffer = await response.arrayBuffer();

  const audioBuffer = await context.decodeAudioData(responseBuffer);

  return audioBuffer;
}

export async function getHonkSources(
  context: AudioContext
): Promise<HonkData[]> {
  return pmap(honks, async (honk) => {
    const buffer = await getAudioBuffer(context, honk.filename);
    return {
      filename: honk.filename,
      frequency: honk.frequency,
      buffer,
    };
  });
}

export async function getQuackSource(context: AudioContext): Promise<HonkData> {
  const buffer = await getAudioBuffer(context, quack.filename);
  return {
    filename: quack.filename,
    frequency: quack.frequency,
    buffer,
  };
}
