import type { GenderizeResponse, QuoteOfTheDayResponse } from "@/types/generic.type";
import axios, { type AxiosResponse } from "axios";
const BASE_URL = "http://localhost:3333";

let cachedTLDs: string[] = [];
let lastFetchedAt = 0;

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export const fetchDomainData = async (domains: any) => {
  const res = await axios.post(`https://dotsweep.com/check`, domains);
  return res?.data?.results;
};
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

export const getQuote = async () => {
  // const res =  await axios.get("https://indian-quotes-api.vercel.app/api/quotes/random");
  // console.log(res.data);
  const response = await fetch("/quotes-api/api/quotes/random");
  const data = await response.json();
  return data;
};

export const getUnsplashImages = async (search: string) => {
  if (search) {
    const res = await axios.get(
      `http://localhost:3333/generic/get-unsplash-images?searchValue=${search}`,
      { withCredentials: true },
    );
    return res?.data || null;
  }
};

export const getURLInvestigatedData = async (domain: string) => {
  if (domain) {
    const res = await axios.post(
      `http://localhost:3333/generic/investigate-url`,
      {
        domain,
      },
      { withCredentials: true },
    );
    return res?.data || null;
  }
};

export const getUserDataByGender = async (gender: "male" | "female") => {
  if (gender) {
    const result = await axios.get(
      `https://randomuser.me/api?gender=${gender}&inc=gender,nat,picture,location,dob,name`,
    );
    if (result.status === 200) {
      return result?.data?.results[0] || {};
    } else {
      return null;
    }
  }
};

export const getGenderByName = async (name: string) => {
  if (name) {
    const result: AxiosResponse<GenderizeResponse> = await axios.get(
      `https://api.genderize.io?name=${name}`,
    );
    if (result.status === 200) {
      return result?.data || {};
    } else {
      return null;
    }
  }
};

export const quoteOfTheDay = async () => {
   const result: AxiosResponse<any> = await axios.get(
      `http://localhost:3333/generic/quote-of-the-day`,
    );
    if (result.status === 200) {
      return result?.data || {};
    } else {
      return null;
    }
};

export const getQuoteBasedOnAuthorAndEmotion = async (payload: any) => {
   const result: AxiosResponse<any> = await axios.post(
      `http://localhost:3333/groq/quotes`, payload,  { withCredentials: true },
    );
    if (result.status === 200) {
      return result?.data || {};
    } else {
      return null;
    }
};

