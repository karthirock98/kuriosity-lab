import axios from "axios"
const BASE_URL = "http://localhost:3333"


let cachedTLDs: string[] = [];
let lastFetchedAt = 0;

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export const fetchDomainData = async (domains: any) => {
    const res = await axios.post(`https://dotsweep.com/check`, domains);
    return res?.data?.results;
}
export const getTLDs = async () => {
    const now = Date.now();

    // Return cache if fetched within the last hour
    if (cachedTLDs.length && now - lastFetchedAt < CACHE_DURATION) {
        return cachedTLDs;
    }

    const res = await axios.get("https://dotsweep.com/tlds");

    cachedTLDs = res.data?.tlds || [];
    lastFetchedAt = now;

    return cachedTLDs;
};

// get random indian quote

export const getQuote = async() => {
    // const res =  await axios.get("https://indian-quotes-api.vercel.app/api/quotes/random");
    // console.log(res.data);
    const response = await fetch('/quotes-api/api/quotes/random');
const data = await response.json();
    console.log(data);
}