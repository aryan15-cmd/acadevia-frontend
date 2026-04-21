import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { lazy, Suspense } from "react"

import Login from "./pages/Login"
import Register from "./pages/Register"
import ProtectedRoute from "./components/ProtectedRoute"
import StudyBot from "./components/StudyBot"

// 🔥 Lazy Loaded Pages (improves performance)
const Dashboard = lazy(() => import("./pages/Dashboard"))
const FocusSession = lazy(() => import("./pages/FocusSession"))
const Insights = lazy(() => import("./pages/Insights"))
const Profile = lazy(() => import("./pages/Profile"))
const BlockedApps = lazy(() => import("./pages/BlockedApps"))

function AppContent() {
  const location = useLocation()

  return (
    <>
      <Suspense fallback={<div style={{ textAlign: "center", marginTop: "50%" }}>Loading...</div>}>

        <Routes>

          {/* Default Page → Login */}
          <Route path="/" element={<Login />} />

          {/* Register Page */}
          <Route path="/register" element={<Register />} />

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Focus Session */}
          <Route
            path="/focus"
            element={
              <ProtectedRoute>
                <FocusSession />
              </ProtectedRoute>
            }
          />

          {/* Insights */}
          <Route
            path="/insights"
            element={
              <ProtectedRoute>
                <Insights />
              </ProtectedRoute>
            }
          />

          {/* Profile */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Blocked Apps */}
          <Route
            path="/blocked-apps"
            element={
              <ProtectedRoute>
                <BlockedApps />
              </ProtectedRoute>
            }
          />

        </Routes>

      </Suspense>

      {/* 🔥 Show StudyBot only after login (prevents lag on startup) */}
      {location.pathname !== "/" && location.pathname !== "/register" && <StudyBot />}
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App