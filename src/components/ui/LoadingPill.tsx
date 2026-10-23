import { useEffect, useState } from "react";
import load1 from "@/assets/gifs/load-1.gif";
import load2 from "@/assets/gifs/load-2.gif";
import load3 from "@/assets/gifs/load-3.gif";
import "@/assets/css/LoadingPill.scss"

const gifs = [load1, load2, load3];

const worldFacts = [
  "~4 babies are born every second",
  "Lightning strikes Earth roughly 100 times per second",
  "The ISS travels around Earth at about 28,000 km/h",
  "Somewhere on Earth, it's sunrise right now",
];

const LoadingPill = () => {
  const [factIndex, setFactIndex] = useState(0);
  const [gifIndex, setGifIndex] = useState(0);

  useEffect(() => {
    const factTimer = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % worldFacts.length);
    }, 2500);

    const gifTimer = setInterval(() => {
      setGifIndex((prev) => (prev + 1) % gifs.length);
    }, 1500);

    return () => {
      clearInterval(factTimer);
      clearInterval(gifTimer);
    };
  }, []);

  return (
    <div className="pill-container">
      <div className="gifs">
        <img src={gifs[gifIndex]} alt="" />
      </div>

      <div className="loading-content">
        <span className="loading-title">Loading...</span>
        <span className="world-label">
          Meanwhile in the world
        </span>
        <span className="world-fact" key={factIndex}>
          {worldFacts[factIndex]}
        </span>
      </div>
    </div>
  );
};

export default LoadingPill;