import { useRef, useState } from "react";
import "../assets/css/unsplash.scss";
import { getUnsplashImages } from "@/services/common.service";
import { LANDING_BG_IMAGES } from "@/lib/app.constants";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button";
import NavigationMenuComp from "@/components/ui/NavigationMenu";

const Unsplash = () => {
    const landingImages = LANDING_BG_IMAGES;
    const scrollingImages = [...landingImages, ...landingImages];
    const searchField = useRef<HTMLInputElement>(null);
    const [isLeaving, setIsLeaving] = useState(false);
    const [images, setImages] = useState([]);

    const loadImages = async () => {
        const res = await getUnsplashImages(searchField.current?.value || "");
        setImages(res?.data || [])
    }

    const ImageGroup = ({ prefix }: { prefix: string }) => (
        <div className="image-group">
            {landingImages.map((image, index) => (
                <img
                    key={`${prefix}-${index}`}
                    src={image}
                    alt=""
                    className={`image-wall-item item-${index % 8}`}
                />
            ))}
            <div className="frosted-glass"></div>
        </div>
    );

    return (
        <>

            <div
                className={`fixed flex-col top-10 left-[35%] z-10 flex gap-4 items-center slide-box ${isLeaving ? "move-away" : ""
                    }`}
            >
                <div className="flex items-center gap-4">
                    <div>
                        <Tooltip>
                            <TooltipTrigger render={<Button variant="yellow">Hover Me!</Button>} />
                            <TooltipContent side="bottom">
                                <p>
                                    🧭 Explore freely! This is a free API, so please use it wisely —
                                    let’s not make it regret being free. 😂
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                    {/* Input */}
                    <div className="flex gap-4 items-center">
                        <div className="input-container">
                            <input placeholder="Search Image" ref={searchField} type="text" />
                        </div>
                        <button className="back-to-top-btn" onClick={() => {
                            setIsLeaving(true); loadImages();
                        }} >
                            <svg
                                className="back-to-top-icon"
                                fill="#666666"
                                width="100px"
                                height="100px"
                                viewBox="0 0 15 15"
                            >
                                <path
                                    d="M8.29289 2.29289C8.68342 1.90237 9.31658 1.90237 9.70711 2.29289L14.2071 6.79289C14.5976 7.18342 14.5976 7.81658 14.2071 8.20711L9.70711 12.7071C9.31658 13.0976 8.68342 13.0976 8.29289 12.7071C7.90237 12.3166 7.90237 11.6834 8.29289 11.2929L11 8.5H1.5C0.947715 8.5 0.5 8.05228 0.5 7.5C0.5 6.94772 0.947715 6.5 1.5 6.5H11L8.29289 3.70711C7.90237 3.31658 7.90237 2.68342 8.29289 2.29289Z"
                                />
                            </svg>
                        </button>
                    </div>

                </div>
            </div>
            {/* Reset */}
            <div className={`fixed top-4 z-10 right-4 ${!images.length ? 'hidden' : ''}`}>
                <button
                    className="bg-white text-center w-48 rounded-2xl h-14 relative text-black text-xl font-semibold group cursor-pointer"
                    type="button"
                    onClick={() => {
                        setImages([])
                        setIsLeaving(false);

                    }
                    }
                >
                    <div
                        className="bg-green-400 rounded-xl h-12 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[184px] z-10 duration-500"
                    >
                        <svg width="25px" height="25px" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" stroke-width="3" stroke="#000000" fill="none"><path d="M53.72,36.61A21.91,21.91,0,1,1,50.37,20.1" /><polyline points="51.72 7.85 50.85 20.78 37.92 19.9" /><path d="M53.72,36.61A21.91,21.91,0,1,1,50.37,20.1" /><polyline points="51.72 7.85 50.85 20.78 37.92 19.9" /></svg>
                    </div>
                    <p className="translate-x-2">Reset</p>
                </button>
            </div>




            <div className={`image-wall ${images.length ? 'hidden' : ''}`}>
                <div className="image-track">
                    <ImageGroup prefix="first" />
                    <ImageGroup prefix="second" />
                </div>
            </div>



            <div className="flexbox">
                {images.map((item, index) => (
                    <div className="item-img" key={index}>
                        <img src={item} alt="" />
                    </div>
                ))}
            </div>

            <div className="absolute bottom-0 left-0 z-50">

                <NavigationMenuComp />
            </div>
        </>
    )
}

export default Unsplash;