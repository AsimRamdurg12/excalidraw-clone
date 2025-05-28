import express from "express";
import {
  createRoom,
  deleteRoom,
  joinRoom,
} from "../controllers/RoomController";
import { authMiddleWare } from "../middlewares/AuthMiddleware";

const router = express.Router();

router.post("/create-room", authMiddleWare, createRoom);
router.post("/join-room", authMiddleWare, joinRoom);
router.post("/delete-room", authMiddleWare, deleteRoom);

export default router;
