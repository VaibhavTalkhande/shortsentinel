"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const auth_1 = require("../utils/auth");
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(401).send("Unauthorized");
    const token = authHeader.split(" ")[1];
    try {
        const payload = (0, auth_1.verifyToken)(token);
        req.user = { userId: payload.userId };
        next();
    }
    catch (e) {
        return res.status(403).send("Invalid token");
    }
};
exports.authMiddleware = authMiddleware;
