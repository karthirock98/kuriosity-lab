import crypto from 'crypto';
import { data } from 'react-router-dom';

const KEY = Buffer.from(process.env.COOKIE_SECRET, "hex");

export const encrypt = async (data) => {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv("aes-256-gcm", KEY, iv);

    const encrypted = Buffer.concat([
        cipher.update(JSON.stringify(data), "utf8"),
        cipher.final()
    ])

    const tag = cipher.getAuthTag();

    return [
        iv.toString("hex"),
        tag.toString("hex"),
        encrypted.toString("hex")
    ].join(".");
}