import express from "express";
import { analyzeWorkouts } from "../controllers/aiCoachController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Protect all AI coach routes with authentication
router.use(authenticateToken);

// POST /api/ai-coach/analyze - Analyze workouts and provide AI-powered recommendations
router.post("/analyze", analyzeWorkouts);

export default router;
