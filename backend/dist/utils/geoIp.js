"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.geoLookup = void 0;
const IPINFO_TOKEN = process.env.IPINFO_TOKEN || "";
const cache = new Map();
const geoLookup = (ip) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (cache.has(ip))
            return cache.get(ip);
        if (ip === "::1" || ip === "127.0.0.1") {
            return {
                city: "Localhost",
                region: "Development",
                country: "Local",
                org: "Dev ISP",
                loc: "0,0"
            };
        }
        const res = yield fetch(`https://ipinfo.io/${ip}?token=${IPINFO_TOKEN}`);
        if (!res.ok)
            throw new Error("Geo API failed");
        const data = yield res.json();
        cache.set(ip, data);
        return {
            ip: data.ip,
            city: data.city,
            region: data.region,
            country: data.country,
            org: data.org,
            loc: data.loc
        };
    }
    catch (err) {
        console.error(`Geo lookup failed for IP ${ip}:`, err.message);
        return null;
    }
});
exports.geoLookup = geoLookup;
