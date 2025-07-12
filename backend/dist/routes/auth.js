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
const validation_1 = require("../utils/validation");
const auth_1 = require("../utils/auth");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = validation_1.registerSchema.safeParse(req.body);
    if (!result.success)
        return res.status(400).json(result.error.format());
    const { email, password } = result.data;
    const existingUser = yield prisma.user.findUnique({ where: { email } });
    if (existingUser)
        return res.status(409).json({ message: "User already exists" });
    const hashed = yield (0, auth_1.hashPassword)(password);
    const user = yield prisma.user.create({
        data: {
            email,
            password: hashed
        }
    });
    const token = (0, auth_1.generateToken)(user.id);
    return res.status(201).json({ token });
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = validation_1.loginSchema.safeParse(req.body);
    if (!result.success)
        return res.status(400).json(result.error.format());
    const { email, password } = result.data;
    const user = yield prisma.user.findUnique({ where: { email } });
    if (!user)
        return res.status(401).json({ message: "Invalid credentials" });
    const isValid = yield (0, auth_1.comparePassword)(password, user.password);
    if (!isValid)
        return res.status(401).json({ message: "Invalid credentials" });
    const token = (0, auth_1.generateToken)(user.id);
    return res.status(200).json({ token });
}));
exports.default = router;
