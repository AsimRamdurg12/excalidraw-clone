import express from "express";
import { authMiddleWare } from "../middlewares/AuthMiddleware";
import { getChats } from "../controllers/ChatController";

const router = express.Router();

router.get("/:roomId", authMiddleWare, getChats);

export default router;
