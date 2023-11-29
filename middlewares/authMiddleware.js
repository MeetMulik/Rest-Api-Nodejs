import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

/**
 * @desc Middleware to protect routes by verifying the authenticity of the provided JWT.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {function} next - Express next middleware function.
 * @returns {void}
 */
const protectRoute = async (req, res, next) => {
  try {
    // Extract the JWT token from the request cookies.
    const token = req.cookies.jwt;

    // Check if a token is present in the request.
    if (!token) {
      return res.status(400).json({ message: "Unauthorized" });
    }

    // Verify the token using the JWT_SECRET and obtain the decoded payload.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user associated with the decoded user ID and exclude the password.
    const user = await User.findById(decoded.userId).select("-password");

    // Attach the user object to the request for use in subsequent middleware or routes.
    req.user = user;

    // Call the next middleware in the stack.
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in protected route: ", err.message);
  }
};

export default protectRoute;
