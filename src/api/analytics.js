const API_URL = "http://localhost:5000/api/analytics";

function getAuthHeaders(token) {
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
}

export async function getWorkoutStats(timeframe, token) {
  const res = await fetch(`${API_URL}/stats?timeframe=${timeframe}`, {
    headers: getAuthHeaders(token)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}

export async function getExerciseProgress(exerciseName, token) {
  const res = await fetch(`${API_URL}/exercise/${encodeURIComponent(exerciseName)}`, {
    headers: getAuthHeaders(token)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}