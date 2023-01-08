import type { Song } from "./songs";

// Number of degrees the goose can rotate in each direction
const GOOSE_CRAZINESS = 5;

export type LabelState =
  | { state: "loading" }
  | { state: "playing"; song: Song };

export class UiHandler {
  private gooseButton =
    document.querySelector<HTMLButtonElement>("#big-goose")!;

  private skipButton = document.querySelector<HTMLButtonElement>("#skip")!;

  private label =
    document.querySelector<HTMLParagraphElement>("#big-goose-label")!;

  private handle: number | undefined;

  constructor(
    private readonly onGooseClick: () => void,
    private readonly onNextClick: () => void
  ) {
    this.gooseButton.addEventListener(
      "pointerdown",
      this.onMouseDown.bind(this)
    );
    this.gooseButton.addEventListener("keydown", this.onKey.bind(this));
    this.skipButton.addEventListener("click", () => onNextClick());
  }

  private addActiveStyles() {
    this.gooseButton.style.setProperty("--tw-scale-x", "1.1");
    this.gooseButton.style.setProperty("--tw-scale-y", "1.1");
    this.gooseButton.style.setProperty(
      "--tw-rotate",
      `${(
        Math.floor((Math.random() - 0.5) * 2 * GOOSE_CRAZINESS * 100) / 100
      ).toString(10)}deg`
    );
  }

  private removeActiveStyles() {
    this.gooseButton.style.removeProperty("--tw-scale-x");
    this.gooseButton.style.removeProperty("--tw-scale-y");
    this.gooseButton.style.removeProperty("--tw-rotate");
  }

  private queueAnim() {
    this.removeActiveStyles();
    requestAnimationFrame(() => this.addActiveStyles());
    if (this.handle) {
      clearTimeout(this.handle);
    }
    this.handle = setTimeout(() => this.removeActiveStyles(), 200);
  }

  private onMouseDown() {
    this.queueAnim();
    this.onGooseClick();
  }

  private onKey(event: KeyboardEvent) {
    if (event.key === " " || event.key === "Enter") {
      this.onMouseDown();
    }
  }

  public setLabel(state: LabelState) {
    switch (state.state) {
      case "loading":
        this.label.textContent = `Now playing: Loading... 🔄`;
        break;
      case "playing":
        this.label.textContent = `Now playing: ${state.song.emoji} (${state.song.name})`;
        break;
      default:
    }
  }
}
