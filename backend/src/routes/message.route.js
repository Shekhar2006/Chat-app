import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUsers, sendMessages } from "../controllers/message.controller.js";
const messageRoutes = express.Router();

messageRoutes.get("/users", protectRoute, getUsers);
messageRoutes.get("/:id", protectRoute, getMessages);
messageRoutes.post("/send/:id", protectRoute, sendMessages);

export default messageRoutes;
