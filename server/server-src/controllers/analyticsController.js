import Workout from "../models/Workout.js";

// Get workout statistics
export const getWorkoutStats = async (req, res) => {
  try {
    const { timeframe = 'all' } = req.query; // all, week, month, year
    
    let dateFilter = {};
    const now = new Date();
    
    if (timeframe === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      dateFilter = { date: { $gte: weekAgo } };
    } else if (timeframe === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      dateFilter = { date: { $gte: monthAgo } };
    } else if (timeframe === 'year') {
      const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      dateFilter = { date: { $gte: yearAgo } };
    }

    const workouts = await Workout.find({ 
      userId: req.userId,
      ...dateFilter
    }).sort({ date: 1 });

    // Calculate statistics
    const totalWorkouts = workouts.length;
    
    let totalVolume = 0;
    let totalSets = 0;
    let totalReps = 0;
    const exerciseFrequency = {};
    const volumeByDate = {};
    const exerciseProgress = {};

    workouts.forEach(workout => {
      const dateKey = workout.date.toISOString().split('T')[0];
      
      if (!volumeByDate[dateKey]) {
        volumeByDate[dateKey] = 0;
      }

      workout.exercises.forEach(exercise => {
        // Track frequency
        exerciseFrequency[exercise.exerciseName] = 
          (exerciseFrequency[exercise.exerciseName] || 0) + 1;

        // Track progress for each exercise
        if (!exerciseProgress[exercise.exerciseName]) {
          exerciseProgress[exercise.exerciseName] = [];
        }

        exercise.sets.forEach(set => {
          totalSets++;
          totalReps += set.reps;
          const volume = set.reps * set.weight;
          totalVolume += volume;
          volumeByDate[dateKey] += volume;

          // Store max weight for this exercise on this date
          exerciseProgress[exercise.exerciseName].push({
            date: workout.date,
            weight: set.weight,
            reps: set.reps,
            volume: volume
          });
        });
      });
    });

    // Get top exercises
    const topExercises = Object.entries(exerciseFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    // Format volume by date for chart
    const volumeChart = Object.entries(volumeByDate)
      .map(([date, volume]) => ({ date, volume }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    // Get personal records
    const personalRecords = {};
    Object.entries(exerciseProgress).forEach(([exerciseName, records]) => {
      const maxWeight = Math.max(...records.map(r => r.weight));
      const maxVolume = Math.max(...records.map(r => r.volume));
      
      personalRecords[exerciseName] = {
        maxWeight: records.find(r => r.weight === maxWeight),
        maxVolume: records.find(r => r.volume === maxVolume)
      };
    });

    res.json({
      totalWorkouts,
      totalVolume,
      totalSets,
      totalReps,
      averageVolume: totalWorkouts > 0 ? Math.round(totalVolume / totalWorkouts) : 0,
      topExercises,
      volumeChart,
      exerciseProgress,
      personalRecords
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get progress for a specific exercise
export const getExerciseProgress = async (req, res) => {
  try {
    const { exerciseName } = req.params;
    
    const workouts = await Workout.find({
      userId: req.userId,
      "exercises.exerciseName": exerciseName
    }).sort({ date: 1 });

    const progress = [];

    workouts.forEach(workout => {
      const exercise = workout.exercises.find(e => e.exerciseName === exerciseName);
      if (exercise) {
        const maxWeight = Math.max(...exercise.sets.map(s => s.weight));
        const totalVolume = exercise.sets.reduce((sum, s) => sum + (s.reps * s.weight), 0);
        const totalReps = exercise.sets.reduce((sum, s) => sum + s.reps, 0);

        progress.push({
          date: workout.date,
          maxWeight,
          totalVolume,
          totalReps,
          sets: exercise.sets
        });
      }
    });

    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};