import "@/assets/css/zig-zag.css";
import type { FileStatusMessage } from "@/services/file-management.service";

interface ZigzagProgressProps {
  /** Steps in order. Rows snake: L→R, then R→L, ... */
  steps?: FileStatusMessage[];
  /** How many boxes per row (default 2). */
  columns?: number;
}

type Direction = "right" | "left" | "down";
type ConnState = "pending" | "completed" | "active" | "failed";

function StatusIcon({ status, index }: { status: string; index: number }) {
  const svgProps = {
    viewBox: "0 0 24 24",
    width: 14,
    height: 14,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 3,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (status) {
    case "completed":
      return (
        <span className="zz-icon zz-icon--completed" aria-hidden="true">
          <svg {...svgProps}>
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </span>
      );
    case "failed":
      return (
        <span className="zz-icon zz-icon--failed" aria-hidden="true">
          <svg {...svgProps}>
            <path d="M7 7l10 10M17 7L7 17" />
          </svg>
        </span>
      );
    case "processing":
      return (
        <span className="zz-icon zz-icon--processing" aria-hidden="true">
          <span className="zz-spinner" />
        </span>
      );
    default:
      return (
        <span className="zz-icon zz-icon--pending" aria-hidden="true">
          {index + 1}
        </span>
      );
  }
}

export default function ZigzagProgress({
  steps = [],
  columns = 2,
}: ZigzagProgressProps) {
  return (
    <div
      className="zz"
      role="list"
      style={{ gridTemplateColumns: `repeat(${columns}, var(--zz-box-w))` }}
    >
      {steps.map((step, i) => {
        const rowIdx = Math.floor(i / columns);
        const pos = i % columns;
        const leftToRight = rowIdx % 2 === 0;
        const col = leftToRight ? pos + 1 : columns - pos;

        const next = steps[i + 1];
        const isRowEnd = (i + 1) % columns === 0;
        const dir: Direction = isRowEnd ? "down" : leftToRight ? "right" : "left";

        // the connector's look depends on the pair of steps it joins
        let connState: ConnState = "pending";
        if (next && step.status === "completed") {
          if (next.status === "completed") connState = "completed";
          else if (next.status === "processing") connState = "active";
          else if (next.status === "failed") connState = "failed";
        }

        const label = step.msg ?? `Step ${i + 1}`;

        return (
          <div
            key={step.id ?? i}
            role="listitem"
            className={`zz-step zz-step--${step.status}`}
            style={{ gridRow: rowIdx + 1, gridColumn: col }}
            aria-label={`${label}: ${step.status}`}
          >
            <StatusIcon status={step.status} index={i} />
            <span className="zz-label">{label}</span>

            {next && (
              <span
                aria-hidden="true"
                className={`zz-conn zz-conn--${dir} zz-conn--${connState}`}
              >
                {connState === "active" && <span className="zz-dot" />}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}