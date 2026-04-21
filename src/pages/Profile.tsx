import Navbar from "../components/Navbar"
import { Sun, Bell } from "lucide-react"
import { useEffect, useState } from "react"
import {
  getWeeklyReport,
  getProductivityScore,
  getCurrentUser
} from "../services/api"

interface StatCardProps {
  title: string
  value: string | number
  sub: string
}

interface PreferenceProps {
  icon: React.ReactNode
  title: string
  value?: string
  toggle?: boolean
  enabled?: boolean
  onToggle?: () => void
  onClick?: () => void
}

export default function Profile() {

  const userEmail = localStorage.getItem("userEmail")

  const [name, setName] = useState<string>("User")

  const [totalHours, setTotalHours] = useState<number>(0)
  const [reliability, setReliability] = useState<number>(0)
  const [stress, setStress] = useState<string>("Low")

  const [dailyTarget, setDailyTarget] = useState<number>(
    Number(localStorage.getItem(`dailyTarget_${userEmail}`)) || 2
  )

  const [alertsEnabled, setAlertsEnabled] = useState<boolean>(true)
  const [dailyMinutes, setDailyMinutes] = useState<number>(0)

  useEffect(() => {
    loadProfile()
    loadDailyMinutes()
  }, [])

  useEffect(() => {
    localStorage.setItem(
      `dailyTarget_${userEmail}`,
      String(dailyTarget)
    )
  }, [dailyTarget])

  const loadDailyMinutes = () => {

    const today = new Date().toDateString()
    const lastDate = localStorage.getItem(`lastFocusDate_${userEmail}`)

    if (lastDate !== today) {

      localStorage.setItem(`dailyFocusMinutes_${userEmail}`, "0")
      localStorage.setItem(`lastFocusDate_${userEmail}`, today)
      setDailyMinutes(0)

    } else {

      const minutes =
        Number(localStorage.getItem(`dailyFocusMinutes_${userEmail}`)) || 0

      setDailyMinutes(minutes)

    }

  }

  const loadProfile = async () => {

    try {

      const user = await getCurrentUser()
      setName(user.name || "User")

      const weekly = await getWeeklyReport()
      const productivity = await getProductivityScore()

      setTotalHours(weekly.weekly_focus_hours || 0)
      setReliability(productivity.productivity_score || 0)

      const stressScore = weekly.stress_score || 0

      if (stressScore < 40) setStress("Low")
      else if (stressScore < 70) setStress("Moderate")
      else setStress("High")

    } catch (error) {
      console.error("Profile load error:", error)
    }

  }

  const dailyHours = (dailyMinutes / 60).toFixed(1)

  const progress = Math.min(
    (Number(dailyHours) / dailyTarget) * 100,
    100
  )

  return (

    <div className="min-h-screen bg-[#f4f6f8] px-6 pt-10 pb-28 overflow-x-hidden">

      {/* HEADER */}
      <div className="flex items-center gap-4 mb-6">

        <div className="w-20 h-20 rounded-full bg-green-200 flex items-center justify-center text-2xl font-bold text-green-700">
          {name.charAt(0).toUpperCase()}
        </div>

        <div>
          <h1 className="text-2xl font-bold">
            {name}
          </h1>

          <p className="text-green-600 font-medium">
            ✨ Zen Master Status
          </p>
        </div>

      </div>

      {/* STATS */}
      <div className="mb-8 space-y-4">

        {/* Top Row */}
        <div className="grid grid-cols-2 gap-4">

          <StatCard
            title="FOCUS"
            value={totalHours}
            sub="Total Hours"
          />

          <StatCard
            title="TRUST"
            value={`${reliability}%`}
            sub="Reliability"
          />

        </div>

        {/* Bottom Row */}
        <StatCard
          title="STRESS"
          value={stress}
          sub="Predicted"
        />

      </div>

      {/* DAILY GOAL */}
      <div className="mb-8">

        <div className="flex justify-between mb-2">

          <h2 className="text-xl font-semibold">
            Daily Goal
          </h2>

          <p className="text-green-700 font-semibold">
            {dailyHours} / {dailyTarget}h
          </p>

        </div>

        <div className="w-full bg-gray-200 h-4 rounded-full">

          <div
            className="bg-green-500 h-4 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />

        </div>

        <p className="text-gray-500 mt-3 italic">
          {progress >= 100
            ? "🔥 Daily Goal Achieved!"
            : "Keep going to hit your daily target."}
        </p>

      </div>

      {/* PREFERENCES */}
      <div>

        <h2 className="text-xl font-semibold mb-4">
          Account Preferences
        </h2>

        <Preference
          icon={<Sun />}
          title="Daily Focus Target"
          value={`${dailyTarget}h`}
          onClick={() => {

            const newTarget = prompt(
              "Enter new daily target (hours):",
              String(dailyTarget)
            )

            if (newTarget && !isNaN(Number(newTarget))) {
              setDailyTarget(Number(newTarget))
            }

          }}
        />

        <Preference
          icon={<Bell />}
          title="AI Stress Alerts"
          toggle
          enabled={alertsEnabled}
          onToggle={() => setAlertsEnabled(!alertsEnabled)}
        />

      </div>

      <Navbar />

    </div>

  )

}

function StatCard({ title, value, sub }: StatCardProps) {

  return (

    <div className="bg-white rounded-2xl p-4 text-center shadow w-full">

      <p className="text-gray-400 text-xs tracking-wide">
        {title}
      </p>

      <h2 className="text-2xl font-semibold text-gray-800">
        {value}
      </h2>

      <p className="text-gray-400 text-xs">
        {sub}
      </p>

    </div>

  )

}

function Preference({
  icon,
  title,
  value,
  toggle,
  enabled,
  onToggle,
  onClick
}: PreferenceProps) {

  return (

    <div
      onClick={onClick}
      className="bg-white rounded-2xl p-4 shadow mb-3 flex justify-between items-center cursor-pointer"
    >

      <div className="flex items-center gap-3">

        <div className="bg-gray-100 p-2 rounded-full">
          {icon}
        </div>

        <p className="font-medium">
          {title}
        </p>

      </div>

      {toggle ? (

        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggle?.()
          }}
          className={`w-12 h-6 rounded-full relative transition ${
            enabled ? "bg-green-500" : "bg-gray-300"
          }`}
        >

          <div
            className={`w-5 h-5 bg-white rounded-full absolute top-1 transition ${
              enabled ? "right-1" : "left-1"
            }`}
          />

        </button>

      ) : (

        <p className="text-gray-500">
          {value}
        </p>

      )}

    </div>

  )

}