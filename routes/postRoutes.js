import express from "express";
import protectRoute from "../middlewares/authMiddleware.js";

import {
  createPost,
  deletePost,
  getPostsByUserId,
  getPostById,
} from "../controllers/postController.js";

const router = express.Router();

router.get("/user/:userId", protectRoute, getPostsByUserId);
router.post("/create", protectRoute, createPost);
router.delete("/:postId", protectRoute, deletePost);
router.get("/:postId", getPostById);

export default router;
