const API_URL = "https://fittrack-g7fsbjhye3enayag.eastus-01.azurewebsites.net/goals";

function getAuthHeaders(token) {
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
}

export async function createGoal(goalData, token) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(goalData)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}

export async function getGoals(token) {
  const res = await fetch(API_URL, {
    headers: getAuthHeaders(token)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}

export async function updateGoal(goalId, updates, token) {
  const res = await fetch(`${API_URL}/${goalId}`, {
    method: "PUT",
    headers: getAuthHeaders(token),
    body: JSON.stringify(updates)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}

export async function deleteGoal(goalId, token) {
  const res = await fetch(`${API_URL}/${goalId}`, {
    method: "DELETE",
    headers: getAuthHeaders(token)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}