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
const client_1 = require("@prisma/client");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
router.get("/", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const urls = yield prisma.url.findMany({
        where: { userId },
        include: { clicks: true },
    });
    const result = urls.map((url) => {
        const totalClicks = url.clicks.length;
        return {
            shortCode: url.shortCode,
            originalUrl: url.original,
            totalClicks,
            breakdown: {
                countries: groupBy(url.clicks, "country"),
                cities: groupBy(url.clicks, "city"),
                devices: groupBy(url.clicks, "userAgent"),
            },
            recentClicks: url.clicks
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 5),
        };
    });
    return res.json({ urls: result });
}));
router.get("/:shortCode", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { shortCode } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    // Get URL by shortCode and check ownership
    const url = yield prisma.url.findUnique({
        where: { shortCode },
        include: { clicks: true },
    });
    if (!url || url.userId !== userId) {
        return res.status(404).json({ message: "URL not found or unauthorized" });
    }
    const totalClicks = url.clicks.length;
    // Group by country/city/org/userAgent
    const countryStats = groupBy(url.clicks, "country");
    const cityStats = groupBy(url.clicks, "city");
    const ispStats = groupBy(url.clicks, "org");
    const deviceStats = groupBy(url.clicks, "userAgent");
    return res.json({
        shortCode,
        originalUrl: url.original,
        totalClicks,
        breakdown: {
            countries: countryStats,
            cities: cityStats,
            isps: ispStats,
            devices: deviceStats,
        },
        recentClicks: url.clicks
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 10),
    });
}));
// Utility function to group and count
function groupBy(array, key) {
    const map = {};
    for (const item of array) {
        const value = item[key] || "Unknown";
        map[value] = (map[value] || 0) + 1;
    }
    return map;
}
exports.default = router;
