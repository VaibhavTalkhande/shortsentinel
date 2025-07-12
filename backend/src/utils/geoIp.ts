const IPINFO_TOKEN = process.env.IPINFO_TOKEN || "";
const cache = new Map<string, any>();

export const geoLookup = async (ip: string) => {
  try {
    if (cache.has(ip)) return cache.get(ip);
    if (ip === "::1" || ip === "127.0.0.1") {
      return {
        city: "Localhost",
        region: "Development",
        country: "Local",
        org: "Dev ISP",
        loc: "0,0"
      };
    }

    const res = await fetch(`https://ipinfo.io/${ip}?token=${IPINFO_TOKEN}`);
    if (!res.ok) throw new Error("Geo API failed");
    
    const data = await res.json();
    cache.set(ip, data);
    return {
      ip: data.ip,
      city: data.city,
      region: data.region,
      country: data.country,
      org: data.org,
      loc: data.loc
    };
  } catch (err ) {
    console.error(`Geo lookup failed for IP ${ip}:`, (err as any).message);
    return null;
  }
};