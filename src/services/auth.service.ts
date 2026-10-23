
import { APP_CONSTANTS } from "@/lib/app.constants";
import apiAxios from "./api-axios";

const BASE_URL = "http://localhost:3333";

export const loginUser = async (payload: any) => {
  const res = await apiAxios.post(
    `${BASE_URL}/auth/login`,
    payload,
  );

  return res;
};

export const authService = {
  isAuthenticated() {
    return !!sessionStorage.getItem(APP_CONSTANTS.TOKEN);
  },
};

export const setSession = (value: string) => {
  sessionStorage.setItem(APP_CONSTANTS.TOKEN, value);
};

export const getToken = () => {
  return sessionStorage.getItem(APP_CONSTANTS.TOKEN);
};

export const LogOut = async () => {
  try {
    await apiAxios.get(`${BASE_URL}/auth/logout`);
  } finally {
    sessionStorage.clear();
    window.location.href = "/login";
  }
};
