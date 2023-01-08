import { getHonkSources, getQuackSource, HonkData } from "./honks";

export class Player {
  private readonly context = new AudioContext();

  private honks: HonkData[] | undefined;

  private currentHonkIndex = 0;

  private quack: HonkData | undefined;

  private notes: number[] = [];

  private currentNoteIndex = 0;

  constructor() {
    this.init();
  }

  private async init() {
    this.honks = await getHonkSources(this.context);
    this.quack = await getQuackSource(this.context);
  }

  public setNotes(notes: number[]) {
    this.notes = notes;
  }

  public resetPlayback() {
    this.currentNoteIndex = 0;
  }

  public advanceNote() {
    if (!this.honks) {
      throw new Error("not ready");
    }

    this.currentHonkIndex = (this.currentHonkIndex + 1) % this.honks.length;
    this.currentNoteIndex += 1;
  }

  // eslint-disable-next-line class-methods-use-this
  private play(
    buffer: AudioBuffer,
    baseFrequency: number,
    intendedFrequency: number
  ) {
    // Need to clone the audio buffer, as each buffer can only be played once.
    const clone = this.context.createBuffer(
      buffer.numberOfChannels,
      buffer.length,
      buffer.sampleRate
    );
    // Copy channel data from buffer
    for (let i = 0; i < buffer.numberOfChannels; i++) {
      clone.copyToChannel(buffer.getChannelData(i), i);
    }

    const track = this.context.createBufferSource();
    track.buffer = clone;
    track.connect(this.context.destination);
    track.addEventListener("ended", () => track.disconnect());

    // Detune the playback by changing the playback rate.
    // There is the detune property, but this just changes the playback rate anyway.
    const frequencyRatio = intendedFrequency / baseFrequency;
    track.playbackRate.value = frequencyRatio;

    track.start(0);
  }

  public playHonk() {
    if (!this.honks) {
      throw new Error("not ready");
    }
    if (this.currentHonkIndex >= this.honks.length) {
      throw new Error("not enough honk");
    }
    if (this.currentNoteIndex >= this.notes.length) {
      throw new Error("past the end");
    }

    // Play the honk
    const honk = this.honks[this.currentHonkIndex]!;
    const note = this.notes[this.currentNoteIndex]!;

    this.play(honk.buffer, honk.frequency, note);
  }

  public playQuack() {
    if (!this.quack) {
      throw new Error("not ready");
    }

    this.play(this.quack.buffer, 1, 1);
  }

  public isComplete() {
    return this.currentNoteIndex >= this.notes.length;
  }
}
