import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import userRoutes from "./routes/user.route.js";

import { connectDB } from "./db/connect.js";
import cookieParser from "cookie-parser";
import protectRoute from "./middleware/protectRoute.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT;

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", protectRoute, userRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log("App is listening on port", PORT);
});
