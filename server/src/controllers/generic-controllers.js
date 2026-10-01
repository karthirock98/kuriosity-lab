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
