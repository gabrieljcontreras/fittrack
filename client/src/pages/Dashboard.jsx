import { useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Dashboard() {
  const { user, token, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <p className="text-zinc-500 text-xs font-medium tracking-widest uppercase mb-4">DASHBOARD</p>
          <h1 className="text-6xl md:text-7xl font-light tracking-tight text-white mb-6">
            Welcome Back
          </h1>
          <p className="text-xl text-zinc-400 font-light tracking-wide">
            Your training hub. Track progress and manage your fitness journey.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Stat Card 1 */}
          <div className="bg-zinc-900 border border-zinc-800 p-8">
            <p className="text-zinc-500 text-xs font-medium tracking-widest uppercase mb-4">WORKOUTS</p>
            <p className="text-5xl font-light tracking-tight text-white mb-2">0</p>
            <p className="text-zinc-400 font-light tracking-wide text-sm">Total Sessions</p>
          </div>

          {/* Stat Card 2 */}
          <div className="bg-zinc-900 border border-zinc-800 p-8">
            <p className="text-zinc-500 text-xs font-medium tracking-widest uppercase mb-4">STREAK</p>
            <p className="text-5xl font-light tracking-tight text-white mb-2">0</p>
            <p className="text-zinc-400 font-light tracking-wide text-sm">Days Active</p>
          </div>

          {/* Stat Card 3 */}
          <div className="bg-zinc-900 border border-zinc-800 p-8">
            <p className="text-zinc-500 text-xs font-medium tracking-widest uppercase mb-4">GOALS</p>
            <p className="text-5xl font-light tracking-tight text-white mb-2">0</p>
            <p className="text-zinc-400 font-light tracking-wide text-sm">Completed</p>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-12">
          <h2 className="text-3xl font-light tracking-tight text-white mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              to="/log-workout"
              className="py-5 bg-white text-black border border-zinc-800 hover:bg-zinc-200 transition-all duration-200 font-medium tracking-widest uppercase text-sm text-center"
            >
              Log Workout
            </Link>
            <Link
              to="/workout-history"
              className="py-5 bg-transparent text-white border border-zinc-700 hover:bg-zinc-800 transition-all duration-200 font-medium tracking-widest uppercase text-sm text-center"
            >
              View History
            </Link>
            <Link
              to="/analytics"
              className="py-5 bg-transparent text-white border border-zinc-700 hover:bg-zinc-800 transition-all duration-200 font-medium tracking-widest uppercase text-sm text-center"
            >
              View Analytics
            </Link>
            <Link
              to="/ai-coach"
              className="py-5 bg-white text-black border border-zinc-800 hover:bg-zinc-200 transition-all duration-200 font-medium tracking-widest uppercase text-sm text-center"
            >
            🤖 AI Coach
            </Link>
            <Link
              to="/goals"
              className="py-5 bg-transparent text-white border border-zinc-700 hover:bg-zinc-800 transition-all duration-200 font-medium tracking-widest uppercase text-sm text-center"
            >
              Manage Goals
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;