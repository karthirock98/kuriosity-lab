import crypto from 'crypto';

const KEY = Buffer.from(process.env.COOKIE_SECRET, "hex");
export const decrypt = async (token) => {
    const [ivHex, tagHex, encryptedHex] = token.split(".");

    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(tagHex, "hex");
    const encrypted = Buffer.from(encryptedHex, "hex");

    const decipher = crypto.createDecipheriv(
        "aes-256-gcm",
        KEY,
        iv
    );

    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
        decipher.update(encrypted),
        decipher.final()
    ]);

    return JSON.parse(decrypted.toString("utf8"));
}
