import express from "express";
import {
  signupUser,
  loginUser,
  logoutUser,
  forgetPassword,
  resetPassword,
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";
import protectRoute from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/forget-password", forgetPassword);
router.post("/reset-password", resetPassword);
router.get("/profile/:username", getUserProfile);
router.patch("/profile/:id", protectRoute, updateUserProfile);

export default router;
