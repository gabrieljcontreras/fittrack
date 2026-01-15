import mongoose from "mongoose";

const setSchema = new mongoose.Schema({
  setNumber: { type: Number, required: true },
  reps: { type: Number, required: true },
  weight: { type: Number, required: true }, // in lbs or kg
  completed: { type: Boolean, default: false }
});

const exerciseSchema = new mongoose.Schema({
  exerciseName: { type: String, required: true },
  sets: [setSchema],
  notes: { type: String }
});

const workoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  workoutName: { type: String, required: true },
  exercises: [exerciseSchema],
  date: { type: Date, default: Date.now },
  duration: { type: Number }, // in minutes
  completed: { type: Boolean, default: false },
  notes: { type: String }
});

export default mongoose.model("Workout", workoutSchema);