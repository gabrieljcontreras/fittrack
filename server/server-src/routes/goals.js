import express from "express";
import {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal
} from "../controllers/goalController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticateToken);

router.post("/", createGoal);
router.get("/", getGoals);
router.put("/:goalId", updateGoal);
router.delete("/:goalId", deleteGoal);

export default router;