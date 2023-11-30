import express from "express";
import protectRoute from "../middlewares/authMiddleware.js";

import {
  createPost,
  updatePost,
  deletePost,
  getPostsByUserId,
  getPostById,
  getAllPosts,
  addComment,
  deleteComment,
} from "../controllers/postController.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - postedBy
 *         - text
 *       properties:
 *         _id:
 *           type: string
 *           description: The post ID
 *         postedBy:
 *           type: string
 *           description: The user ID who posted the content
 *         text:
 *           type: string
 *           description: The text content of the post
 *         postImg:
 *           type: string
 *           description: The image associated with the post
 *         comments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Comment'
 *           description: Comments on the post
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the post was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the post was last updated
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - userId
 *         - text
 *       properties:
 *         userId:
 *           type: string
 *           description: The user ID who made the comment
 *         text:
 *           type: string
 *           description: The text content of the comment
 *         authorProfileImg:
 *           type: string
 *           description: The profile image of the comment author
 *         authorUsername:
 *           type: string
 *           description: The username of the comment author
 */
/**
  * @swagger
 * /api/posts/create:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *               postImg:
 *                 type: string
 *             required:
 *               - text
 *             example:
 *               text: "test post from swagger"
 *               postImg: "https://picsum.photos/"
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message indicating the success of the operation
 *                 newPost:
 *                   $ref: '#/components/schemas/Post'
 *       400:
 *         description: Text or image is required
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Some server error

 * @swagger
 * /api/posts/{postId}:
 *   delete:
 *     summary: Delete a post by post ID
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 *       500:
 *         description: Some server error

  * @swagger
 * /api/posts/user/{userId}:
 *   get:
 *     summary: Get posts by user ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User posts found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message indicating the success of the operation
 *                 userPosts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 *       404:
 *         description: User not found or no posts available
 *       500:
 *         description: Some server error

 * @swagger
 * /api/posts/{postId}:
 *   get:
 *     summary: Get a post by post ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message indicating the success of the operation
 *                 post:
 *                   $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 *       500:
 *         description: Some server error
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: All posts found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message indicating the success of the operation
 *                 posts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 *       404:
 *         description: No posts available
 *       500:
 *         description: Some server error
 * @swagger
 * /api/posts/update/{postId}:
 *   patch:
 *     summary: Update a post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: ID of the post to update
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Updated post information
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: The updated text of the post
 *               postImg:
 *                 type: string
 *                 description: The updated image URL of the post
 *     responses:
 *       200:
 *         description: Post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdatedPost'
 *       400:
 *         description: Invalid request body or parameters
 *       404:
 *         description: Post not found
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdatedPost:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: A message indicating the success of the update
 *         updatedPost:
 *           $ref: '#/components/schemas/Post'
 * @swagger
 * /api/posts/comment/{postId}:
 *   post:
 *     summary: Add a comment to a post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: ID of the post to add a comment to
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Comment information
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: The text of the comment
 *     responses:
 *       201:
 *         description: Comment added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Invalid request body or parameters
 *       404:
 *         description: Post not found
 *       500:
 *         description: Some server error
 *
 * @swagger
 * /api/posts/{postId}/comment/{commentId}:
 *   delete:
 *     summary: Delete a comment from a post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: ID of the post containing the comment
 *         schema:
 *           type: string
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: ID of the comment to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       400:
 *         description: Invalid parameters
 *       404:
 *         description: Post or comment not found
 *       500:
 *         description: Some server error
 */

router.get("/user/:userId", protectRoute, getPostsByUserId);
router.get("/:postId", getPostById);
router.get("/", getAllPosts);
router.post("/create", protectRoute, createPost);
router.post("/comment/:postId", protectRoute, addComment);
router.patch("/update/:postId", protectRoute, updatePost);
router.delete("/:postId", protectRoute, deletePost);
router.delete("/:postId/comment/:commentId", protectRoute, deleteComment);

export default router;
