import express from "express";
import passport from "../config/passportConfig.js";
import { register,login, logout, getAdmin } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/admin", passport.authenticate("jwt", { session: false }), getAdmin);
router.post("/register", register);
export default router;
