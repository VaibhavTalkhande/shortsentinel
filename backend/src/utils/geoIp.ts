const IPINFO_TOKEN = process.env.IPINFO_TOKEN || "";
const cache = new Map<string, any>();

// Normalize IP address
const normalizeIp = (rawIp: string | undefined): string => {
  if (!rawIp) return "127.0.0.1";
  if (rawIp.includes(",")) return rawIp.split(",")[0].trim(); // Handle multi IPs from proxies
  return rawIp;
};

export const geoLookup = async (rawIp: string) => {
  try {
    const ip = normalizeIp(rawIp);

    // Skip GeoIP lookup for local dev
    if (ip === "::1" || ip === "127.0.0.1") {
      return {
        ip,
        city: "Localhost",
        region: "Development",
        country: "Local",
        org: "Dev ISP",
        loc: "0,0"
      };
    }

    if (cache.has(ip)) return cache.get(ip);

    const res = await fetch(`https://ipinfo.io/${ip}?token=${IPINFO_TOKEN}`);
    if (!res.ok) throw new Error("Geo API failed");

    const data = await res.json();
    const result = {
      ip: data.ip,
      city: data.city,
      region: data.region,
      country: data.country,
      org: data.org,
      loc: data.loc
    };

    cache.set(ip, result);
    return result;

  } catch (err) {
    console.error(`Geo lookup failed for IP ${rawIp}:`, (err as any).message);
    return {
      ip: rawIp,
      city: "Unknown",
      region: "Unknown",
      country: "Unknown",
      org: "Unknown",
      loc: "0,0"
    };
  }
};
