import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js"
import { connectDB } from "./db/connect.js";

dotenv.config();


const app = express();
app.use(express.json());

const PORT = process.env.PORT;


app.use("/api/auth", authRoutes);


app.listen(PORT, () => {
  connectDB();
  console.log("App is listening on port", PORT);
});

