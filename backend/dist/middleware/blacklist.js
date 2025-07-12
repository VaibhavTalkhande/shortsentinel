"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addToBlackList = void 0;
const blackListIPs = new Set();
const addToBlackList = (req, res, next) => {
    const ip = req.headers["x-forwared-for"] || req.socket.remoteAddress;
    if (ip && blackListIPs.has(ip.toString())) {
        return res.status(403).json({
            status: 403,
            error: "Forbidden: Your IP is blacklisted."
        });
    }
    next();
};
exports.addToBlackList = addToBlackList;
