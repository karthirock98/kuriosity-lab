import { useEffect, useState } from "react";
import "./App.css";

import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

import "altcha";
import type { } from "altcha/types/react";
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import axios from "axios";
import galaxy from './assets/galaxy.jpg'
import galaxy2 from './assets/galaxy-2.jpg'
import galaxy3 from './assets/galaxy-3.jpg'
import "altcha/themes/aqua.css";
import { Presets, SplitFlap } from 'react-split-flap'

function App() {
  // Blinking stars
  useEffect(() => {
    const stars = document.querySelector(".stars");

    if (!stars) return;

    for (let i = 0; i < 45; i++) {
      const star = document.createElement("span");

      star.className = "star";

      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;

      const size = 1 + Math.random() * 2;

      star.style.width = `${size}px`;
      star.style.height = `${size}px`;

      star.style.animationDuration = `${2 + Math.random() * 4}s`;
      star.style.animationDelay = `${Math.random() * 5}s`;

      stars.appendChild(star);
    }

    return () => {
      stars.innerHTML = "";
    };
  }, []);


  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, axis: 'y' }, [Autoplay()])
  useEffect(() => {
    if (!emblaApi) return
    emblaApi.plugins().autoplay?.play()
  }, [emblaApi])

  const goToPrev = () => emblaApi?.scrollPrev()
  const goToNext = () => emblaApi?.scrollNext()
  const [altchaPayload, setAltchaPayload] = useState("");

  const handleAltchaState = (event: Event) => {
    const customEvent = event as CustomEvent;

    console.log("ALTCHA:", customEvent.detail);

    if (customEvent.detail?.state === "verified") {
      const payload = customEvent.detail.payload;

      console.log("Solved payload:", payload);

      setAltchaPayload(payload);
    }
  };

  const login = async () => {
    if (!altchaPayload) {
      alert("Please complete ALTCHA verification");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3333/auth/login",
        {
          username: "test",
          password: "test123",
          altcha: altchaPayload,
        }
      );

      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="flex gap-4 h-screen justify-between">
        <div className="flex flex-col items-center justify-center w-full">
          <div className="stars">
          </div>
          <div className="pb-6">
            <SplitFlap value="Kuriosity Lab" mode="chars" size="medium" duration={2000} animateOnMount chars={Presets.ALPHANUM} theme="dark" />
          </div>
          <div className="card shadow">

            <Input placeholder="Enter your name to find who u are" />

            <altcha-widget
              theme="aqua"
              challenge="http://localhost:3333/auth/altcha/challenge"
              ref={(element) => {
                if (element) {
                  element.addEventListener(
                    "statechange",
                    handleAltchaState
                  );
                }
              }}
            />

            <Button
              variant="default"
              onClick={login}
              disabled={!altchaPayload}
            >
              Login
            </Button>

          </div>
        </div>

        <div className="flex flex-col items-center w-full justify-center">
          <div className="embla">
            <div className="embla__viewport" ref={emblaRef}>
              <div className="embla__container">
                <div className="embla__slide"><img src={galaxy} /></div>
                <div className="embla__slide"><img src={galaxy2} /></div>
                <div className="embla__slide"><img src={galaxy3} /></div>
              </div>
            </div>

            {/* <button className="embla__prev" onClick={goToPrev}>
              Scroll to prev
            </button>
            <button className="embla__next" onClick={goToNext}>
              Scroll to next
            </button> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;