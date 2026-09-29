import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState
} from "react";

import "../../assets/css/quote-banner.scss";
import quote_icon from "../../assets/quote.png";
import { getQuote } from "@/services/common.service";

export interface QuoteBannerRef {
  refreshQuote: () => void;
}

const QuoteBanner = forwardRef<QuoteBannerRef>((_, ref) => {

  const [quote, setQuote] = useState<any>(null);

  const refreshQuote = async () => {
    try {
      const data = await getQuote();
      setQuote(data);
    } catch (error) {
      console.error("Failed to fetch quote", error);
    }
  };

  useImperativeHandle(ref, () => ({
    refreshQuote
  }));

  useEffect(() => {
    refreshQuote();
  }, []);

  return (
    <div className="quote-banner-main">

      <img
        src={quote_icon}
        className="quote-banner-icon"
        alt=""
      />

      <span className="quote-banner-quote">
        {quote?.quote}
      </span>

      <div className="quote-banner-author">
        <span className="quote-banner-author-name">
          {quote?.author?.name}
        </span>

        {quote?.company?.name && (
          <>
            <span className="quote-banner-separator">·</span>
            <span className="quote-banner-company">
              {quote.company.name}
            </span>
          </>
        )}
      </div>

    </div>
  );
});

export default QuoteBanner;