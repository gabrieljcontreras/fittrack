import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { getWorkoutStats, getExerciseProgress } from "../api/analytics";

function Analytics() {
  const { token } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("month");
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [exerciseData, setExerciseData] = useState(null);

  useEffect(() => {
    fetchStats();
  }, [timeframe]);

  useEffect(() => {
    if (selectedExercise) {
      fetchExerciseProgress(selectedExercise);
    }
  }, [selectedExercise]);

  const fetchStats = async () => {
    try {
      const data = await getWorkoutStats(timeframe, token);
      setStats(data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchExerciseProgress = async (exerciseName) => {
    try {
      const data = await getExerciseProgress(exerciseName, token);
      setExerciseData(data);
    } catch (err) {
      console.error("Error fetching exercise progress:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white font-light tracking-widest">LOADING...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white font-light tracking-widest">NO DATA AVAILABLE</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-16">
          <p className="text-zinc-500 text-xs font-medium tracking-widest uppercase mb-4">ANALYTICS</p>
          <h1 className="text-6xl font-light tracking-tight text-white mb-8">Your Progress</h1>
          
          {/* Timeframe Selector */}
          <div className="flex gap-2">
            {['week', 'month', 'year', 'all'].map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={`px-6 py-3 border transition-all duration-200 font-medium tracking-widest uppercase text-xs ${
                  timeframe === period
                    ? 'bg-white text-black border-white'
                    : 'bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-500'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <div className="bg-zinc-900 border border-zinc-800 p-8">
            <p className="text-zinc-500 text-xs font-medium tracking-widest uppercase mb-4">
              TOTAL WORKOUTS
            </p>
            <p className="text-5xl font-light tracking-tight text-white mb-2">
              {stats.totalWorkouts || 0}
            </p>
            <p className="text-zinc-400 font-light tracking-wide text-sm">
              Sessions completed
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-8">
            <p className="text-zinc-500 text-xs font-medium tracking-widest uppercase mb-4">
              TOTAL VOLUME
            </p>
            <p className="text-5xl font-light tracking-tight text-white mb-2">
              {stats.totalVolume ? `${(stats.totalVolume / 1000).toFixed(1)}K` : 0}
            </p>
            <p className="text-zinc-400 font-light tracking-wide text-sm">
              Pounds lifted
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-8">
            <p className="text-zinc-500 text-xs font-medium tracking-widest uppercase mb-4">
              TOTAL SETS
            </p>
            <p className="text-5xl font-light tracking-tight text-white mb-2">
              {stats.totalSets || 0}
            </p>
            <p className="text-zinc-400 font-light tracking-wide text-sm">
              Sets completed
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-8">
            <p className="text-zinc-500 text-xs font-medium tracking-widest uppercase mb-4">
              CONSISTENCY
            </p>
            <p className="text-5xl font-light tracking-tight text-white mb-2">
              {stats.consistency || 0}%
            </p>
            <p className="text-zinc-400 font-light tracking-wide text-sm">
              Workout frequency
            </p>
          </div>
        </div>

        {/* Exercise Breakdown */}
        <div className="bg-zinc-900 border border-zinc-800 p-12 mb-16">
          <h2 className="text-3xl font-light tracking-tight text-white mb-8">
            Exercise Breakdown
          </h2>
          
          {stats.exercises && stats.exercises.length > 0 ? (
            <div className="space-y-4">
              {stats.exercises.map((exercise, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedExercise(exercise.name)}
                  className={`w-full p-6 border transition-all duration-200 text-left ${
                    selectedExercise === exercise.name
                      ? 'bg-zinc-800 border-white'
                      : 'bg-black border-zinc-700 hover:border-zinc-500'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-light tracking-tight text-white mb-2">
                        {exercise.name}
                      </h3>
                      <p className="text-sm text-zinc-400 font-light tracking-wide">
                        {exercise.totalSets} sets · {exercise.totalReps} reps · {exercise.totalVolume} lbs
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-light text-white mb-1">
                        {exercise.maxWeight} lbs
                      </p>
                      <p className="text-xs text-zinc-500 uppercase tracking-widest">
                        PEAK WEIGHT
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-zinc-400 font-light tracking-wide text-center py-12">
              No exercises tracked yet. Start logging workouts to see your progress!
            </p>
          )}
        </div>

        {/* Exercise Progress Detail */}
        {selectedExercise && exerciseData && (
          <div className="bg-zinc-900 border border-zinc-800 p-12">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-zinc-500 text-xs font-medium tracking-widest uppercase mb-2">
                  EXERCISE PROGRESS
                </p>
                <h2 className="text-3xl font-light tracking-tight text-white">
                  {selectedExercise}
                </h2>
              </div>
              <button
                onClick={() => setSelectedExercise(null)}
                className="px-4 py-2 border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition-all text-xs uppercase tracking-widest"
              >
                Close
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-black border border-zinc-800 p-6">
                <p className="text-zinc-500 text-xs font-medium tracking-widest uppercase mb-3">
                  PERSONAL RECORD
                </p>
                <p className="text-4xl font-light text-white mb-1">
                  {exerciseData.personalRecord} lbs
                </p>
                <p className="text-xs text-zinc-400 font-light">
                  {new Date(exerciseData.prDate).toLocaleDateString()}
                </p>
              </div>

              <div className="bg-black border border-zinc-800 p-6">
                <p className="text-zinc-500 text-xs font-medium tracking-widest uppercase mb-3">
                  TOTAL VOLUME
                </p>
                <p className="text-4xl font-light text-white mb-1">
                  {(exerciseData.totalVolume / 1000).toFixed(1)}K lbs
                </p>
                <p className="text-xs text-zinc-400 font-light">
                  All time
                </p>
              </div>

              <div className="bg-black border border-zinc-800 p-6">
                <p className="text-zinc-500 text-xs font-medium tracking-widest uppercase mb-3">
                  SESSIONS
                </p>
                <p className="text-4xl font-light text-white mb-1">
                  {exerciseData.sessions}
                </p>
                <p className="text-xs text-zinc-400 font-light">
                  Total workouts
                </p>
              </div>
            </div>

            {/* Progress History */}
            <div>
              <h3 className="text-xl font-light tracking-tight text-white mb-6">
                Recent Sessions
              </h3>
              <div className="space-y-3">
                {exerciseData.history && exerciseData.history.map((session, index) => (
                  <div
                    key={index}
                    className="bg-black border border-zinc-800 p-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="text-zinc-400 text-xs uppercase tracking-widest mb-1">
                        {new Date(session.date).toLocaleDateString()}
                      </p>
                      <p className="text-white font-light">
                        {session.sets.map((set, i) => 
                          `${set.reps} × ${set.weight}lbs`
                        ).join(' · ')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-light text-white">
                        {session.maxWeight} lbs
                      </p>
                      <p className="text-xs text-zinc-500 uppercase tracking-widest">
                        MAX
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Analytics;