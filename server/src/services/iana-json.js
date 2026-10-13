import axios from "axios";

const IANA_BOOTSTRAP_URL = "https://data.iana.org/rdap/dns.json";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

let cachedData = null;
let cacheExpiresAt = 0;

export async function getBootstrapData() {
  // Return cached data if it is still valid
  if (cachedData && Date.now() < cacheExpiresAt) {
    console.log("Using cached RDAP bootstrap data");
    return cachedData;
  }

  // Fetch fresh data
  console.log("Fetching RDAP bootstrap data");

  const response = await axios.get(IANA_BOOTSTRAP_URL, {
    timeout: 10000,
  });

  cachedData = response.data;
  cacheExpiresAt = Date.now() + CACHE_DURATION;

  return cachedData;
}