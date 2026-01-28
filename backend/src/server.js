import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

//configuration
const port = process.env.PORT;

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

//routes
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

//server
server.listen(port, () => {
    console.log(`Server running on port : ${port}`);
    connectDB();
});
