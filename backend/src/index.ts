import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import shortenRoutes, { handleRedirect } from "./routes/shorten";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:"*",
    }
})

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use("/api", shortenRoutes); 
app.use("/:shortId",handleRedirect);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });

    // Example of handling a custom event
    socket.on("message", (data) => {
        console.log("Message received:", data);
        io.emit("message", data); // Broadcast the message to all connected clients
    });
}
);

