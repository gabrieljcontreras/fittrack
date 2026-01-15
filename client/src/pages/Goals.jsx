import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { createGoal, getGoals, updateGoal, deleteGoal } from "../api/goals";

function Goals() {
  const { token } = useContext(AuthContext);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "strength",
    target: "",
    unit: "lbs",
    exerciseName: "",
    deadline: ""
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const data = await getGoals(token);
      setGoals(data);
    } catch (err) {
      console.error("Error fetching goals:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await createGoal(formData, token);
      setShowCreateForm(false);
      setFormData({
        title: "",
        type: "strength",
        target: "",
        unit: "lbs",
        exerciseName: "",
        deadline: ""
      });
      fetchGoals();
    } catch (err) {
      console.error("Error creating goal:", err);
    }
  };

  const handleComplete = async (goalId, currentValue) => {
    try {
      await updateGoal(goalId, { completed: !currentValue }, token);
      fetchGoals();
    } catch (err) {
      console.error("Error updating goal:", err);
    }
  };

  const handleDelete = async (goalId) => {
    if (!window.confirm("Delete this goal?")) return;
    
    try {
      await deleteGoal(goalId, token);
      setGoals(goals.filter(g => g._id !== goalId));
    } catch (err) {
      console.error("Error deleting goal:", err);
    }
  };

  const handleUpdateProgress = async (goalId, newProgress) => {
    try {
      const goal = goals.find(g => g._id === goalId);
      const completed = newProgress >= goal.target;
      
      await updateGoal(goalId, { 
        current: newProgress,
        completed
      }, token);
      
      fetchGoals();
    } catch (err) {
      console.error("Error updating progress:", err);
    }
  };

  const calculateProgress = (goal) => {
    if (goal.target === 0) return 0;
    return Math.min((goal.current / goal.target) * 100, 100);
  };

  const activeGoals = goals.filter(g => !g.completed);
  const completedGoals = goals.filter(g => g.completed);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white font-light tracking-widest">LOADING...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-20">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-16 flex justify-between items-start">
          <div>
            <p className="text-zinc-500 text-xs font-medium tracking-widest uppercase mb-4">GOALS</p>
            <h1 className="text-6xl font-light tracking-tight text-white mb-6">Your Targets</h1>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-8 py-4 bg-white text-black font-medium tracking-widest uppercase text-sm hover:bg-zinc-200 transition-all"
          >
            {showCreateForm ? 'Cancel' : '+ New Goal'}
          </button>
        </div>

        {/* Create Goal Form */}
        {showCreateForm && (
          <div className="bg-zinc-900 border border-zinc-800 p-8 mb-12">
            <h3 className="text-2xl font-light tracking-tight text-white mb-6">CREATE GOAL</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-medium tracking-widest uppercase text-zinc-400 mb-3">
                  Goal Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., Bench 225 lbs"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-5 py-4 bg-black border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors font-light tracking-wide"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium tracking-widest uppercase text-zinc-400 mb-3">
                    Goal Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-5 py-4 bg-black border border-zinc-800 text-white focus:outline-none focus:border-white transition-colors font-light tracking-wide"
                  >
                    <option value="strength">Strength (lift specific weight)</option>
                    <option value="volume">Volume (total weight moved)</option>
                    <option value="frequency">Frequency (workouts per week)</option>
                    <option value="weight">Body Weight</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                {(formData.type === 'strength') && (
                  <div>
                    <label className="block text-xs font-medium tracking-widest uppercase text-zinc-400 mb-3">
                      Exercise Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Bench Press"
                      value={formData.exerciseName}
                      onChange={(e) => setFormData({...formData, exerciseName: e.target.value})}
                      className="w-full px-5 py-4 bg-black border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors font-light tracking-wide"
                    />
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-medium tracking-widest uppercase text-zinc-400 mb-3">
                    Target
                  </label>
                  <input
                    type="number"
                    placeholder="225"
                    value={formData.target}
                    onChange={(e) => setFormData({...formData, target: e.target.value})}
                    className="w-full px-5 py-4 bg-black border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors font-light tracking-wide"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium tracking-widest uppercase text-zinc-400 mb-3">
                    Unit
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    className="w-full px-5 py-4 bg-black border border-zinc-800 text-white focus:outline-none focus:border-white transition-colors font-light tracking-wide"
                  >
                    <option value="lbs">lbs</option>
                    <option value="kg">kg</option>
                    <option value="reps">reps</option>
                    <option value="workouts">workouts</option>
                    <option value="minutes">minutes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium tracking-widest uppercase text-zinc-400 mb-3">
                    Deadline (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                    className="w-full px-5 py-4 bg-black border border-zinc-800 text-white focus:outline-none focus:border-white transition-colors font-light tracking-wide"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-5 bg-white text-black font-medium tracking-widest uppercase text-sm hover:bg-zinc-200 transition-all"
              >
                Create Goal
              </button>
            </form>
          </div>
        )}

        {/* Active Goals */}
        {activeGoals.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-light tracking-tight text-white mb-8">ACTIVE GOALS</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {activeGoals.map((goal) => (
                <div key={goal._id} className="bg-zinc-900 border border-zinc-800 p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-light tracking-tight text-white mb-2">
                        {goal.title}
                      </h3>
                      <p className="text-sm text-zinc-500 uppercase tracking-widest">
                        {goal.type}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(goal._id)}
                      className="px-3 py-2 border border-red-900 text-red-400 text-xs hover:bg-red-950 transition-all"
                    >
                      Delete
                    </button>
                  </div>

                  {goal.exerciseName && (
                    <p className="text-zinc-400 font-light mb-4">{goal.exerciseName}</p>
                  )}

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-zinc-400">Progress</span>
                      <span className="text-white font-light">
                        {goal.current} / {goal.target} {goal.unit}
                      </span>
                    </div>
                    <div className="w-full bg-black border border-zinc-800 h-3">
                      <div 
                        className="bg-white h-full transition-all duration-500"
                        style={{ width: `${calculateProgress(goal)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-zinc-500 mt-2">
                      {Math.round(calculateProgress(goal))}% Complete
                    </p>
                  </div>

                  {/* Update Progress */}
                  <div className="flex gap-2 mb-4">
                    <input
                      type="number"
                      placeholder="Update progress"
                      defaultValue={goal.current}
                      onBlur={(e) => {
                        const newValue = parseInt(e.target.value) || 0;
                        if (newValue !== goal.current) {
                          handleUpdateProgress(goal._id, newValue);
                        }
                      }}
                      className="flex-1 px-4 py-3 bg-black border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors font-light"
                    />
                    <button
                      onClick={() => handleComplete(goal._id, goal.completed)}
                      className="px-6 py-3 border border-zinc-700 text-white hover:bg-zinc-800 transition-all text-xs uppercase tracking-widest"
                    >
                      Mark Complete
                    </button>
                  </div>

                  {goal.deadline && (
                    <p className="text-xs text-zinc-500">
                      Deadline: {new Date(goal.deadline).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Goals */}
        {completedGoals.length > 0 && (
          <div>
            <h2 className="text-3xl font-light tracking-tight text-white mb-8">COMPLETED</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {completedGoals.map((goal) => (
                <div key={goal._id} className="bg-zinc-900 border border-zinc-700 p-8 opacity-75">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-light tracking-tight text-white mb-2 line-through">
                        {goal.title}
                      </h3>
                      <p className="text-sm text-zinc-500">
                        {goal.target} {goal.unit}
                      </p>
                    </div>
                    <div className="text-2xl">✓</div>
                  </div>
                  
                  {goal.completedAt && (
                    <p className="text-xs text-zinc-500">
                      Completed: {new Date(goal.completedAt).toLocaleDateString()}
                    </p>
                  )}
                  
                  <button
                    onClick={() => handleDelete(goal._id)}
                    className="mt-4 text-xs text-red-400 hover:text-red-300 uppercase tracking-widest"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {goals.length === 0 && !showCreateForm && (
          <div className="text-center py-20">
            <p className="text-zinc-500 font-light tracking-wide mb-8">No goals set yet</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-8 py-4 bg-white text-black font-medium tracking-widest uppercase text-sm hover:bg-zinc-200 transition-all"
            >
              Create Your First Goal
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Goals;