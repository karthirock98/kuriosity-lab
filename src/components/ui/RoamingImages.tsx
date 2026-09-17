import { useEffect } from "react";
import gsap from "gsap";
import * as companyLogos from '../../assets/company-logo'

const images = Object.values(companyLogos);

const RoamingImages = () => {
    useEffect(() => {
        const elements = gsap.utils.toArray<HTMLElement>(".roaming-image");

        elements.forEach((element) => {
            const move = () => {
                const width = element.offsetWidth;
                const height = element.offsetHeight;

                const maxX = window.innerWidth - width;
                const maxY = window.innerHeight - height;

                gsap.to(element, {
                    x: gsap.utils.random(0, maxX),
                    y: gsap.utils.random(0, maxY),

                    duration: gsap.utils.random(10, 15),

                    ease: "sine.inOut",

                    onComplete: move,
                });
            };

            // Give each image a different starting position
            gsap.set(element, {
                x: gsap.utils.random(0, window.innerWidth - element.offsetWidth),
                y: gsap.utils.random(0, window.innerHeight - element.offsetHeight),
            });

            // Start movement
            move();
        });

        return () => {
            gsap.killTweensOf(".roaming-image");
        };
    }, []);

    return (
        <div className="roaming-container">
            {images.map((image, index) => (
                <img
                    key={index}
                    src={image}
                    className="roaming-image"
                    alt=""
                />
            ))}
        </div>
    );
};

export default RoamingImages;