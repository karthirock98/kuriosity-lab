import { getBootstrapData } from "../services/iana-json.js";

export async function getRdapEndpoint(domain) {
  const bootstrap = await getBootstrapData();

  const tld = domain.split(".").pop().toLowerCase();

  const service = bootstrap.services.find(([tlds]) =>
    tlds.includes(tld)
  );

  if (!service) {
    throw new Error(`No RDAP server found for .${tld}`);
  }

  return service[1][0];
}

export function normalizeUrl(input) {
    const value = input.trim();

    return /^https?:\/\//i.test(value)
        ? value
        : `https://${value}`;
}