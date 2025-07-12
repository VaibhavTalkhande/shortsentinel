"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const auth_1 = require("../utils/auth");
const authMiddleware = (req, // keep this generic for compatibility
res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const payload = (0, auth_1.verifyToken)(token); // returns { userId: string }
        // Cast req to AuthRequest and attach user
        req.user = { userId: payload.userId };
        next();
    }
    catch (err) {
        return res.status(403).json({ message: "Invalid token" });
    }
};
exports.authMiddleware = authMiddleware;
