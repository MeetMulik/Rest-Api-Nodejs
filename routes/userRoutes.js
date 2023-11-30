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

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - username
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: The user ID
 *         name:
 *           type: string
 *           description: The user's name
 *         username:
 *           type: string
 *           description: The user's username
 *         email:
 *           type: string
 *           description: The user's email
 *         password:
 *           type: string
 *           description: The user's password
 *         resetToken:
 *           type: string
 *           description: Token for password reset
 *         profilePic:
 *           type: string
 *           description: URL of the user's profile picture
 *         bio:
 *           type: string
 *           description: The user's biography
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp of when the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp of when the user was last updated
 *
 * /api/users/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - name
 *               - username
 *               - email
 *               - password
 *             example:
 *               name: "John Doe"
 *               username: "john_doe"
 *               email: "john@example.com"
 *               password: "password123"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request, user already exists or invalid data
 *       500:
 *         description: Some server error
 *
 * /api/users/login:
 *   post:
 *     summary: Log in an existing user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *             example:
 *               username: "jahn_doe"
 *               password: "password123"
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request, user not found or invalid credentials
 *       500:
 *         description: Some server error
 *
 * /api/users/logout:
 *   post:
 *     summary: Log out the currently authenticated user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       500:
 *         description: Some server error
 *
 * /api/users/forget-password:
 *   post:
 *     summary: Request a password reset for a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *             required:
 *               - email
 *             example:
 *               email: "john@example.com"
 *     responses:
 *       200:
 *         description: Reset password email sent
 *       400:
 *         description: Bad request, user not found
 *       500:
 *         description: Some server error
 *
 *
 *
 *  @swagger
 * paths:
 *   /api/users/reset-password:
 *     post:
 *       summary: Reset the password for a user
 *       tags:
 *         - Users
 *       parameters:
 *         - in: query
 *           name: resetToken
 *           required: true
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 password:
 *                   type: string
 *               required:
 *                 - password
 *             example:
 *               password: "newpassword123"
 *       responses:
 *         200:
 *           description: Password updated successfully
 *         400:
 *           description: Token invalid or bad request, password is required
 *         500:
 *           description: Some server error
 *
 *  @swagger
 * paths:
 *   /api/users/profile/{username}:
 *     get:
 *       summary: Get the profile of a user by username
 *       tags:
 *         - Users
 *       parameters:
 *         - in: path
 *           name: username
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: User profile retrieved successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 *         404:
 *           description: User not found
 *         500:
 *           description: Some server error
 *
 *
 *
 *
 */
/**
 * @swagger
 * /api/users/profile/{userId}:
 *   patch:
 *     summary: Update user profile
 *     description: Update the user profile information.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user profile to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bio:
 *                 type: string
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             example:
 *               _id: string
 *               name: string
 *               username: string
 *               email: string
 *               password: string
 *               resetToken: string
 *               createdAt: string (date-time)
 *               updatedAt: string (date-time)
 *               __v: integer
 *               bio: string
 *               profilePic: string (URL)
 *       400:
 *         description: Invalid parameters
 *       404:
 *         description: User not found
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The user managing API
 */

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/forget-password", forgetPassword);
router.post("/reset-password", resetPassword);
router.get("/profile/:username", getUserProfile);
router.patch("/profile/:id", protectRoute, updateUserProfile);

export default router;
