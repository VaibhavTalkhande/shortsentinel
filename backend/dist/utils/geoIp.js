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
const geoLookup = (ip) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield fetch(`https://ipapi.co/${ip}/json/`);
        if (!res.ok) {
            throw new Error(`Error fetching geo data: ${res.statusText}`);
        }
        const data = yield res.json();
        return data;
    }
    catch (error) {
        console.error(`Geo lookup failed for IP ${ip}:`, error);
        return null; // Return null or a default value if the lookup fails
    }
});
exports.geoLookup = geoLookup;
