import express from "express";
import {
  forgotPassword,
  getProfile,
  logout,
  resetPassword,
  signIn,
  signUp,
  verifyOTP,
} from "../controllers/AuthController";
import { authMiddleWare } from "../middlewares/AuthMiddleware";

const router = express.Router();

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.put("/send-email", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.patch("/reset-password", resetPassword);
router.get("/get-user", authMiddleWare, getProfile);
router.post("/logout", logout);

export default router;
