import mongoose from "mongoose";

const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['strength', 'weight', 'volume', 'frequency', 'custom'],
    required: true 
  },
  target: { type: Number, required: true }, // Target number
  current: { type: Number, default: 0 }, // Current progress
  unit: { type: String, required: true }, // lbs, kg, workouts, etc.
  exerciseName: { type: String }, // For strength goals
  deadline: { type: Date },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date }
});

export default mongoose.model("Goal", goalSchema);