import { useEffect, useState } from "react";
import jokeImg from "../../assets/joke.png";
import "../../assets/css/joke-banner.scss";

const JOKE_API =
    "https://v2.jokeapi.dev/joke/Dark?blacklistFlags=nsfw,racist,sexist,explicit&type=single";

const DAD_JOKE_API = "https://icanhazdadjoke.com/";

const JokeBanner = () => {
    const [showJoke, setShowJoke] = useState(false);
    const [joke, setJoke] = useState("");
    const [loading, setLoading] = useState(false);

    // false = JokeAPI, true = Dad Joke
    const [useDadJoke, setUseDadJoke] = useState(false);

    const fetchJoke = async () => {
        try {
            setLoading(true);

            let jokeText = "";

            if (useDadJoke) {
                const response = await fetch(DAD_JOKE_API, {
                    headers: {
                        Accept: "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch dad joke");
                }

                const data = await response.json();

                jokeText = data.joke;
            } else {
                const response = await fetch(JOKE_API);

                if (!response.ok) {
                    throw new Error("Failed to fetch joke");
                }

                const data = await response.json();

                jokeText = data.joke;
            }

            setJoke(jokeText);

            // Switch API for next joke
            setUseDadJoke((prev) => !prev);

        } catch (error) {
            console.error("Failed to load joke:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJoke();
    }, []);

    return (
        <div className="joke-container">

            <button
                className="joke-icon"
                onClick={() => setShowJoke((prev) => !prev)}
            >
                <img src={jokeImg} alt="Joke" />
            </button>

            {showJoke && joke && (
                <div className="joke-tooltip">

                    <div className="joke-text">
                        {joke}
                    </div>

                    <button
                        className="joke-refresh"
                        onClick={fetchJoke}
                        disabled={loading}
                        title="Get another joke"
                    >
                        ↻
                    </button>

                </div>
            )}

        </div>
    );
};

export default JokeBanner;