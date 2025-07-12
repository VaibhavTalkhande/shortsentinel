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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRedirect = void 0;
const express_1 = __importDefault(require("express"));
const nanoid_1 = require("nanoid");
const geoIp_1 = require("../utils/geoIp"); // Assuming you have a utility function for geolocation lookup
const router = express_1.default.Router();
const url = {};
const clickLog = [];
router.post('/shorten', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { originalUrl } = req.body;
    if (!originalUrl || typeof originalUrl !== 'string') {
        return res.status(400).json({ error: 'Invalid URL' });
    }
    const shortId = (0, nanoid_1.nanoid)(6);
    url[shortId] = originalUrl;
    return res.status(201).json({ shortUrl: `${process.env.BASE_URL}/api/${shortId}` });
}));
const handleRedirect = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { shortId } = req.params;
    const originalUrl = url[shortId];
    if (!originalUrl) {
        return res.status(404).json({ error: 'URL not found' });
    }
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const ua = req.headers['user-agent'] || "";
    const geo = yield (0, geoIp_1.geoLookup)((ip === null || ip === void 0 ? void 0 : ip.toString()) || "0.0.0.0");
    clickLog.push({
        shortId,
        originalUrl,
        ip,
        ua,
        geo,
        timestamp: new Date().toISOString()
    });
    return res.redirect(originalUrl);
});
exports.handleRedirect = handleRedirect;
exports.default = router;
