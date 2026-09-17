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
        return true;
    }

    
}