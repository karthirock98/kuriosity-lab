import { useEffect, useState } from "react";
import { StickyNote } from "@/components/ui/StickyNote";
import "@/assets/css/quotes.scss";
import quotes from "@/lib/quotes.json";
import { emotion_authors } from "@/lib/app.constants";
import { getQuoteBasedOnAuthorAndEmotion } from "@/services/common.service";
import { Button } from "@/components/ui/button";

type EmotionAuthor = {
  emotion: string;
  authors: string[];
};

const emotionData = emotion_authors as EmotionAuthor[];

const Quotes = () => {
  const [fetchedQuote, setFetchedQuote] = useState("");
  const [notes, setNotes] = useState<
    {
      text: string;
      color: string;
      x: number;
      y: number;
      rotation: number;
    }[]
  >([]);

  const [selectedEmotion, setSelectedEmotion] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  const availableAuthors =
    emotionData.find((item) => item.emotion === selectedEmotion)?.authors ?? [];

  useEffect(() => {
    const generateNotes = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const noteWidth = 192;
      const noteHeight = 208;
      const gap = 28;

      const columns = Math.max(
        1,
        Math.floor((width + gap) / (noteWidth + gap)),
      );

      const rows = Math.max(1, Math.floor((height + gap) / (noteHeight + gap)));

      const positions: { x: number; y: number }[] = [];

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
          positions.push({
            x:
              col * (width / columns) +
              Math.random() * Math.max(0, width / columns - noteWidth),
            y:
              row * (height / rows) +
              Math.random() * Math.max(0, height / rows - noteHeight),
          });
        }
      }

      setNotes(
        positions.map((position, index) => ({
          ...quotes[index % quotes.length],
          ...position,
          rotation: Math.random() * 8 - 4,
        })),
      );
    };

    generateNotes();
    window.addEventListener("resize", generateNotes);

    return () => window.removeEventListener("resize", generateNotes);
  }, []);

  const handleEmotionChange = (emotion: string) => {
    setSelectedEmotion(emotion);
    setSelectedAuthor("");
  };

  const handleFetch = async () => {
    if (!selectedEmotion || !selectedAuthor) return;

    setIsFetching(true);

    try {
      // Replace this with your quotes API request.
      const quoteRes = await getQuoteBasedOnAuthorAndEmotion({
        emotion: selectedEmotion,
        author: selectedAuthor,
      });
      setFetchedQuote(quoteRes.data);
    } catch (error) {
      console.error("Failed to fetch quotes:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const resetPage = ()=>{
    setSelectedAuthor("")
    setSelectedEmotion("")
    setFetchedQuote("")
  }

  return (
    <>
      <div className="glass-card" />

      <main className="quotes-scatter">
        {notes.map((note, index) => (
          <div
            className="quotes-scatter__note"
            key={index}
            style={{
              left: note.x,
              top: note.y,
              transform: `rotate(${note.rotation}deg)`,
            }}
          >
            <StickyNote text={note.text} color={note.color} />
          </div>
        ))}

        <div className="quotes-scatter__gloss" />
      </main>

      <div className="quote-search-box">
        {!fetchedQuote ? (
          <>
            <select
              value={selectedEmotion}
              onChange={(event) => handleEmotionChange(event.target.value)}
            >
              <option value="">Select emotion</option>
              {emotionData.map(({ emotion }) => (
                <option key={emotion} value={emotion}>
                  {emotion}
                </option>
              ))}
            </select>

            {selectedEmotion && (
              <select
                value={selectedAuthor}
                onChange={(event) => setSelectedAuthor(event.target.value)}
              >
                <option value="">Select author</option>
                {availableAuthors.map((author) => (
                  <option key={author} value={author}>
                    {author}
                  </option>
                ))}
              </select>
            )}

            {selectedAuthor && (
              <button className="q-btn" type="button" onClick={handleFetch} disabled={isFetching}>
                {isFetching ? "Fetching..." : "Fetch quotes"}
              </button>
            )}
          </>
        ) : (
          <div className="flex flex-col gap-2">
            <StickyNote className="popup-sticky-note" text={fetchedQuote} color="#E8F5E9" />
            <Button onClick={resetPage} variant="outline" className={"w-14 mx-auto"}>Reset</Button>
          </div>
        )}
      </div>
    </>
  );
};

export default Quotes;
