import express from "express";

import { createLanguage, deleteLanguage, getLanguages } from "../controllers/languageController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const router = express.Router();

router.get("/", authMiddleware, getLanguages);
router.post("/", authMiddleware, verifyAdmin, createLanguage);
router.delete("/:id", authMiddleware, verifyAdmin, deleteLanguage);

export default router;