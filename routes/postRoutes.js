import express from "express";
import protectRoute from "../middlewares/authMiddleware.js";

import { createPost, deletePost } from "../controllers/postController.js";

const router = express.Router();

router.post("/create", protectRoute, createPost);
router.delete("/:postId", protectRoute, deletePost);

export default router;
