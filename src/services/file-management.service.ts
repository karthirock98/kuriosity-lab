import apiAxios from "./api-axios";

const BASE_URL = "http://localhost:3333";

export const uploadImageApi = async (payload: FormData, mode: string) => {
  const res = await apiAxios.post(`${BASE_URL}/generic/upload-images?mode=${mode}`, payload);
  return res;
};
