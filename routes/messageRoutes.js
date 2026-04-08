import express from "express";
import {
  getAllUsers,
  getMessages,
  markMessageSeen,
  sendMessage,
} from "../controllers/messageController.js";
import { protectRoute } from "../middleware/auth.js";

const messageRouter = express.Router();

messageRouter.get("/users", protectRoute, getAllUsers);
messageRouter.get("/:id", protectRoute, getMessages);
messageRouter.post("/send/:id", protectRoute, sendMessage);
messageRouter.put("/mark/:id", protectRoute, markMessageSeen);
// messageRouter.get("/last/:id", protectRoute, getLastMessage);

export default messageRouter;
