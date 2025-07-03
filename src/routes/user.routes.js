import express from "express";
import { handleCreateUser, handleGetUser, handleLoginUser, handleUpdateUser, handleLogoutUser } from "../controller/user.controller.js";
import authenticateToken from "../middleware/userAuthentication.js";

const router = express.Router();

router.post("/createUser", handleCreateUser);
router.get("/user", authenticateToken, handleGetUser);
router.post("/updateUser", authenticateToken, handleUpdateUser);
router.get("/logout", authenticateToken, handleLogoutUser)
router.post("/login", handleLoginUser);

export default router;