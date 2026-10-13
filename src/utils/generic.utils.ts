import { parse } from "tldts";
import transmitters from "@/lib/human-chemical-messengers.json";

export const urlBreaker = (url: string) => {
  return parse(url);
};

export const generatePillPositions = (items: typeof transmitters) => {
  // avoid top right area to avoid menu overlapping
  const avoidTopRight = (
    x: number,
    y: number,
    width: number,
    height: number,
  ) => {
    const areaWidth = 70;
    const areaHeight = 30;

    const areaLeft = window.innerWidth - areaWidth;
    const areaTop = 0;

    return (
      x < areaLeft + areaWidth &&
      x + width > areaLeft &&
      y < areaTop + areaHeight &&
      y + height > areaTop
    );
  };

  const placed: {
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
  }[] = [];

  const gap = 12;
  const maxAttempts = 200;

  return items.map((item, id) => {
    // Approximate pill width based on its text
    const width = Math.min(Math.max(item.name.length * 8 + 24, 70), 320);
    const height = 40;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const x = Math.random() * (window.innerWidth - width);
      const y = Math.random() * (window.innerHeight - height);

      if (avoidTopRight(x, y, width, height)) {
        continue;
      }

      const overlaps = placed.some(
        (p) =>
          x < p.x + p.width + gap &&
          x + width + gap > p.x &&
          y < p.y + p.height + gap &&
          y + height + gap > p.y,
      );

      if (!overlaps) {
        placed.push({ id, x, y, width, height });
        return { ...item, id, x, y };
      }
    }

    // Fallback if no free position is found
    const x = Math.random() * (window.innerWidth - width);
    const y = Math.random() * (window.innerHeight - height);

    placed.push({ id, x, y, width, height });
    return { ...item, id, x, y };
  });
};
