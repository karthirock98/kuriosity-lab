import "@/assets/css/zig-zag.css";

export type StepStatus = "done" | "in-progress" | "pending";

export interface ZigzagStep {
  id?: string | number;
  label?: string;
  status: StepStatus;
}

interface ZigzagProgressProps {
  /** Steps in order. Rows snake: L→R, then R→L, ... */
  steps?: ZigzagStep[];
  /** How many boxes per row (default 2). */
  columns?: number;
}

type Direction = "right" | "left" | "down";
type ConnState = "pending" | "done" | "active";

export default function ZigzagProgress({
  steps = [],
  columns = 2,
}: ZigzagProgressProps) {
  return (
    <div
      className="zz"
      style={{ gridTemplateColumns: `repeat(${columns}, var(--zz-cell-x))` }}
    >
      {steps.map((step, i) => {
        const rowIdx = Math.floor(i / columns);
        const pos = i % columns;
        const leftToRight = rowIdx % 2 === 0;
        const col = leftToRight ? pos + 1 : columns - pos;

        const next = steps[i + 1];
        const isRowEnd = (i + 1) % columns === 0;
        const dir: Direction = isRowEnd ? "down" : leftToRight ? "right" : "left";

        // connector state depends on the pair of steps it joins
        let connState: ConnState = "pending";
        if (next) {
          if (step.status === "done" && next.status === "done") connState = "done";
          else if (step.status === "done" && next.status === "in-progress")
            connState = "active";
        }

        return (
          <div
            key={step.id ?? i}
            className={`zz-step zz-step--${step.status}`}
            style={{ gridRow: rowIdx + 1, gridColumn: col }}
            title={step.label}
            aria-label={step.label ? `${step.label}: ${step.status}` : undefined}
          >
            <span className="zz-label">
              {step.status === "done" && <span className="zz-check">✓ </span>}
              {step.label ?? i + 1}
            </span>

            {next && (
              <span className={`zz-conn zz-conn--${dir} zz-conn--${connState}`}>
                {connState === "active" && <span className="zz-dot" />}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ---------- usage ----------
import ZigzagProgress, { type ZigzagStep } from "@/components/ZigzagProgress";

const steps: ZigzagStep[] = [
  { id: 1, label: "Order placed", status: "done" },
  { id: 2, label: "Packed", status: "done" },
  { id: 3, label: "Shipped", status: "in-progress" },
  { id: 4, label: "Out for delivery", status: "pending" },
  { id: 5, label: "Delivered", status: "pending" },
];

<ZigzagProgress steps={steps} columns={2} />
-------------------------------- */