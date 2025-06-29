import express from "express";
import {
  createRoom,
  deleteRoom,
  getRoomBySlug,
  getRooms,
} from "../controllers/RoomController";
import { authMiddleWare } from "../middlewares/AuthMiddleware";

const router = express.Router();

router.post("/create-room", authMiddleWare, createRoom);
router.get("/get-rooms", authMiddleWare, getRooms);
router.get("/join-room/:slug", authMiddleWare, getRoomBySlug);
router.delete("/delete-room/:slug", authMiddleWare, deleteRoom);

export default router;
