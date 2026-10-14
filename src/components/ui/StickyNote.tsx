
import { useEffect, useRef } from "react";
import "../../assets/css/sticky-note.scss";

interface StickyNoteProps {
  color?: string;
  text: string;
  className?: string
}

export function StickyNote({
  color = "#f8ea69",
  text,
  className = ""
}: StickyNoteProps) {
  const noteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const note = noteRef.current;
    if (!note) return;

    let timeout: ReturnType<typeof setTimeout>;
    let cancelled = false;

    const animateFold = () => {
      if (cancelled) return;

      const size = Math.floor(Math.random() * 45) + 5;
      const duration = Math.random() * 1.2 + 0.5;

      note.style.setProperty("--fold-duration", `${duration}s`);
      note.style.setProperty("--fold-border", `0 0 ${size}px ${size}px`);

      timeout = setTimeout(() => {
        if (cancelled) return;

        note.style.setProperty("--fold-border", "0px");

        timeout = setTimeout(
          animateFold,
          Math.random() * 500 + 150
        );
      }, duration * 1000);
    };

    animateFold();

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div
      ref={noteRef}
      className={"sticky-note " + className}
      style={{ "--note-color": color } as React.CSSProperties}
    >
      <div className="sticky-note__text">{text}</div>
    </div>
  );
}
