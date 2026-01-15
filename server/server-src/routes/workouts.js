import express from "express";
import {
  createWorkout,
  getWorkouts,
  getLastWorkout,
  updateWorkout,
  deleteWorkout
} from "../controllers/workoutController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

router.post("/", createWorkout);
router.get("/", getWorkouts);
router.get("/last/:exerciseName", getLastWorkout);
router.put("/:workoutId", updateWorkout);
router.delete("/:workoutId", deleteWorkout);

export default router;