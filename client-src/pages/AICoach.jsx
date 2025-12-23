import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getWorkouts } from "../api/workouts";
import { getGoals } from "../api/goals";

function AICoach() {
  const { token } = useContext(AuthContext);
  const [workouts, setWorkouts] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [selectedAnalysisType, setSelectedAnalysisType] = useState("general");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [workoutsData, goalsData] = await Promise.all([
        getWorkouts(token),
        getGoals(token)
      ]);
      setWorkouts(workoutsData);
      setGoals(goalsData);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const analyzeWithAI = async (analysisType) => {
    setLoading(true);
    setSelectedAnalysisType(analysisType);

    try {
      // Prepare workout data for AI
      const recentWorkouts = workouts.slice(0, 10);
      const workoutSummary = recentWorkouts.map(w => ({
        name: w.workoutName,
        date: new Date(w.date).toLocaleDateString(),
        exercises: w.exercises.map(e => ({
          name: e.exerciseName,
          sets: e.sets.map(s => `${s.reps} reps × ${s.weight} lbs`)
        }))
      }));

      const goalsSummary = goals.filter(g => !g.completed).map(g => ({
        title: g.title,
        type: g.type,
        current: g.current,
        target: g.target,
        unit: g.unit
      }));

      // Call backend API for AI analysis
      const response = await fetch("http://localhost:5000/api/ai-coach/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          analysisType,
          workouts: workoutSummary,
          goals: goalsSummary
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setAnalysis(data.analysis);
      
    } catch (err) {
      console.error("Error analyzing with AI:", err);
      setAnalysis("Error generating analysis. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black py-20">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-16">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white font-light tracking-wide uppercase text-sm transition-colors mb-8"
          >
            ← Back to Dashboard
          </Link>
          
          <p className="text-zinc-500 text-xs font-medium tracking-widest uppercase mb-4">AI COACH</p>
          <h1 className="text-6xl font-light tracking-tight text-white mb-6">
            Personal Training Intelligence
          </h1>
          <p className="text-xl text-zinc-400 font-light tracking-wide">
            Get personalized recommendations powered by AI analysis of your workout history
          </p>
        </div>

        {/* Analysis Type Selection */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <button
            onClick={() => analyzeWithAI("general")}
            disabled={loading || workouts.length === 0}
            className={`p-8 border transition-all text-left ${
              loading && selectedAnalysisType === "general"
                ? "border-white bg-white text-black"
                : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-light tracking-tight text-white mb-2">
              GENERAL ANALYSIS
            </h3>
            <p className="text-sm text-zinc-400 font-light">
              Overall assessment and recommendations
            </p>
          </button>

          <button
            onClick={() => analyzeWithAI("progression")}
            disabled={loading || workouts.length === 0}
            className={`p-8 border transition-all text-left ${
              loading && selectedAnalysisType === "progression"
                ? "border-white bg-white text-black"
                : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-xl font-light tracking-tight text-white mb-2">
              PROGRESSION PLAN
            </h3>
            <p className="text-sm text-zinc-400 font-light">
              Next workout recommendations
            </p>
          </button>

          <button
            onClick={() => analyzeWithAI("recovery")}
            disabled={loading || workouts.length === 0}
            className={`p-8 border transition-all text-left ${
              loading && selectedAnalysisType === "recovery"
                ? "border-white bg-white text-black"
                : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <div className="text-4xl mb-4">💤</div>
            <h3 className="text-xl font-light tracking-tight text-white mb-2">
              RECOVERY CHECK
            </h3>
            <p className="text-sm text-zinc-400 font-light">
              Fatigue analysis and rest advice
            </p>
          </button>

          <button
            onClick={() => analyzeWithAI("technique")}
            disabled={loading || workouts.length === 0}
            className={`p-8 border transition-all text-left ${
              loading && selectedAnalysisType === "technique"
                ? "border-white bg-white text-black"
                : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-light tracking-tight text-white mb-2">
              TECHNIQUE TIPS
            </h3>
            <p className="text-sm text-zinc-400 font-light">
              Form cues and exercise advice
            </p>
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-zinc-900 border border-zinc-800 p-12 text-center">
            <div className="inline-block animate-spin text-4xl mb-4">⚙️</div>
            <p className="text-white font-light tracking-widest">ANALYZING YOUR TRAINING...</p>
          </div>
        )}

        {/* Analysis Results */}
        {analysis && !loading && (
          <div className="bg-zinc-900 border border-zinc-800 p-8">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-3xl font-light tracking-tight text-white uppercase">
                {selectedAnalysisType === "general" && "Training Analysis"}
                {selectedAnalysisType === "progression" && "Progression Plan"}
                {selectedAnalysisType === "recovery" && "Recovery Assessment"}
                {selectedAnalysisType === "technique" && "Technique Guide"}
              </h2>
              <button
                onClick={() => setAnalysis(null)}
                className="px-4 py-2 border border-zinc-700 text-white hover:bg-zinc-800 transition-all text-xs uppercase tracking-widest"
              >
                Clear
              </button>
            </div>
            
            <div className="prose prose-invert max-w-none">
              <div className="text-zinc-300 font-light tracking-wide leading-relaxed whitespace-pre-wrap">
                {analysis}
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-zinc-800">
              <p className="text-xs text-zinc-500 uppercase tracking-widest mb-4">
                TAKE ACTION
              </p>
              <div className="flex gap-4">
                <Link
                  to="/log-workout"
                  className="px-8 py-4 bg-white text-black font-medium tracking-widest uppercase text-sm hover:bg-zinc-200 transition-all"
                >
                  Log Workout
                </Link>
                <Link
                  to="/goals"
                  className="px-8 py-4 border border-zinc-700 text-white hover:bg-zinc-800 font-medium tracking-widest uppercase text-sm transition-all"
                >
                  Update Goals
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {workouts.length === 0 && !loading && (
          <div className="bg-zinc-900 border border-zinc-800 p-12 text-center">
            <p className="text-zinc-500 font-light tracking-wide mb-8">
              Log at least one workout to get AI-powered coaching insights
            </p>
            <Link
              to="/log-workout"
              className="inline-block px-8 py-4 bg-white text-black font-medium tracking-widest uppercase text-sm hover:bg-zinc-200 transition-all"
            >
              Log Your First Workout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default AICoach;