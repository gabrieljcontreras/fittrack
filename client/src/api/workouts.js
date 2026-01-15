const API_URL = "https://fittrack-g7fsbjhye3enayag.eastus-01.azurewebsites.net/workouts";

function getAuthHeaders(token) {
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
}

export async function createWorkout(workoutData, token) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(workoutData)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}

export async function getWorkouts(token) {
  const res = await fetch(API_URL, {
    headers: getAuthHeaders(token)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}

export async function getLastWorkout(exerciseName, token) {
  const res = await fetch(`${API_URL}/last/${encodeURIComponent(exerciseName)}`, {
    headers: getAuthHeaders(token)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}

export async function updateWorkout(workoutId, updates, token) {
  const res = await fetch(`${API_URL}/${workoutId}`, {
    method: "PUT",
    headers: getAuthHeaders(token),
    body: JSON.stringify(updates)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}

export async function deleteWorkout(workoutId, token) {
  const res = await fetch(`${API_URL}/${workoutId}`, {
    method: "DELETE",
    headers: getAuthHeaders(token)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}