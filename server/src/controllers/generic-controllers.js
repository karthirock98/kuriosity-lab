import { normalizeUrl } from "../helpers/generic-helper.js";
import DomainInvestigationService from "../services/domain-investigate.service.js";
import { createResponse } from "../utils/common-utils.js";
import axios from "axios";


export const getUnsplashImages = async (req, res) => {
  try {
    const searchValue = req?.query?.searchValue;
    const getSplashResponse = await axios.get(
      `https://api.unsplash.com/search/photos?query=${searchValue}&per_page=10`,
      { headers: { Authorization: "Client-ID " + process.env.UNSPLASH_KEY } },
    );
    getSplashResponse.data = getSplashResponse.data.results.map(
      (item) => item?.urls?.regular,
    );
    res
      .status(200)
      .json(createResponse(200, getSplashResponse.data, "Success!"));
    return "success";
  } catch (error) {
    res.status(500).json(createResponse(500, "", "Something Went Wrong!", ""));
  }
};

export const investigateURL = async (req, res, next) => {
  try {
    const domain = req.body.domain;
    const cleanDomain = domain
      .trim()
      .replace(/^https?:\/\//i, "")
      .split(/[/?#]/)[0]
      .replace(/:\d+$/, "")
      .toLowerCase();

    if (!domain) {
      throw "Invalid Domain Address.";
    }

    // RDAP Details
    const rdapDetails =
      await DomainInvestigationService.getRdapDetails(cleanDomain);
    const normalizedData =
      await DomainInvestigationService.normalize(rdapDetails);

    // IP Address
    const ipAddress = await DomainInvestigationService.ipAddress(cleanDomain);

    // HTTP Status
    const { status } = await fetch(normalizeUrl(cleanDomain));
    res.status(200).json(
      createResponse(
        200,
        {
          rdapDetails: normalizedData,
          ipv4Address: ipAddress[0].address,
          httpStatus: status,
        },
        "OK",
      ),
    );
  } catch (error) {
    res.status(500).json(createResponse(500, "", "Something Went Wrong!", ""));
    throw error;
  }
};

export const getQuoteOftheDay = async (req, res) => {
  try {
    const quoteData = await axios.get(
      "https://www.quoterism.com/api/quotes/quote-of-the-day",
      {
        headers: {
          "X-API-Key": process.env.QUOTERISM_KEY,
        },
      },
    );
    if (quoteData.status === 200) {
      res
        .status(200)
        .json(
          createResponse(
            quoteData.status,
            quoteData.data,
            quoteData.statusText,
          ),
        );
      return;
    }
  } catch (error) {
    res.status(500).json(createResponse(500, "", "Something Went Wrong!", ""));
    throw error;
  }
};
