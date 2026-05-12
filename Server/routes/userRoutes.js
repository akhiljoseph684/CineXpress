import express from "express";
import { blockUser, deleteUser, getAllUsers, getUserById, updateUser } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const router = express.Router();

router.get("/", authMiddleware, verifyAdmin, getAllUsers);
router.get("/:id", authMiddleware, getUserById);
router.delete("/:id",authMiddleware, verifyAdmin, deleteUser);
router.patch("/:id", authMiddleware, verifyAdmin, blockUser);
router.put("/", authMiddleware, updateUser);

export default router;