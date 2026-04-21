import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import {
  getWeeklyReport,
  
  
} from "../services/api"

export default function Insights() {

  const [stressScore, setStressScore] = useState(0)
  const [weeklyData, setWeeklyData] = useState<number[]>([0,0,0,0,0,0,0])
  const [totalHours, setTotalHours] = useState(0)
  const [estimationAccuracy, setEstimationAccuracy] = useState(0)
  const [completionRate, setCompletionRate] = useState(0)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
  try {

    const weekly = await getWeeklyReport()

    // stress score
    setStressScore(weekly.stress_score || 0)

    // weekly focus hours
    setTotalHours(weekly.weekly_focus_hours || 0)

    // productivity stats
    setEstimationAccuracy(weekly.estimation_accuracy || 0)
    setCompletionRate(weekly.completion_rate || 0)

    // weekly chart data
    setWeeklyData(
      weekly.daily_focus_hours || [0,0,0,0,0,0,0]
    )

  } catch (error) {
    console.error("Error loading analytics:", error)
  }
}

  const progress = stressScore

  return (
    <div className="min-h-screen bg-[#f4f6f8] px-6 pt-10 pb-28">

      <h1 className="text-2xl font-bold mb-2">Insights</h1>
      <p className="text-sm text-gray-500 mb-6">
        Weekly Analytics Overview
      </p>

      {/* Stress Circle */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative w-52 h-52">
          <svg className="w-full h-full rotate-[-90deg]">

            <circle
              cx="104"
              cy="104"
              r="85"
              stroke="#E5E7EB"
              strokeWidth="14"
              fill="none"
            />

            <circle
              cx="104"
              cy="104"
              r="85"
              stroke="#4CAF50"
              strokeWidth="14"
              fill="none"
              strokeDasharray={2 * Math.PI * 85}
              strokeDashoffset={
                2 * Math.PI * 85 * (1 - progress / 100)
              }
              strokeLinecap="round"
            />

          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold">{stressScore.toFixed(1)}</h1>
            <p className="text-green-600 text-sm font-semibold">
              STRESS SCORE
            </p>
          </div>

        </div>
      </div>

      {/* Productivity Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">

        <div className="bg-white rounded-2xl p-6 shadow">
          <p className="text-3xl font-bold">
            {estimationAccuracy}%
          </p>
          <p className="text-xs text-gray-500 mt-2">
            ESTIMATION ACCURACY
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow">
          <p className="text-3xl font-bold">
            {completionRate}%
          </p>
          <p className="text-xs text-gray-500 mt-2">
            COMPLETION RATE
          </p>
        </div>

      </div>

      {/* Weekly Focus */}
      <div className="bg-white rounded-2xl p-6 shadow mb-6">

        <div className="flex justify-between mb-4">

          <div>
            <h3 className="font-semibold">
              Weekly Focus
            </h3>

            <p className="text-xs text-gray-500">
              Deep Work (Hours/Day)
            </p>
          </div>

          <p className="text-green-600 font-semibold">
            {totalHours}h
          </p>

        </div>

        <div className="flex items-end justify-between h-32">

          {weeklyData.map((value, i) => (

            <div key={i} className="flex flex-col items-center">

              <div
                className="bg-green-500 w-4 rounded-md"
                style={{ height: `${Math.max(value * 20, 4)}px` }}
              />

              <span className="text-xs text-gray-400 mt-2">
                {["M","T","W","T","F","S","S"][i]}
              </span>

            </div>

          ))}

        </div>

      </div>

      <Navbar />

    </div>
  )
}