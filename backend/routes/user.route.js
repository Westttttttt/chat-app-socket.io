import express from "express";
import { getUsersForSidebar } from "../controller/user.controller.js";

const router = express.Router();

router.get("/", getUsersForSidebar);

export default router;
