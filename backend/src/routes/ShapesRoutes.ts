import express from "express";
import { authMiddleWare } from "../middlewares/AuthMiddleware";
import { getShapes } from "../controllers/ShapesController";

const router = express.Router();

router.get("/room/:roomId", getShapes);

export default router;
