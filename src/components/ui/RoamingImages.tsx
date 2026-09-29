import { useEffect } from "react";
import gsap from "gsap";
import * as companyLogos from "../../assets/company-logo";

const baseImages = Object.values(companyLogos);

// Show 30 logos
const images = Array.from(
    { length: 40 },
    (_, index) => baseImages[index % baseImages.length]
);

const RoamingImages = () => {
    useEffect(() => {
        const container = document.querySelector(
            ".roaming-container"
        ) as HTMLElement;

        if (!container) return;

        const elements =
            gsap.utils.toArray<HTMLElement>(".roaming-image");

        const { width, height } =
            container.getBoundingClientRect();

        // Store positions already occupied by logos
        const placed: {
            left: number;
            top: number;
            width: number;
            height: number;
        }[] = [];

        // Center area reserved for the domain input
        const centerSafeZone = {
            left: width * 0.28,
            right: width * 0.72,
            top: height * 0.30,
            bottom: height * 0.70,
        };

        /*
         * Check if a logo would overlap
         * another already placed logo.
         */
        const isOverlapping = (
            left: number,
            top: number,
            logoWidth: number,
            logoHeight: number
        ) => {
            const padding = 30;

            return placed.some((item) => {
                return (
                    left <
                        item.left +
                            item.width +
                            padding &&
                    left +
                        logoWidth +
                        padding >
                        item.left &&
                    top <
                        item.top +
                            item.height +
                            padding &&
                    top +
                        logoHeight +
                        padding >
                        item.top
                );
            });
        };

        /*
         * Keep the center clear.
         */
        const isInsideCenter = (
            left: number,
            top: number,
            logoWidth: number,
            logoHeight: number
        ) => {
            return (
                left <
                    centerSafeZone.right &&
                left + logoWidth >
                    centerSafeZone.left &&
                top <
                    centerSafeZone.bottom &&
                top + logoHeight >
                    centerSafeZone.top
            );
        };

        elements.forEach((element) => {
            const logoWidth =
                element.offsetWidth;

            const logoHeight =
                element.offsetHeight;

            let left = 0;
            let top = 0;
            let found = false;

            /*
             * Try many random positions until
             * we find a free position.
             */
            for (
                let attempt = 0;
                attempt < 1000;
                attempt++
            ) {
                left = gsap.utils.random(
                    15,
                    width -
                        logoWidth -
                        15
                );

                top = gsap.utils.random(
                    15,
                    height -
                        logoHeight -
                        15
                );

                const insideCenter =
                    isInsideCenter(
                        left,
                        top,
                        logoWidth,
                        logoHeight
                    );

                const overlapping =
                    isOverlapping(
                        left,
                        top,
                        logoWidth,
                        logoHeight
                    );

                if (
                    !insideCenter &&
                    !overlapping
                ) {
                    found = true;
                    break;
                }
            }

            /*
             * Fallback if there isn't enough
             * available space.
             */
            if (!found) {
                left = gsap.utils.random(
                    15,
                    width -
                        logoWidth -
                        15
                );

                top = gsap.utils.random(
                    15,
                    height -
                        logoHeight -
                        15
                );
            }

            // Remember occupied area
            placed.push({
                left,
                top,
                width: logoWidth,
                height: logoHeight,
            });

            // ------------------------------------------------
            // Initial appearance
            // ------------------------------------------------

            const scale =
                gsap.utils.random(
                    0.85,
                    1.05
                );

            const opacity =
                gsap.utils.random(
                    0.7,
                    0.9
                );

            const rotation =
                gsap.utils.random(
                    -2,
                    2
                );

            gsap.set(element, {
                left,
                top,

                x: 0,
                y: 0,

                scale,
                opacity,
                rotation,
            });

            // ------------------------------------------------
            // Individual roaming area
            // ------------------------------------------------

            const roamX =
                gsap.utils.random(
                    8,
                    18
                );

            const roamY =
                gsap.utils.random(
                    8,
                    18
                );

            /*
             * One timeline per logo.
             *
             * Important:
             * Only this timeline controls x/y.
             */
            const timeline =
                gsap.timeline({
                    repeat: -1,

                    delay:
                        gsap.utils.random(
                            0,
                            4
                        ),
                });

            // Move slightly right
            timeline.to(element, {
                x: roamX,

                y: gsap.utils.random(
                    -roamY,
                    roamY
                ),

                duration:
                    gsap.utils.random(
                        3,
                        5
                    ),

                ease: "sine.inOut",
            });

            // Move left
            timeline.to(element, {
                x: -roamX,

                y: gsap.utils.random(
                    -roamY,
                    roamY
                ),

                duration:
                    gsap.utils.random(
                        3,
                        5
                    ),

                ease: "sine.inOut",
            });

            // Move slightly right again
            timeline.to(element, {
                x: gsap.utils.random(
                    0,
                    roamX
                ),

                y: gsap.utils.random(
                    -roamY,
                    roamY
                ),

                duration:
                    gsap.utils.random(
                        3,
                        5
                    ),

                ease: "sine.inOut",
            });

            // Slowly return to original position
            timeline.to(element, {
                x: 0,
                y: 0,

                duration:
                    gsap.utils.random(
                        4,
                        6
                    ),

                ease: "sine.inOut",
            });
        });

        // Cleanup
        return () => {
            gsap.killTweensOf(elements);
        };
    }, []);

    return (
        <div className="roaming-container">
            {images.map(
                (image, index) => (
                    <img
                        key={index}
                        src={image}
                        className="roaming-image"
                        alt=""
                    />
                )
            )}
        </div>
    );
};

export default RoamingImages;