import { X } from "lucide-react"
import { useState } from "react"
import { createTask } from "../services/api"

type Props = {
  onClose: () => void
  onTaskCreated: () => void
}

export default function AddTaskModal({ onClose, onTaskCreated }: Props) {

  const [subject, setSubject] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [estimatedHours, setEstimatedHours] = useState(1)
  const [difficulty, setDifficulty] = useState(3)
  const [loading, setLoading] = useState(false)

  const handleCreate = async () => {
   if (!subject || !description || !dueDate) {
     alert("All fields are required")
     return
   }
    try {
      setLoading(true)

      const taskData = {
        subject,
        description,
        due_date: new Date(dueDate).toISOString(),   // 🔥 required format
        estimated_hours: Number(estimatedHours),     // 🔥 must be number
        difficulty: Number(difficulty)               // 🔥 must be number
      }

      console.log("Sending:", taskData)

      await createTask(taskData)

      onTaskCreated()
      onClose()

    } catch (error) {
      console.error("Error creating task:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end justify-center z-50">

      <div className="bg-white w-full max-w-md rounded-t-3xl p-6 pb-8">

        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6"></div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Add New Task</h2>
          <button onClick={onClose}>
            <X className="text-gray-400" />
          </button>
        </div>

        {/* Subject */}
        <div className="mb-5">
          <label className="text-sm text-gray-400 font-medium">
            SUBJECT
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Computer Science"
            className="w-full mt-2 bg-gray-100 rounded-xl p-4 outline-none"
          />
        </div>

        {/* Description */}
        <div className="mb-5">
          <label className="text-sm text-gray-400 font-medium">
            DESCRIPTION
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the task..."
            className="w-full mt-2 bg-gray-100 rounded-xl p-4 outline-none"
          />
        </div>

        {/* Due Date */}
        <div className="mb-5">
          <label className="text-sm text-gray-400 font-medium">
            DUE DATE
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full mt-2 bg-gray-100 rounded-xl p-4 outline-none"
          />
        </div>

        {/* Estimated Hours */}
        <div className="mb-5">
          <label className="text-sm text-gray-400 font-medium">
            ESTIMATED HOURS
          </label>
          <input
            type="number"
            step="0.5"
            value={estimatedHours}
            onChange={(e) => setEstimatedHours(Number(e.target.value))}
            className="w-full mt-2 bg-gray-100 rounded-xl p-4 outline-none"
          />
        </div>

        {/* Difficulty */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm text-gray-400 font-medium">
              DIFFICULTY LEVEL
            </label>
            <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
              Level {difficulty}
            </span>
          </div>

          <input
            type="range"
            min="1"
            max="5"
            value={difficulty}
            onChange={(e) => setDifficulty(Number(e.target.value))}
            className="w-full accent-green-500"
          />
        </div>

        <button
          onClick={handleCreate}
          disabled={loading}
          className="w-full bg-green-500 text-white py-4 rounded-2xl text-lg font-semibold shadow-lg"
        >
          {loading ? "Creating..." : "Create Task"}
        </button>

      </div>
    </div>
  )
}