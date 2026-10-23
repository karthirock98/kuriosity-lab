import { RestCountries } from "@yusifaliyevpro/countries";

const restCountries = new RestCountries({ apiKey: process.env.REST_COUNTRIES_API });

export const getCountriesByCountryCode = async (code) => {
    const response = await restCountries.getCountryByCode({
        alpha_2: code,
    });

    return response;
}