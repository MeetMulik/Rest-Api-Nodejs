import express from "express";
import protectRoute from "../middlewares/authMiddleware.js";

import {
  createPost,
  deletePost,
  getPostsByUserId,
  getPostById,
  getAllPosts,
  addComment,
} from "../controllers/postController.js";

const router = express.Router();

router.get("/user/:userId", protectRoute, getPostsByUserId);
router.get("/:postId", getPostById);
router.get("/", getAllPosts);
router.post("/create", protectRoute, createPost);
router.post("/comment/:postId", protectRoute, addComment);
router.delete("/:postId", protectRoute, deletePost);

export default router;
