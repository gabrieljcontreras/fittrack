import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import workoutRoutes from "./routes/workouts.js";
import goalRoutes from "./routes/goals.js";
import analyticsRoutes from "./routes/analytics.js";
import aiCoachRoutes from "./routes/aiCoach.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("API is running...");
}); 

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend connected" });
});

app.use("/api/auth", authRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/ai-coach", aiCoachRoutes);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});



