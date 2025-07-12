import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import shortenRoutes from "./routes/shorten";
import authRoutes from "./routes/auth";
import { PrismaClient } from "@prisma/client";
import analyticsRoutes from "./routes/analytics";
const prisma = new PrismaClient()


dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:"*",
    }
})

app.set("io", io);
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use("/", shortenRoutes); 
app.use("/api", authRoutes);
app.use("/api/analytics",analyticsRoutes);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

