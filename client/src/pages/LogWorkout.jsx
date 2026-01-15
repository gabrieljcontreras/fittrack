import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { createWorkout, getLastWorkout } from "../api/workouts";

function LogWorkout() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [workoutName, setWorkoutName] = useState("");
  const [exercises, setExercises] = useState([
    { exerciseName: "", sets: [{ setNumber: 1, reps: 0, weight: 0, completed: false }], notes: "" }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [lastWorkoutData, setLastWorkoutData] = useState({});
  const [processingVoice, setProcessingVoice] = useState(false);

  // Enhanced AI voice parsing using Claude API
  const parseVoiceWithAI = async (transcript, exerciseIndex, setIndex) => {
    setProcessingVoice(true);
    
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `You are a fitness workout logger parser. Extract exercise information from this voice input: "${transcript}"

Return ONLY a JSON object with this exact structure (no other text):
{
  "exerciseName": "exercise name if mentioned, otherwise null",
  "reps": number or null,
  "weight": number or null
}

Examples:
"bench press 10 reps 135 pounds" -> {"exerciseName": "bench press", "reps": 10, "weight": 135}
"squats 225" -> {"exerciseName": "squats", "reps": null, "weight": 225}
"12 reps" -> {"exerciseName": null, "reps": 12, "weight": null}
"deadlift 8 reps at 315" -> {"exerciseName": "deadlift", "reps": 8, "weight": 315}
"lat pulldown 12 reps 140 pounds" -> {"exerciseName": "lat pulldown", "reps": 12, "weight": 140}

Return only valid JSON, nothing else.`
            }
          ]
        })
      });

      const data = await response.json();
      const aiResponse = data.content[0].text.trim();
      
      // Clean the response to extract JSON
      let jsonStr = aiResponse;
      if (jsonStr.includes('```json')) {
        jsonStr = jsonStr.split('```json')[1].split('```')[0].trim();
      } else if (jsonStr.includes('```')) {
        jsonStr = jsonStr.split('```')[1].trim();
      }
      
      const parsed = JSON.parse(jsonStr);
      
      const newExercises = [...exercises];

      if (parsed.exerciseName && exerciseIndex !== null) {
        newExercises[exerciseIndex].exerciseName = parsed.exerciseName;
      }

      if (setIndex !== null) {
        if (parsed.reps) {
          newExercises[exerciseIndex].sets[setIndex].reps = parsed.reps;
        }
        if (parsed.weight) {
          newExercises[exerciseIndex].sets[setIndex].weight = parsed.weight;
        }
      }

      setExercises(newExercises);
      
      // Fetch last workout if exercise name was provided
      if (parsed.exerciseName && exerciseIndex !== null) {
        await fetchLastWorkout(parsed.exerciseName, exerciseIndex);
      }
      
    } catch (err) {
      console.error("Error parsing with AI:", err);
      // Fallback to basic parsing
      parseVoiceInputBasic(transcript, exerciseIndex, setIndex);
    } finally {
      setProcessingVoice(false);
    }
  };

  // Basic fallback parsing (original method)
  const parseVoiceInputBasic = (transcript, exerciseIndex, setIndex) => {
    const repsMatch = transcript.match(/(\d+)\s*reps?/i);
    const weightMatch = transcript.match(/(\d+)\s*(pounds?|lbs?|kg|kilograms?)?/i);
    
    // Try to extract exercise name (everything before numbers)
    const exerciseMatch = transcript.match(/^([a-z\s]+?)\s+\d/i);

    const newExercises = [...exercises];

    if (exerciseMatch && exerciseIndex !== null) {
      newExercises[exerciseIndex].exerciseName = exerciseMatch[1].trim();
    }

    if (setIndex !== null) {
      if (repsMatch) {
        newExercises[exerciseIndex].sets[setIndex].reps = parseInt(repsMatch[1]);
      }
      if (weightMatch) {
        newExercises[exerciseIndex].sets[setIndex].weight = parseInt(weightMatch[1]);
      }
    }

    setExercises(newExercises);
  };

  // Voice recognition setup
  const startVoiceInput = (exerciseIndex, setIndex) => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice recognition not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      console.log("Heard:", transcript);
      parseVoiceWithAI(transcript, exerciseIndex, setIndex);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      console.error('Speech recognition error:', event.error);
      if (event.error === 'no-speech') {
        alert('No speech detected. Please try again.');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // Fetch last workout data when exercise name is entered
  const fetchLastWorkout = async (exerciseName, exerciseIndex) => {
    if (!exerciseName || !token) return;

    try {
      const data = await getLastWorkout(exerciseName, token);
      if (data.exercise) {
        setLastWorkoutData(prev => ({
          ...prev,
          [exerciseIndex]: data
        }));
      }
    } catch (err) {
      console.error("Error fetching last workout:", err);
    }
  };

  const addExercise = () => {
    setExercises([
      ...exercises,
      { exerciseName: "", sets: [{ setNumber: 1, reps: 0, weight: 0, completed: false }], notes: "" }
    ]);
  };

  const removeExercise = (exerciseIndex) => {
    if (exercises.length === 1) return;
    const newExercises = exercises.filter((_, i) => i !== exerciseIndex);
    setExercises(newExercises);
  };

  const addSet = (exerciseIndex) => {
    const newExercises = [...exercises];
    const setNumber = newExercises[exerciseIndex].sets.length + 1;
    
    // Smart auto-fill: copy the last set's values
    const lastSet = newExercises[exerciseIndex].sets[newExercises[exerciseIndex].sets.length - 1];
    
    newExercises[exerciseIndex].sets.push({
      setNumber,
      reps: lastSet.reps,
      weight: lastSet.weight,
      completed: false
    });
    setExercises(newExercises);
  };

  const removeSet = (exerciseIndex, setIndex) => {
    const newExercises = [...exercises];
    if (newExercises[exerciseIndex].sets.length === 1) return;
    
    newExercises[exerciseIndex].sets = newExercises[exerciseIndex].sets.filter((_, i) => i !== setIndex);
    // Renumber sets
    newExercises[exerciseIndex].sets.forEach((set, i) => {
      set.setNumber = i + 1;
    });
    setExercises(newExercises);
  };

  const updateExercise = (exerciseIndex, field, value) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex][field] = value;
    setExercises(newExercises);

    if (field === 'exerciseName' && value.length > 2) {
      fetchLastWorkout(value, exerciseIndex);
    }
  };

  const updateSet = (exerciseIndex, setIndex, field, value) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].sets[setIndex][field] = value;
    setExercises(newExercises);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createWorkout({ workoutName, exercises }, token);
      navigate('/workout-history');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black py-20">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="mb-16">
          <p className="text-zinc-500 text-xs font-medium tracking-widest uppercase mb-4">LOG WORKOUT</p>
          <h1 className="text-6xl font-light tracking-tight text-white mb-6">New Session</h1>
          <p className="text-zinc-400 font-light tracking-wide">
            Use voice input or type manually. Say something like "bench press 10 reps 135 pounds"
          </p>
        </div>

        {/*Back to Dashboard*/}
        <Link 
          to="/dashboard"
          className = "inline-flex items-center gap-2 text-zinc-400 hover:text-white font-light tracking-wide uppercase text-sm transition-colors mb-8"
        >
          ← Back to Dashboard
        </Link>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Workout Name */}
          <div className="bg-zinc-900 border border-zinc-800 p-8">
            <label className="block text-xs font-medium tracking-widest uppercase text-zinc-400 mb-4">
              Workout Name
            </label>
            <input
              type="text"
              placeholder="e.g., Push Day, Leg Day, Upper Body"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              className="w-full px-5 py-4 bg-black border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors font-light tracking-wide"
              required
            />
          </div>

          {/* Exercises */}
          {exercises.map((exercise, exerciseIndex) => (
            <div key={exerciseIndex} className="bg-zinc-900 border border-zinc-800 p-8">
              <div className="flex justify-between items-start mb-6">
                <p className="text-xs font-medium tracking-widest uppercase text-zinc-400">
                  EXERCISE {exerciseIndex + 1}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => startVoiceInput(exerciseIndex, null)}
                    disabled={isListening || processingVoice}
                    className={`px-4 py-2 border border-zinc-700 text-xs uppercase tracking-widest transition-all ${
                      isListening || processingVoice
                        ? 'bg-white text-black' 
                        : 'bg-transparent text-white hover:bg-zinc-800'
                    }`}
                  >
                    {processingVoice ? '⏳ Processing...' : isListening ? '🎤 Listening...' : '🎤 Voice'}
                  </button>
                  {exercises.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExercise(exerciseIndex)}
                      className="px-4 py-2 border border-red-900 text-red-400 text-xs uppercase tracking-widest hover:bg-red-950 transition-all"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              <input
                type="text"
                placeholder="Exercise name (e.g., Bench Press, Squats, Deadlift)"
                value={exercise.exerciseName}
                onChange={(e) => updateExercise(exerciseIndex, 'exerciseName', e.target.value)}
                className="w-full px-5 py-4 bg-black border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors font-light tracking-wide mb-6"
                required
              />

              {/* Show last workout data */}
              {lastWorkoutData[exerciseIndex] && (
                <div className="mb-6 p-4 bg-black border border-zinc-700">
                  <p className="text-xs font-medium tracking-widest uppercase text-zinc-500 mb-3">
                    LAST TIME: {new Date(lastWorkoutData[exerciseIndex].date).toLocaleDateString()}
                  </p>
                  <div className="space-y-1">
                    {lastWorkoutData[exerciseIndex].exercise.sets.map((set, i) => (
                      <p key={i} className="text-sm text-zinc-400 font-light">
                        Set {i + 1}: <span className="text-white">{set.reps} reps</span> @ <span className="text-white">{set.weight} lbs</span>
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Sets */}
              <div className="space-y-4">
                {exercise.sets.map((set, setIndex) => (
                  <div key={setIndex} className="flex gap-4 items-center">
                    <div className="w-16 text-white font-light text-center">
                      Set {set.setNumber}
                    </div>
                    
                    <div className="flex-1">
                      <label className="block text-xs text-zinc-500 mb-1">REPS</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={set.reps || ''}
                        onChange={(e) => updateSet(exerciseIndex, setIndex, 'reps', parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-3 bg-black border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors font-light text-center"
                      />
                    </div>

                    <div className="flex-1">
                      <label className="block text-xs text-zinc-500 mb-1">WEIGHT (LBS)</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={set.weight || ''}
                        onChange={(e) => updateSet(exerciseIndex, setIndex, 'weight', parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-3 bg-black border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors font-light text-center"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => startVoiceInput(exerciseIndex, setIndex)}
                      disabled={isListening || processingVoice}
                      className="px-4 py-3 border border-zinc-700 bg-transparent text-white hover:bg-zinc-800 transition-all disabled:opacity-50"
                      title="Use voice to fill this set"
                    >
                      🎤
                    </button>

                    <button
                      type="button"
                      onClick={() => updateSet(exerciseIndex, setIndex, 'completed', !set.completed)}
                      className={`px-4 py-3 border transition-all ${
                        set.completed 
                          ? 'border-white bg-white text-black' 
                          : 'border-zinc-700 bg-transparent text-white hover:bg-zinc-800'
                      }`}
                      title="Mark as completed"
                    >
                      ✓
                    </button>

                    {exercise.sets.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSet(exerciseIndex, setIndex)}
                        className="px-3 py-3 border border-red-900 text-red-400 hover:bg-red-950 transition-all"
                        title="Remove set"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => addSet(exerciseIndex)}
                className="mt-4 w-full py-3 border border-zinc-700 text-white hover:bg-zinc-800 transition-all text-xs uppercase tracking-widest"
              >
                + Add Set
              </button>

              {/* Exercise Notes */}
              <div className="mt-4">
                <textarea
                  placeholder="Notes (optional)"
                  value={exercise.notes}
                  onChange={(e) => updateExercise(exerciseIndex, 'notes', e.target.value)}
                  className="w-full px-5 py-4 bg-black border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors font-light tracking-wide resize-none"
                  rows="2"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addExercise}
            className="w-full py-4 border border-zinc-700 text-white hover:bg-zinc-800 transition-all text-xs uppercase tracking-widest"
          >
            + Add Exercise
          </button>

          {error && (
            <div className="p-4 bg-red-950 border border-red-900">
              <p className="text-sm text-red-200 font-light">{error}</p>
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-5 bg-white text-black font-medium tracking-widest uppercase text-sm hover:bg-zinc-200 disabled:opacity-50 transition-all"
            >
              {loading ? 'Saving...' : 'Save Workout'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-8 py-5 border border-zinc-700 text-white hover:bg-zinc-800 transition-all font-medium tracking-widest uppercase text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LogWorkout;