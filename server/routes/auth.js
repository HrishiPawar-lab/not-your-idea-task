// src/routes/auth.js
import { Router } from "express";
import { loginUser, registerUser } from "../controllers/auth.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);


export default router;
