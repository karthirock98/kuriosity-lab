import axios from "axios";
import { getRdapEndpoint } from "../helpers/generic-helper.js";
import dns from "node:dns/promises";

// THis class based service can be used to get all domain relates information
class DomainInvestigationService {
  async getRdapDetails(domain) {
    try {
      const cleanDomain = domain
        .trim()
        .replace(/^https?:\/\//i, "")
        .split(/[/?#]/)[0]
        .replace(/:\d+$/, "")
        .toLowerCase();

      const rdapEndpoint = await getRdapEndpoint(cleanDomain);

      if (!rdapEndpoint) {
        return { msg: "Unknown Domain Endpoint" };
      }

      const rdapResult = await axios.get(
        `${rdapEndpoint.replace(/\/+$/, "")}/domain/${cleanDomain}`,
      );

      return rdapResult.data;
    } catch (err) {
      return err.message;
    }
  }
  async normalize(data) {
    const registrar = data.entities?.find((entity) =>
      entity.roles?.includes("registrar"),
    );

    const vcard = registrar?.vcardArray?.[1];

    const registrarName = vcard?.find((item) => item[0] === "fn")?.[3] ?? null;

    const getDate = (...actions) => {
      const event = data.events?.find((item) =>
        actions.includes(item.eventAction),
      );

      return event?.eventDate ?? null;
    };

    return {
      domain: data.ldhName ?? data.unicodeName ?? null,

      status: data.status ?? [],

      registrar: {
        name: registrarName,
        id: registrar?.handle ?? null,
      },

      dates: {
        registered: getDate("registration"),
        expires: getDate("expiration"),
        lastUpdated: getDate("last changed"),
      },

      nameservers: (data.nameservers ?? [])
        .map((server) => server.ldhName)
        .filter(Boolean),

      dnssec: {
        enabled: data.secureDNS?.delegationSigned ?? null,
      },

      //   full data if needed
      //   entities: data.entities ?? [],
    };
  }
  async ipAddress(domain) {
    const result = await dns.lookup(domain, { all: true });
    return result;
  }
}
export default new DomainInvestigationService();
