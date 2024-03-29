import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import randomstring from "randomstring";
import User from "../models/userModel.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

const sendResetPasswordEmail = async (name, email, resetToken) => {
  const emailTemplate = `
    <p style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: 'Arial', sans-serif;">
        <strong>Password Reset</strong><br>
        Hello,${name}<br>
        We received a request to reset the password for your account. If you did not make this request, please ignore this email.<br>
        To reset your password, click the link below:<br>
        <a href="http://localhost:5000/api/users/reset-password?resetToken=${resetToken}" target="_blank">Reset Password</a><br>
        If the above link does not work, copy and paste the following URL into your browser:<br>
        http://localhost:5000/api/users/reset-password?resetToken=${resetToken}<br>
        Thank you,<br>
        Auth Team
    </p>
`;

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: email,
      subject: "Reset your password",
      html: emailTemplate,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("[SEND RESET PASSWORD EMAIL ERROR]", error.message);
      } else {
        console.log("[MAIL SENT:]", info.response);
      }
    });
  } catch (error) {
    console.log("[SEND RESET PASSWORD EMAIL ERROR]", error.message);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc   Register a new user
 * @route  POST /api/users/signup
 * @access Public
 */
const signupUser = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    const user = await User.findOne({ $or: [{ email }, { username }] });

    if (user) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      username,
      password: hashedPassword,
    });

    await newUser.save();

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      return res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("[SIGNUP USER ERROR]", error.message);
  }
};

/**
 * @desc   Log in an existing user
 * @route  POST /api/users/login
 * @access Public
 */
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    const checkPassword = await bcrypt.compare(password, user?.password);

    if (!checkPassword) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("[LOGIN USER ERROR]", error.message);
  }
};

/**
 * @desc   Log out the currently authenticated user
 * @route  POST /api/users/logout
 * @access Public
 */
const logoutUser = async (req, res) => {
  try {
    res.clearCookie("jwt", "", { maxAge: 1 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("[LOGOUT USER ERROR]", error.message);
  }
};

/**
 * @desc   Request a password reset for a user
 * @route  POST /api/users/forget-password
 * @access Public
 */
const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    const randomString = randomstring.generate();
    await User.updateOne(
      { email: email },
      { $set: { resetToken: randomString } }
    );
    sendResetPasswordEmail(user.name, user.email, randomString);
    res.status(200).json({ message: "Reset password email sent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("[FORGET PASSWORD ERROR]", error.message);
  }
};

/**
 * @desc   Reset the password for a user
 * @route  POST /api/users/reset-password
 * @access Public
 */
const resetPassword = async (req, res) => {
  try {
    const resetToken = req.query.resetToken;
    const { password } = req.body;
    const data = await User.findOne({ resetToken });
    if (data) {
      const newPassword = password;
      const salt = await bcrypt.genSalt(10);
      const newHashedPassword = await bcrypt.hash(newPassword, salt);
      const updatedUser = await User.findByIdAndUpdate(
        { _id: data._id },
        {
          $set: {
            password: newHashedPassword,
            resetToken: "",
          },
        },
        { new: true }
      );
      res.status(200).json({ message: "Password updated successfully" });
    } else {
      res.status(200).json({ message: "Token invalid" });
    }
  } catch (error) {}
};

/**
 * @desc   Get the profile of a user by username
 * @route  GET /api/users/profile/:username
 * @access Public
 */
const getUserProfile = async (req, res) => {
  const username = req.params.username;
  try {
    let user = await User.findOne({ username })
      .select("-password")
      .select("-resetToken")
      .select("-updatedAt");

    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    console.log("[GET USER PROFILE ERROR]", error.message);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc   Update the profile of the currently authenticated user
 * @route  PATCH /api/users/profile/:id
 * @access Private
 */
const updateUserProfile = async (req, res) => {
  try {
    const values = req.body;
    const currentUserId = req.user._id;

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (req.params.id != currentUserId.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot update other user's profile" });
    }

    if (values.password) {
      const { password } = values;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const updatedUser = await User.findByIdAndUpdate(
        { _id: req.params.id },
        { $set: { password: hashedPassword } },
        { new: true }
      );
      return res.status(200).json(updatedUser);
    }

    const updatedUser = await User.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: values },
      { new: true }
    );

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.log("[UPDATE USER PROFILE ERROR]", error.message);
    res.status(500).json({ message: error.message });
  }
};

export {
  signupUser,
  loginUser,
  logoutUser,
  forgetPassword,
  resetPassword,
  getUserProfile,
  updateUserProfile,
};
