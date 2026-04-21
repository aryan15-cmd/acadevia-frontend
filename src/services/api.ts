// ==============================
// API CONFIG
// ==============================

const BASE_URL = "https://acadevia-backend.onrender.com"

// ==============================
// AUTH HEADERS
// ==============================

function getAuthHeaders(includeJson: boolean = false) {

  let token = localStorage.getItem("token")

  // remove accidental quotes/spaces
  if (token) {
    token = token.replace(/"/g, "").trim()
  }

  const headers: any = {}

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  if (includeJson) {
    headers["Content-Type"] = "application/json"
  }

  return headers
}

// ==============================
// TASKS
// ==============================

// 🔹 GET TASKS
export async function getTasks() {

  const res = await fetch(`${BASE_URL}/tasks/`, {
    headers: getAuthHeaders(),
  })

  if (!res.ok) {
    console.error("Tasks fetch failed:", res.status)
    throw new Error("Failed to fetch tasks")
  }

  return res.json()
}

// 🔹 CREATE TASK
export async function createTask(taskData: any) {

  const res = await fetch(`${BASE_URL}/tasks/`, {
    method: "POST",
    headers: getAuthHeaders(true),
    body: JSON.stringify(taskData),
  })

  const data = await res.json()

  if (!res.ok) {
    console.log("Backend error:", data)
    throw new Error(data.detail || "Failed to create task")
  }

  return data
}

// 🔹 DELETE TASK
export async function deleteTask(taskId: number) {

  const res = await fetch(`${BASE_URL}/tasks/${taskId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  })

  if (!res.ok) {
    throw new Error("Failed to delete task")
  }

  return res.json()
}

// ==============================
// FOCUS SESSION
// ==============================

// 🔹 START FOCUS
export async function startFocus(taskId: number) {

  const blockedApps = JSON.parse(
    localStorage.getItem("blocked_apps") || "[]"
  )

  const res = await fetch(`${BASE_URL}/focus/start/${taskId}`, {
    method: "POST",
    headers: getAuthHeaders(true),
    body: JSON.stringify({
      blocked_apps: blockedApps
    })
  })

  const data = await res.json()

  if (!res.ok) {
    console.log("Focus start error:", data)
    throw new Error(data.detail || "Failed to start focus session")
  }

  return data
}

// 🔹 COMPLETE FOCUS
export async function completeFocus(sessionId: number) {

  const res = await fetch(`${BASE_URL}/focus/complete/${sessionId}`, {
    method: "POST",
    headers: getAuthHeaders()
  })

  const data = await res.json()

  if (!res.ok) {
    console.error("Focus complete error:", data)
    throw new Error(data.detail || "Failed to complete focus session")
  }

  return data
}

// ==============================
// ANALYTICS
// ==============================

// 🔹 WEEKLY REPORT
export async function getWeeklyReport() {

  const res = await fetch(`${BASE_URL}/api/v1/analytics/weekly-report`, {
    headers: getAuthHeaders(),
  })

  if (!res.ok) {
    throw new Error("Failed to fetch weekly report")
  }

  return res.json()
}

// 🔹 STRESS TREND
export async function getStressTrend() {

  const res = await fetch(`${BASE_URL}/api/v1/analytics/stress-trend`, {
    headers: getAuthHeaders(),
  })

  if (!res.ok) {
    throw new Error("Failed to fetch stress trend")
  }

  return res.json()
}

// 🔹 PRODUCTIVITY SCORE
export async function getProductivityScore() {

  const res = await fetch(`${BASE_URL}/api/v1/analytics/productivity-score`, {
    headers: getAuthHeaders(),
  })

  if (!res.ok) {
    throw new Error("Failed to fetch productivity score")
  }

  return res.json()
}

// 🔹 FOCUS HEATMAP
export async function getFocusHeatmap() {

  const res = await fetch(`${BASE_URL}/api/v1/analytics/focus-heatmap`, {
    headers: getAuthHeaders(),
  })

  if (!res.ok) {
    throw new Error("Failed to fetch focus heatmap")
  }

  return res.json()
}

// ==============================
// PROFILE
// ==============================

export async function getProfileStats() {

  const res = await fetch(`${BASE_URL}/api/v1/analytics/weekly-report`, {
    headers: getAuthHeaders(),
  })

  if (!res.ok) {
    throw new Error("Failed to fetch profile stats")
  }

  return res.json()
}

export async function getCurrentUser() {

  const res = await fetch(`${BASE_URL}/me`, {
    headers: getAuthHeaders(),
  })

  if (!res.ok) {
    throw new Error("Failed to fetch user")
  }

  return res.json()
}

// ==============================
// OTHER
// ==============================

export const getStats = async () => {

  const res = await fetch(`${BASE_URL}/stats`, {
    headers: getAuthHeaders()
  })

  return res.json()
}

export async function getBlockAttempts() {

  const res = await fetch(`${BASE_URL}/block-attempts`)

  return res.json()
}