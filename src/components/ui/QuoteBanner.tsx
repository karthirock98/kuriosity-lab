import { useEffect } from "react"
import "../../assets/css/quote-banner.scss"
import quote_icon from "../../assets/quote.png"
import { getQuote } from "@/services/common.service"

const QuoteBanner = () => {
    useEffect(() => {
        getQuote()
    },[])
    return (
        <div className="quote-banner-main">
            <img src={quote_icon} className="w-3.5 h-auto"/>
            Hello
        </div>
    )
}

export default QuoteBanner;