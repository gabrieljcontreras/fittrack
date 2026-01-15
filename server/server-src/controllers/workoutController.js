import Workout from "../models/Workout.js";

// Create a new workout
export const createWorkout = async (req, res) => {
  try {
    const { workoutName, exercises, notes } = req.body;
    
    const workout = await Workout.create({
      userId: req.userId, // from auth middleware
      workoutName,
      exercises,
      notes
    });

    res.status(201).json(workout);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all workouts for a user
export const getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.userId })
      .sort({ date: -1 });
    
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get last workout for a specific exercise
export const getLastWorkout = async (req, res) => {
  try {
    const { exerciseName } = req.params;
    
    const workout = await Workout.findOne({
      userId: req.userId,
      "exercises.exerciseName": exerciseName
    })
    .sort({ date: -1 })
    .limit(1);

    if (!workout) {
      return res.json({ message: "No previous workout found" });
    }

    const exercise = workout.exercises.find(
      ex => ex.exerciseName === exerciseName
    );

    res.json({
      date: workout.date,
      exercise: exercise
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a workout (for marking sets as complete)
export const updateWorkout = async (req, res) => {
  try {
    const { workoutId } = req.params;
    const updates = req.body;

    const workout = await Workout.findOneAndUpdate(
      { _id: workoutId, userId: req.userId },
      updates,
      { new: true }
    );

    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    res.json(workout);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a workout
export const deleteWorkout = async (req, res) => {
  try {
    const { workoutId } = req.params;
    
    const workout = await Workout.findOneAndDelete({
      _id: workoutId,
      userId: req.userId
    });

    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    res.json({ message: "Workout deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};