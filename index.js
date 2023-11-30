import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerui from "swagger-ui-express";

import connectDB from "./db/connectDB.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";

import { options } from "./utils/swaggerOptions.js";

dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();

// Connect to DB
connectDB();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

// Swagger
const swgs = swaggerJsDoc(options);
app.use("/api-docs", swaggerui.serve, swaggerui.setup(swgs));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
