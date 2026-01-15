import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getWorkouts, deleteWorkout, updateWorkout } from "../api/workouts";

function WorkoutHistory() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [filter, setFilter] = useState("all");
  const [groupBy, setGroupBy] = useState("date");

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const data = await getWorkouts(token);
      setWorkouts(data);
    } catch (err) {
      console.error("Error fetching workouts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (workoutId) => {
    if (!window.confirm("Delete this workout?")) return;
    
    try {
      await deleteWorkout(workoutId, token);
      setWorkouts(workouts.filter(w => w._id !== workoutId));
      if (selectedWorkout?._id === workoutId) {
        setSelectedWorkout(null);
      }
    } catch (err) {
      console.error("Error deleting workout:", err);
    }
  };

  const startEditing = (workout) => {
    setEditingWorkout(JSON.parse(JSON.stringify(workout))); // Deep copy
  };

  const cancelEditing = () => {
    setEditingWorkout(null);
  };

  const saveEdit = async () => {
    try {
      await updateWorkout(editingWorkout._id, {
        workoutName: editingWorkout.workoutName,
        exercises: editingWorkout.exercises
      }, token);
      
      setWorkouts(workouts.map(w => 
        w._id === editingWorkout._id ? editingWorkout : w
      ));
      setSelectedWorkout(editingWorkout);
      setEditingWorkout(null);
    } catch (err) {
      console.error("Error updating workout:", err);
    }
  };

  const updateEditExerciseSet = (exerciseIdx, setIdx, field, value) => {
    const updated = { ...editingWorkout };
    updated.exercises[exerciseIdx].sets[setIdx][field] = parseInt(value) || 0;
    setEditingWorkout(updated);
  };

  const getFilteredWorkouts = () => {
    const now = new Date();
    
    return workouts.filter(workout => {
      const workoutDate = new Date(workout.date);
      
      if (filter === "week") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return workoutDate >= weekAgo;
      }
      
      if (filter === "month") {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return workoutDate >= monthAgo;
      }
      
      return true;
    });
  };

  const getGroupedWorkouts = () => {
    const filtered = getFilteredWorkouts();
    
    if (groupBy === "name") {
      const grouped = {};
      filtered.forEach(workout => {
        if (!grouped[workout.workoutName]) {
          grouped[workout.workoutName] = [];
        }
        grouped[workout.workoutName].push(workout);
      });
      return grouped;
    }
    
    return { "All Workouts": filtered };
  };

  const getSameWorkoutDayExercises = (workout) => {
    return workouts
      .filter(w => w.workoutName === workout.workoutName && w._id !== workout._id)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  };

  const calculateVolume = (workout) => {
    let total = 0;
    workout.exercises.forEach(exercise => {
      exercise.sets.forEach(set => {
        total += set.reps * set.weight;
      });
    });
    return total;
  };

  const grouped = getGroupedWorkouts();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white font-light tracking-widest">LOADING...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header with Navigation */}
        <div className="mb-16 flex justify-between items-start">
          <div>
            <p className="text-zinc-500 text-xs font-medium tracking-widest uppercase mb-4">HISTORY</p>
            <h1 className="text-6xl font-light tracking-tight text-white mb-6">Your Workouts</h1>
          </div>
          <div className="flex gap-4">
            <Link
              to="/dashboard"
              className="px-8 py-4 bg-transparent text-white border border-zinc-700 hover:bg-zinc-800 font-medium tracking-widest uppercase text-sm transition-all"
            >
              Dashboard
            </Link>
            <Link
              to="/log-workout"
              className="px-8 py-4 bg-white text-black font-medium tracking-widest uppercase text-sm hover:bg-zinc-200 transition-all"
            >
              + New Workout
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-12 flex gap-6 border-b border-zinc-800 pb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 text-xs uppercase tracking-widest transition-all ${
                filter === "all"
                  ? "bg-white text-black"
                  : "bg-transparent text-zinc-400 border border-zinc-700 hover:text-white"
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setFilter("week")}
              className={`px-4 py-2 text-xs uppercase tracking-widest transition-all ${
                filter === "week"
                  ? "bg-white text-black"
                  : "bg-transparent text-zinc-400 border border-zinc-700 hover:text-white"
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setFilter("month")}
              className={`px-4 py-2 text-xs uppercase tracking-widest transition-all ${
                filter === "month"
                  ? "bg-white text-black"
                  : "bg-transparent text-zinc-400 border border-zinc-700 hover:text-white"
              }`}
            >
              This Month
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setGroupBy("date")}
              className={`px-4 py-2 text-xs uppercase tracking-widest transition-all ${
                groupBy === "date"
                  ? "bg-white text-black"
                  : "bg-transparent text-zinc-400 border border-zinc-700 hover:text-white"
              }`}
            >
              By Date
            </button>
            <button
              onClick={() => setGroupBy("name")}
              className={`px-4 py-2 text-xs uppercase tracking-widest transition-all ${
                groupBy === "name"
                  ? "bg-white text-black"
                  : "bg-transparent text-zinc-400 border border-zinc-700 hover:text-white"
              }`}
            >
              By Workout
            </button>
          </div>
        </div>

        {workouts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-500 font-light tracking-wide mb-8">No workouts logged yet</p>
            <Link
              to="/log-workout"
              className="inline-block px-8 py-4 bg-white text-black font-medium tracking-widest uppercase text-sm hover:bg-zinc-200 transition-all"
            >
              Log Your First Workout
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Workout List */}
            <div className="lg:col-span-2 space-y-4">
              {Object.entries(grouped).map(([groupName, groupWorkouts]) => (
                <div key={groupName}>
                  {groupBy === "name" && (
                    <h3 className="text-2xl font-light tracking-tight text-white mb-4 uppercase">
                      {groupName}
                    </h3>
                  )}
                  
                  {groupWorkouts.map((workout) => (
                    <div
                      key={workout._id}
                      onClick={() => setSelectedWorkout(workout)}
                      className={`bg-zinc-900 border transition-all cursor-pointer ${
                        selectedWorkout?._id === workout._id
                          ? "border-white"
                          : "border-zinc-800 hover:border-zinc-700"
                      }`}
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-2xl font-light tracking-tight text-white mb-2">
                              {workout.workoutName}
                            </h3>
                            <p className="text-sm text-zinc-500 font-light tracking-wide">
                              {new Date(workout.date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                startEditing(workout);
                              }}
                              className="px-3 py-2 border border-zinc-700 text-white text-xs hover:bg-zinc-800 transition-all uppercase tracking-widest"
                            >
                              Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(workout._id);
                              }}
                              className="px-3 py-2 border border-red-900 text-red-400 text-xs hover:bg-red-950 transition-all uppercase tracking-widest"
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-zinc-800">
                          <div>
                            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Exercises</p>
                            <p className="text-xl font-light text-white">{workout.exercises.length}</p>
                          </div>
                          <div>
                            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Total Sets</p>
                            <p className="text-xl font-light text-white">
                              {workout.exercises.reduce((sum, ex) => sum + ex.sets.length, 0)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Volume</p>
                            <p className="text-xl font-light text-white">
                              {calculateVolume(workout).toLocaleString()} lbs
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Detailed/Edit View */}
            <div className="lg:col-span-1">
              {editingWorkout ? (
                // EDIT MODE
                <div className="bg-zinc-900 border border-white p-6 sticky top-6">
                  <p className="text-xs text-zinc-500 uppercase tracking-widest mb-4">EDITING WORKOUT</p>
                  
                  <input
                    type="text"
                    value={editingWorkout.workoutName}
                    onChange={(e) => setEditingWorkout({...editingWorkout, workoutName: e.target.value})}
                    className="w-full px-4 py-3 mb-6 bg-black border border-zinc-800 text-white focus:outline-none focus:border-white transition-colors font-light tracking-wide"
                  />

                  <div className="space-y-6 mb-6 max-h-96 overflow-y-auto">
                    {editingWorkout.exercises.map((exercise, exIdx) => (
                      <div key={exIdx} className="border-l-2 border-white pl-4">
                        <h4 className="text-lg font-light tracking-wide text-white mb-3 uppercase">
                          {exercise.exerciseName}
                        </h4>
                        
                        <div className="space-y-2">
                          {exercise.sets.map((set, setIdx) => (
                            <div key={setIdx} className="flex gap-2">
                              <span className="text-zinc-400 w-12">Set {set.setNumber}</span>
                              <input
                                type="number"
                                value={set.reps}
                                onChange={(e) => updateEditExerciseSet(exIdx, setIdx, 'reps', e.target.value)}
                                className="w-20 px-2 py-1 bg-black border border-zinc-800 text-white text-sm focus:outline-none focus:border-white"
                                placeholder="reps"
                              />
                              <span className="text-zinc-600">×</span>
                              <input
                                type="number"
                                value={set.weight}
                                onChange={(e) => updateEditExerciseSet(exIdx, setIdx, 'weight', e.target.value)}
                                className="w-20 px-2 py-1 bg-black border border-zinc-800 text-white text-sm focus:outline-none focus:border-white"
                                placeholder="lbs"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={saveEdit}
                      className="flex-1 py-3 bg-white text-black hover:bg-zinc-200 transition-all text-xs uppercase tracking-widest font-medium"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="px-6 py-3 border border-zinc-700 text-white hover:bg-zinc-800 transition-all text-xs uppercase tracking-widest"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : selectedWorkout ? (
                // VIEW MODE
                <div className="bg-zinc-900 border border-zinc-800 p-6 sticky top-6">
                  <p className="text-xs text-zinc-500 uppercase tracking-widest mb-4">WORKOUT DETAILS</p>
                  
                  <h3 className="text-3xl font-light tracking-tight text-white mb-6">
                    {selectedWorkout.workoutName}
                  </h3>

                  <div className="space-y-6">
                    {selectedWorkout.exercises.map((exercise, idx) => (
                      <div key={idx} className="border-l-2 border-white pl-4">
                        <h4 className="text-lg font-light tracking-wide text-white mb-3 uppercase">
                          {exercise.exerciseName}
                        </h4>
                        
                        <div className="space-y-2">
                          {exercise.sets.map((set, setIdx) => (
                            <div key={setIdx} className="flex justify-between text-sm">
                              <span className="text-zinc-400">Set {set.setNumber}</span>
                              <span className="text-white font-light">
                                {set.reps} reps × {set.weight} lbs
                              </span>
                            </div>
                          ))}
                        </div>

                        {exercise.notes && (
                          <p className="text-sm text-zinc-500 mt-2 italic">{exercise.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Same Workout Day History */}
                  {getSameWorkoutDayExercises(selectedWorkout).length > 0 && (
                    <div className="mt-8 pt-8 border-t border-zinc-800">
                      <p className="text-xs text-zinc-500 uppercase tracking-widest mb-4">
                        PREVIOUS {selectedWorkout.workoutName.toUpperCase()} SESSIONS
                      </p>
                      
                      <div className="space-y-3">
                        {getSameWorkoutDayExercises(selectedWorkout).map((prevWorkout) => (
                          <div
                            key={prevWorkout._id}
                            onClick={() => setSelectedWorkout(prevWorkout)}
                            className="p-3 bg-black border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-all"
                          >
                            <p className="text-xs text-zinc-400 mb-1">
                              {new Date(prevWorkout.date).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-white font-light">
                              {prevWorkout.exercises.length} exercises · {calculateVolume(prevWorkout).toLocaleString()} lbs volume
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-zinc-900 border border-zinc-800 p-6 sticky top-6">
                  <p className="text-zinc-500 font-light text-center">
                    Select a workout to view details
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WorkoutHistory;