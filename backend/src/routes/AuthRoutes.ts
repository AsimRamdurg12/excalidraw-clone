import express from "express";
import { getProfile, signIn, signUp } from "../controllers/AuthController";
import { authMiddleWare } from "../middlewares/AuthMiddleware";

const router = express.Router();

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.get("/get-user", authMiddleWare, getProfile);

export default router;
