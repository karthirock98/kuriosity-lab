import transmitters from "../lib/human-chemical-messengers.json";
import "../assets/css/pill.scss";
import { useMemo, useState } from "react";
import { generatePillPositions } from "@/utils/generic.utils";
import HormoneDetails from "@/components/ui/HormoneDetails";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Hormones = () => {
  const [pillsDetailsOpen, setpillsDetailsOpen] = useState(false);
  const [selectedPillDetail, setselectedPillDetail] = useState<any>(null);
  const pills = useMemo(() => generatePillPositions(transmitters), []);
  const showPillDetails = (id: number) => {
    pills.map((itme) => {
      if (itme.id === id) {
        setselectedPillDetail(itme);
        setpillsDetailsOpen(true);
      }
    });
  };
  return (
    <div className="hormones-main">
      <svg className="pill-connections">
        {pills.map((pill) => {
          const nearest = pills
            .filter((other) => other.id !== pill.id)
            .map((other) => ({
              ...other,
              distance: Math.hypot(other.x - pill.x, other.y - pill.y),
            }))
            .filter((other) => other.distance < 220)
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 2);

          return nearest.map((other) => {
            // Draw each connection only once
            if (pill.id > other.id) return null;

            return (
              <path
                key={`${pill.id}-${other.id}`}
                d={(() => {
                  const midX = (pill.x + other.x) / 2;
                  const midY = (pill.y + other.y) / 2;

                  const dx = other.x - pill.x;
                  const dy = other.y - pill.y;

                  // Slight perpendicular offset
                  const curve = 8;
                  const cx = midX - (dy / Math.hypot(dx, dy)) * curve;
                  const cy = midY + (dx / Math.hypot(dx, dy)) * curve;

                  return `M ${pill.x} ${pill.y} Q ${cx} ${cy} ${other.x} ${other.y}`;
                })()}
                className="connection-line"
              />
            );
          });
        })}
      </svg>

      {pills.map((pill) => (
        <div
          onClick={() => showPillDetails(pill.id)}
          key={pill.id}
          className="pill jiggle"
          style={{
            left: `${pill.x}px`,
            top: `${pill.y}px`,
            animationDelay: `${Math.random() * -1}s`,
          }}
        >
          {pill.name}
        </div>
      ))}

      <Dialog open={pillsDetailsOpen} onOpenChange={setpillsDetailsOpen}>
        <DialogContent className="w-full max-w-300 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Selected Drug Details</DialogTitle>
          </DialogHeader>

          <HormoneDetails details={selectedPillDetail} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Hormones;
