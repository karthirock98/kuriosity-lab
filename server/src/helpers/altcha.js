import {
  CappedMap,
  create,
  deriveHmacKeySecret,
} from "altcha-lib/frameworks/express";
import { deriveKey } from "altcha-lib/algorithms/pbkdf2";
import { randomInt } from "node:crypto";

export const altcha = create({
  hmacSignatureSecret: process.env.HMAC_SECRET,
  hmacKeySignatureSecret: process.env.HMAC_KEY_SECRET,
  createChallengeParameters: () => {
    return {
      algorithm: "PBKDF2/SHA-256",
      cost: 5_000,
      counter: randomInt(5_000, 10_000),
      expiresAt: new Date(Date.now() + 600_000),
    };
  },

  deriveKey,
  store: new CappedMap({
    maxSize: 1_000,
  }),
});
