
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { GenderizeResponse } from "@/types/generic.type";
import axios, { type AxiosResponse } from "axios";
import apiAxios from "./api-axios";

const BASE_URL = "http://localhost:3333";

let cachedTLDs: string[] = [];
let lastFetchedAt = 0;

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export const fetchDomainData = async (domains: any) => {
  const res = await axios.post("https://dotsweep.com/check", domains);
  return res?.data?.results;
};

export const getTLDs = async () => {
  const now = Date.now();

  if (cachedTLDs.length && now - lastFetchedAt < CACHE_DURATION) {
    return cachedTLDs;
  }

  const res = await axios.get("https://dotsweep.com/tlds");

  cachedTLDs = res.data?.tlds || [];
  lastFetchedAt = now;

  return cachedTLDs;
};

// Get random Indian quote
export const getQuote = async () => {
  const response = await fetch("/quotes-api/api/quotes/random");
  const data = await response.json();
  return data;
};

export const getUnsplashImages = async (search: string) => {
  if (!search) return null;

  const res = await apiAxios.get(
    `${BASE_URL}/generic/get-unsplash-images`,
    {
      params: { searchValue: search },
    },
  );

  return res?.data || null;
};

export const getURLInvestigatedData = async (domain: string) => {
  if (!domain) return null;

  const res = await apiAxios.post(
    `${BASE_URL}/generic/investigate-url`,
    { domain },
  );

  return res?.data || null;
};

export const getUserDataByGender = async (
  gender: "male" | "female",
) => {
  if (!gender) return null;

  const result: AxiosResponse = await axios.get(
    `https://randomuser.me/api?gender=${gender}&inc=gender,nat,picture,location,dob,name`,
  );

  if (result.status === 200) {
    return result?.data?.results[0] || {};
  }

  return null;
};

export const getGenderByName = async (name: string) => {
  if (!name) return null;

  const result: AxiosResponse<GenderizeResponse> = await axios.get(
    "https://api.genderize.io",
    { params: { name } },
  );

  if (result.status === 200) {
    return result?.data || {};
  }

  return null;
};

export const quoteOfTheDay = async () => {
  const result: AxiosResponse<any> = await apiAxios.get(
    `${BASE_URL}/generic/quote-of-the-day`,
  );

  if (result.status === 200) {
    return result?.data || {};
  }

  return null;
};

export const getQuoteBasedOnAuthorAndEmotion = async (payload: any) => {
  const result: AxiosResponse<any> = await apiAxios.post(
    `${BASE_URL}/groq/quotes`,
    payload,
  );

  if (result.status === 200) {
    return result?.data || {};
  }

  return null;
};

export const getCountryDetailsByCode = async (code: string) => {
  if (!code) return null;

  const result: AxiosResponse<any> = await apiAxios.get(
    `${BASE_URL}/rest-countires/countries`,
    {
      params: { code },
    },
  );

  if (result.status === 200) {
    return result?.data || {};
  }

  return null;
};
