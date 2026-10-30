import { getBootstrapData } from "../services/iana-json.js";

export async function getRdapEndpoint(domain) {
  const bootstrap = await getBootstrapData();

  const tld = domain.split(".").pop().toLowerCase();

  const service = bootstrap.services.find(([tlds]) => tlds.includes(tld));

  if (!service) {
    throw new Error(`No RDAP server found for .${tld}`);
  }

  return service[1][0];
}

export function normalizeUrl(input) {
  const value = input.trim();

  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

export const fileSizeValidator = (file, type, reqSize) => {
  const fileSize = file.size / (1024 * 1024); // MB

  if (type === "min") {
    return fileSize >= reqSize;
  } else if (type === "max") {
    return fileSize <= reqSize;
  }

  return false;
};


export const intentionalSleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));