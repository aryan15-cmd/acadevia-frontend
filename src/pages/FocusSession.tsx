import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { completeFocus, getBlockAttempts } from "../services/api"
import Navbar from "../components/Navbar"
import Lottie from "lottie-react"
import studyAnimation from "../assets/study.json"

// 🔥 ADDED: complete sound import
import completeSoundFile from "../assets/sounds/complete.mp3"
import { Preferences } from "@capacitor/preferences"
import AppBlocker from "../plugins/appBlocker"


const applyBlocking = async () => {
  try {
    const { value } = await Preferences.get({ key: "blocked_apps" })

    if (value) {
      const parsed = JSON.parse(value); 
      console.log("Blocked apps sent to native:", parsed);
      await AppBlocker.setBlockedApps({
        apps: parsed
      })
    }
  } catch (e) {
    console.log("Blocking failed", e)
  }
}
export default function FocusScreen() {

  const totalTime = 1500

  const [timeLeft, setTimeLeft] = useState(totalTime)
  const [isPaused, setIsPaused] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)
  const [hasSession, setHasSession] = useState(false)

  const [interruptions, setInterruptions] = useState(0)
  const [blockedApps, setBlockedApps] = useState<string[]>([])
  const [blockedAttempts, setBlockedAttempts] = useState(0)

  const [motivation, setMotivation] = useState("")
  const [showMessage, setShowMessage] = useState(false)

  const lottieRef = useRef<any>(null)

  // 🔥 ADDED: complete sound ref
  const completeSound = useRef<HTMLAudioElement | null>(null)

  const messages = [
    "You're in the zone 🔥",
    "Stay locked in, no distractions 💪",
    "Small focus = big results 📈",
    "Discipline is your superpower ⚡",
    "You're doing better than yesterday 👏",
    "Keep pushing, almost there 🚀",
  ]

  const navigate = useNavigate()

  // 🔥 ADDED: initialize sound
  useEffect(() => {
    completeSound.current = new Audio(completeSoundFile)

    if (completeSound.current) {
      completeSound.current.volume = 0.5
    }
  }, [])

  useEffect(() => {
  const init = async () => {
    const storedSession = localStorage.getItem("session_id")

    setHasSession(!!storedSession)

    // 🔥 Load apps properly
    const { value } = await Preferences.get({ key: "blocked_apps" })
    const apps = value ? JSON.parse(value) : []

    setBlockedApps(apps)

    if (storedSession) {
      applyBlocking()
    }
  }

  init()
}, [])

  const intervalRef = useRef<number | null>(null)

  useEffect(() => {

    const fetchAttempts = async () => {
      try {
        const data = await getBlockAttempts()
        setBlockedAttempts(data.attempts || 0)
      } catch {
        console.log("Block attempts unavailable")
      }
    }

    fetchAttempts()

    if (intervalRef.current === null) {
      intervalRef.current = window.setInterval(fetchAttempts, 300000)
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

  }, [])

  useEffect(() => {

    const today = new Date().toDateString()
    const lastDate = localStorage.getItem("lastFocusDate")

    if (lastDate !== today) {
      localStorage.setItem("dailyFocusMinutes", "0")
      localStorage.setItem("lastFocusDate", today)
    }

  }, [])

  // ⏱ TIMER
  useEffect(() => {

    if (isPaused || !hasSession) return

    const interval = setInterval(() => {

      setTimeLeft(prev => {

        if (prev <= 1) {
          clearInterval(interval)
          handleComplete()
          return 0
        }

        return prev - 1

      })

    }, 1000)

    return () => clearInterval(interval)

  }, [isPaused, hasSession])

  // 🔥 CONTROL LOTTIE
  useEffect(() => {
    if (!lottieRef.current) return

    if (isPaused) {
      lottieRef.current.pause()
    } else {
      lottieRef.current.play()
    }
  }, [isPaused])

  // 🔥 MOTIVATION POPUP
  useEffect(() => {
    if (!hasSession || isPaused) return

    const interval = setInterval(() => {

      const randomMsg =
        messages[Math.floor(Math.random() * messages.length)]

      setMotivation(randomMsg)
      setShowMessage(true)

      setTimeout(() => {
        setShowMessage(false)
      }, 3500)

    }, 120000)

    return () => clearInterval(interval)

  }, [hasSession, isPaused])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const progress = ((totalTime - timeLeft) / totalTime) * 100

  const handlePause = () => {

    if (!hasSession) return

    if (!isPaused) {
      setInterruptions(prev => prev + 1)
    }

    setIsPaused(prev => !prev)
  }

  const handleComplete = async () => {

    const sessionId = localStorage.getItem("session_id")

    if (!sessionId || isCompleting) return

    try {

      setIsCompleting(true)

      await completeFocus(Number(sessionId))

      await AppBlocker.setBlockedApps({
         apps: []
       })

      // 🔥 ADDED: play complete sound
      if (completeSound.current) {
        completeSound.current.currentTime = 0
        completeSound.current.play().catch(() => {})
      }

      localStorage.removeItem("session_id")

      // 🔥 ADDED: delay so sound plays
      setTimeout(() => {
        navigate("/dashboard")
      }, 400)

    } catch (error) {

      console.error("Failed to complete session", error)
      setIsCompleting(false)

    }

  }

  return (

  <div className="min-h-screen bg-[#f4f6f8] flex flex-col items-center pt-6 sm:pt-10 px-4 sm:px-6 pb-32 max-w-md mx-auto w-full">

    <div className="bg-white px-5 sm:px-6 py-2 rounded-full shadow text-green-600 font-medium mb-6 text-sm sm:text-base">
      🛡 Focus Shield Active
    </div>

    <h2 className="text-lg sm:text-xl text-gray-600 mb-6 text-center">
      Deep Flow Exploration
    </h2>

    {/* TIMER */}
    <div className={`relative w-64 h-64 sm:w-72 sm:h-72 mb-10 transition ${isPaused ? "opacity-50" : ""}`}>

      <svg className="w-full h-full rotate-[-90deg]">

        <circle
          cx="50%"
          cy="50%"
          r="42%"
          stroke="#E5E7EB"
          strokeWidth="12"
          fill="none"
        />

        <circle
          cx="50%"
          cy="50%"
          r="42%"
          stroke="#4CAF50"
          strokeWidth="12"
          fill="none"
          strokeDasharray={2 * Math.PI * 120}
          strokeDashoffset={
            2 * Math.PI * 120 * (1 - progress / 100)
          }
          strokeLinecap="round"
        />

      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">

        <div className="w-24 h-24 sm:w-28 sm:h-28 mb-2 flex items-center justify-center">
          {studyAnimation ? (
            <Lottie
              lottieRef={lottieRef}
              animationData={studyAnimation}
              loop={true}
              autoplay={true}
              style={{ height: 100, width: 100 }}
            />
          ) : (
            <div className="text-5xl sm:text-6xl">📚</div>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
          {String(minutes).padStart(2, "0")}:
          {String(seconds).padStart(2, "0")}
        </h1>

        <p className="text-gray-400 text-xs sm:text-sm">
          REMAINING
        </p>

        {isPaused && (
          <p className="text-xs sm:text-sm text-red-500 mt-2 font-medium">
            Paused
          </p>
        )}

      </div>

    </div>

    {/* BLOCKED APPS */}
    <div className="bg-white w-full rounded-2xl p-4 sm:p-5 shadow mb-6">
      <div className="flex justify-between items-center mb-3">
        <p className="text-gray-400 text-xs sm:text-sm">BLOCKED APPS</p>
        <button
          onClick={() => navigate("/blocked-apps")}
          className="text-green-600 text-xs sm:text-sm font-medium"
        >
          Manage
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {blockedApps.length === 0 ? (
          <p className="text-gray-400 text-xs sm:text-sm">No apps blocked</p>
        ) : (
          blockedApps.map((app, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-[10px] sm:text-xs font-medium"
            >
              {app}
            </span>
          ))
        )}
      </div>
    </div>

    {/* STATS */}
    <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 w-full">
      <div className="bg-white rounded-xl p-3 sm:p-4 shadow text-center">
        <p className="text-xl sm:text-2xl font-semibold text-gray-700">
          {blockedAttempts}
        </p>
        <p className="text-gray-400 text-[10px] sm:text-xs mt-1">
          BLOCKED ATTEMPTS
        </p>
      </div>

      <div className="bg-white rounded-xl p-3 sm:p-4 shadow text-center">
        <p className="text-xl sm:text-2xl font-semibold text-gray-700">
          {interruptions}
        </p>
        <p className="text-gray-400 text-[10px] sm:text-xs mt-1">
          INTERRUPTIONS
        </p>
      </div>
    </div>

    {/* BUTTONS */}
    <div className="flex gap-3 sm:gap-4 w-full">
      <button
        onClick={handlePause}
        className="flex-1 bg-gray-200 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-base"
      >
        {isPaused ? "RESUME" : "PAUSE"}
      </button>

      <button
        onClick={handleComplete}
        disabled={isCompleting}
        className="flex-1 bg-green-500 text-white py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-base"
      >
        COMPLETE
      </button>
    </div>

    {/* MOTIVATION */}
    {showMessage && (
      <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-50 px-4">
        <div className="bg-white/90 backdrop-blur-md border border-gray-200 px-4 sm:px-5 py-2 sm:py-3 rounded-full shadow-xl flex items-center gap-2">
          <span className="text-green-500 text-lg">⚡</span>
          <p className="text-xs sm:text-sm font-medium text-gray-700 text-center">
            {motivation}
          </p>
        </div>
      </div>
    )}

    <Navbar />

  </div>
)
}