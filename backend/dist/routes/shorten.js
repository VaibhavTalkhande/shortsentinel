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
const express_1 = __importDefault(require("express"));
const nanoid_1 = require("nanoid");
const geoIp_1 = require("../utils/geoIp");
const client_1 = require("@prisma/client");
const authMiddleware_1 = require("../middleware/authMiddleware");
const validation_1 = require("../utils/validation");
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
router.post("/shorten", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = validation_1.urlSchema.safeParse(req.body);
    if (!result.success)
        return res.status(400).json(result.error.format());
    const { longUrl, customCode } = result.data;
    const shortCode = customCode || (0, nanoid_1.nanoid)(6);
    const exists = yield prisma.url.findUnique({ where: { shortCode } });
    if (exists)
        return res.status(409).json({ message: "Short code already taken" });
    const url = yield prisma.url.create({
        data: {
            shortCode,
            original: longUrl,
            custom: !!customCode,
            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId
        }
    });
    return res.json({ shortUrl: `${process.env.BASE_URL}/${shortCode}` });
}));
router.get("/:code", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code } = req.params;
    const url = yield prisma.url.findUnique({ where: { shortCode: code } });
    if (!url)
        return res.status(404).send("Not found");
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const ua = req.headers["user-agent"] || "";
    const geo = yield (0, geoIp_1.geoLookup)((ip === null || ip === void 0 ? void 0 : ip.toString()) || "0.0.0.0");
    yield prisma.click.create({
        data: {
            urlId: url.id,
            ip: (ip === null || ip === void 0 ? void 0 : ip.toString()) || "unknown",
            userAgent: ua,
            location: (geo === null || geo === void 0 ? void 0 : geo.city) || "unknown"
        }
    });
    res.redirect(url.original);
}));
exports.default = router;
