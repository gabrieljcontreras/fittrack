import express from "express";
import {
  getWorkoutStats,
  getExerciseProgress
} from "../controllers/analyticsController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticateToken);

router.get("/stats", getWorkoutStats);
router.get("/exercise/:exerciseName", getExerciseProgress);

export default router;