import Goal from "../models/Goal.js";

// Create a goal
export const createGoal = async (req, res) => {
  try {
    const { title, type, target, unit, exerciseName, deadline } = req.body;
    
    const goal = await Goal.create({
      userId: req.userId,
      title,
      type,
      target,
      unit,
      exerciseName,
      deadline
    });

    res.status(201).json(goal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all goals
export const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.userId })
      .sort({ completed: 1, deadline: 1 });
    
    res.json(goals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update goal progress
export const updateGoal = async (req, res) => {
  try {
    const { goalId } = req.params;
    const updates = req.body;

    // If marking as complete, set completedAt
    if (updates.completed && !updates.completedAt) {
      updates.completedAt = new Date();
    }

    const goal = await Goal.findOneAndUpdate(
      { _id: goalId, userId: req.userId },
      updates,
      { new: true }
    );

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    res.json(goal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete goal
export const deleteGoal = async (req, res) => {
  try {
    const { goalId } = req.params;
    
    const goal = await Goal.findOneAndDelete({
      _id: goalId,
      userId: req.userId
    });

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    res.json({ message: "Goal deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};