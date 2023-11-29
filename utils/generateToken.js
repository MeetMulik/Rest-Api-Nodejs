import jwt from "jsonwebtoken";

/**
 * Generates a JSON Web Token (JWT) for a given user ID and sets it as a cookie in the response.
 *
 * @param {string} userId - The user ID for whom the token is generated.
 * @param {Object} res - The Express response object.
 * @returns {string} The generated JWT.
 */
const generateTokenAndSetCookie = (userId, res) => {
  // Generate a JWT with the user ID, using the secret and setting an expiration of 15 days.
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  // Set the JWT as an HTTP-only cookie in the response.
  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 15,
    sameSite: "strict",
  });

  // Return the generated JWT.
  return token;
};

export default generateTokenAndSetCookie;
