import {
  CSSProperties,
  KeyboardEventHandler,
  useCallback,
  useRef,
  useState,
} from "react";

// Number of degrees the goose can rotate in each direction
const GOOSE_CRAZINESS = 5;

export interface GooseButtonProps {
  onClick?: () => void;
}

export function GooseButton({ onClick }: GooseButtonProps) {
  const [style, setStyle] = useState<CSSProperties>({});
  const timeoutHandleRef = useRef<number>();

  const addActiveStyles = useCallback(() => {
    const numDegrees =
      Math.floor((Math.random() - 0.5) * 2 * GOOSE_CRAZINESS * 100) / 100;

    setStyle({
      "--tw-scale-x": "1.1",
      "--tw-scale-y": "1.1",
      "--tw-rotate": `${numDegrees.toString(10)}deg`,
    } as CSSProperties);
  }, []);
  const removeActiveStyles = useCallback(() => {
    setStyle({});
  }, []);

  const onAction = useCallback(async () => {
    if (onClick) {
      try {
        onClick();
      } catch (err) {
        // Ignore error
      }
    }

    removeActiveStyles();
    requestAnimationFrame(() => addActiveStyles());
    if (timeoutHandleRef.current) {
      clearTimeout(timeoutHandleRef.current);
    }
    timeoutHandleRef.current = setTimeout(() => removeActiveStyles(), 200);
  }, [addActiveStyles, removeActiveStyles]);

  const onKeyDown = useCallback<KeyboardEventHandler>((event) => {
    if (event.key === " " || event.key === "Enter") {
      onAction();
    }
  }, []);

  return (
    <button
      id="big-goose"
      className="transform transition-transform hover:scale-[98deg] motion-reduce:transition-none motion-reduce:focus-within:transform-none motion-reduce:hover:transform-none"
      aria-label="Goose"
      onPointerDown={onAction}
      onKeyDown={onKeyDown}
      style={style}
    >
      <img
        alt="Click to play sound"
        src="/goose.png"
        decoding="async"
        width="256"
        height="256"
      />
    </button>
  );
}
