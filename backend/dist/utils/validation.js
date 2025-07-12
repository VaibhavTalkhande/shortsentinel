"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = exports.urlSchema = void 0;
const zod_1 = require("zod");
exports.urlSchema = zod_1.z.object({
    longUrl: zod_1.z.string().url(),
    customCode: zod_1.z.string().min(3).optional()
});
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6)
});
exports.loginSchema = exports.registerSchema;
