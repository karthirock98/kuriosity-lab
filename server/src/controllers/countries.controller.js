import { getCountriesByCountryCode } from "../services/rest-countries.service.js";
import { createResponse } from "../utils/common-utils.js";

export const getDataByCountryName = async (req, res) => {
  try {
    const response = await getCountriesByCountryCode(req?.query?.code);
    res
      .status(200)
      .json(createResponse(200, response, "Success!"));
  } catch (error) {
    res
      .status(500)
      .json(createResponse(500, error, "SOmething went wrong!"));
  }
};
