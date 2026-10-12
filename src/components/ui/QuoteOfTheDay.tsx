import type { QuoteOfTheDayResponse } from "@/types/generic.type";
import "../../assets/css/quote-of-the-day.scss";

// const quote = {
//   author: {
//     imageUrl:
//       "https://static.quoterism.com/assets/images/authors/a1x9owzkhr0pewu4.jpg",
//     name: "Friedrich Nietzsche",
//   },
//   text: "There is not enough religion in the world even to destroy religion.",
// };

const QuoteOfTheDay = ({ quote }: any) => {
  return (
    <>
      {quote.author && (
        <div className="quote-of-the-day-container">
          <div className="quote-card">
            <div className="quote-author-image">
              <img
                src={quote?.author.imageUrl}
                alt={quote?.author.name}
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="quote-content">
              <span className="quote-label">QUOTE OF THE DAY</span>

              <span className="quote-mark">“</span>

              <p className="quote-text">{quote?.text}</p>

              <div className="quote-author">
                <span className="author-line" />
                <div>
                  <h3>{quote.author.name}</h3>
                  <span className="author-caption">A thought to remember</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuoteOfTheDay;
