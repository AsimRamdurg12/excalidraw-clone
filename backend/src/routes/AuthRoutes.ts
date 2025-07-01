import express from "express";
import {
  forgotPassword,
  getProfile,
  resetPassword,
  signIn,
  signUp,
  verifyOTP,
} from "../controllers/AuthController";
import { authMiddleWare } from "../middlewares/AuthMiddleware";

const router = express.Router();

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.post("/send-email", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);
router.get("/get-user", authMiddleWare, getProfile);

export default router;
