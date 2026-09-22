import { APP_CONSTANTS } from "@/lib/app.constants";
import axios from "axios"
const BASE_URL = "http://localhost:3333"

export const loginUser = async (payload: any) => {
    try {
        const res = await axios.post(
            `${BASE_URL}/auth/login`,
            payload
        );

        return res;
    } catch (error) {
        throw error;
    }
};

export const authService = {
    isAuthenticated() {
         const token = sessionStorage.getItem(APP_CONSTANTS.TOKEN);
         if(token){
            return true;
         }else{
            return false;
         }
    }
}

export const setSession = (value: string) => {
    sessionStorage.setItem(APP_CONSTANTS.TOKEN, value)
}

export const getToken = () => {
    return sessionStorage.getItem(APP_CONSTANTS.TOKEN)
}

export const LogOut = () => {
    sessionStorage.clear()
}