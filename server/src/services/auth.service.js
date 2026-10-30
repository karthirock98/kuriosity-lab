import { decrypt } from "../helpers/decrypt.js";

export const validateAuthCookie = async (authCookie) => {
  if (process.env.MODE === "DEV") {
    return await decrypt(authCookie);
  }

  if (!authCookie) {
    throw new Error("Unauthorized");
  }

  const decryptedCookie = await decrypt(authCookie);

  if (
    !decryptedCookie?.expiresAt ||
    Date.now() > decryptedCookie.expiresAt
  ) {
    throw new Error("Unauthorized");
  }

  return decryptedCookie;
};