import { Flame, Plus, BarChart3 } from "lucide-react"
import { useEffect, useState } from "react"
import TaskCard from "../components/Taskcard"
import AddTaskModal from "../components/AddTaskModal"
import Navbar from "../components/Navbar"
import { getTasks, deleteTask } from "../services/api"

export default function Dashboard() {

  const [tasks, setTasks] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [streak, setStreak] = useState(0)
  const [dailyCompleted, setDailyCompleted] = useState(0)
  const [report, setReport] = useState<any>(null)

  const loadTasks = async () => {
    try {
      const data = await getTasks()
      setTasks(data)
    } catch (error) {
      console.error("Error loading tasks:", error)
    }
  }

  const loadDailyReport = async () => {
    try {
      const res = await fetch("https://acadevia-backend.onrender.com/daily-report", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      })

      if (res.ok) {
        const data = await res.json()
        setReport(data)
      }

    } catch (error) {
      console.error("Error loading daily report:", error)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteTask(id)
      setTasks(prev => prev.filter(task => task.id !== id))
    } catch (error) {
      console.error("Error deleting task:", error)
    }
  }

  const startFocus = () => {
    console.log("Focus mode started 🔥")
    window.location.href = "intent://start#Intent;action=START_TIMER;end"
  }

  useEffect(() => {

    loadTasks()
    loadDailyReport()

    const userEmail = localStorage.getItem("userEmail")

    const storedStreak =
      Number(localStorage.getItem(`streak_${userEmail}`)) || 0

    const storedDaily =
      Number(localStorage.getItem(`dailyCompleted_${userEmail}`)) || 0

    setStreak(storedStreak)
    setDailyCompleted(storedDaily)

    const handleTaskCreated = () => {
    loadTasks()
    loadDailyReport()
  }

  window.addEventListener("taskCreated", handleTaskCreated)

  return () => {
    window.removeEventListener("taskCreated", handleTaskCreated)
  }

  }, [])

  return (

    // ✅ CHANGE 1: responsive container + extra bottom space
    <div className="min-h-screen bg-[#f4f6f8] pb-36 max-w-md mx-auto w-full">

      {/* Top Stats */}
      <div className="px-6 pt-6">

        <div className="flex justify-between items-center mb-6">

          <div className="flex items-center gap-2">
            <div className="bg-green-100 p-2 rounded-full">
              <Flame className="text-green-600" size={18} />
            </div>
            <p className="text-lg font-semibold">{streak} Days</p>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-500">DAILY GOAL</p>
            <p className="font-semibold">{dailyCompleted} Completed</p>
          </div>

        </div>

      </div>

      {/* 🔥 Premium Daily Study Report */}
      <div className="px-6 mb-6">

        {report && (

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">

            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-gradient-to-br from-emerald-100 to-green-200 p-2 rounded-xl shadow-sm">
                <BarChart3 className="w-5 h-5 text-emerald-700" />
              </div>

              <h3 className="font-semibold text-lg text-gray-800">
                Daily Study Report
              </h3>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-5">

              <div className="bg-gray-50 rounded-xl py-3 text-center">
                <p className="text-[11px] text-gray-400 uppercase tracking-wide">
                  Focus
                </p>
                <p className="text-lg font-semibold text-emerald-600">
                  {report.focus_hours}
                  <span className="text-sm text-gray-400 ml-1">hrs</span>
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl py-3 text-center">
                <p className="text-[11px] text-gray-400 uppercase tracking-wide">
                  Sessions
                </p>
                <p className="text-lg font-semibold text-gray-800">
                  {report.sessions}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl py-3 text-center">
                <p className="text-[11px] text-gray-400 uppercase tracking-wide">
                  Tasks
                </p>
                <p className="text-lg font-semibold text-gray-800">
                  {report.tasks_completed}
                </p>
              </div>

            </div>

            {/* AI Insight */}
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100 rounded-xl p-4">

              <div className="inline-flex items-center gap-2 mb-2 px-2 py-1 rounded-md bg-gray-100">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>

                <p className="text-[11px] font-medium text-gray-700 tracking-wide">
                  AI INSIGHT
                </p>
              </div>

              <p className="text-sm text-gray-700 leading-relaxed">
                {report?.ai_advice
                  ? report.ai_advice.slice(0, 120)
                  : ""}
              </p>

            </div>

          </div>

        )}

      </div>

      {/* Tasks */}
      <div className="px-6">

        <h2 className="text-lg font-semibold mb-4">
          Today's Focus Path
        </h2>

        {tasks.length === 0 ? (
          <p className="text-gray-500">No tasks found.</p>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              id={task.id}
              subject={task.subject}
              duration={task.estimated_hours}
              title={task.description}
              difficulty={task.difficulty}
              buttonText="START FOCUS"
              buttonType="primary"
              onClick={startFocus}
              onDelete={() => handleDelete(task.id)}
            />
          ))
        )}

      </div>

      {/* ➕ Add Task Button */}
      {/* ✅ CHANGE 2: move to right like modern apps */}
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50">
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-500 hover:bg-green-600 text-white p-5 rounded-full shadow-lg transition"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <AddTaskModal
          onClose={() => setShowModal(false)}
          onTaskCreated={loadTasks}
        />
      )}

      {/* ✅ CHANGE 3: floating navbar already updated */}
      {!showModal && <Navbar />}

    </div>
  )
}

