import { useNavigate } from "react-router-dom"
import { startFocus } from "../services/api"
import { Play } from "lucide-react"
import startSoundFile from "../assets/sounds/start.mp3"
import { useRef, useEffect } from "react"

type TaskCardProps = {
  id: number
  subject: string
  duration: number
  title: string
  difficulty: number
  buttonText: string
  buttonType?: "primary" | "outline" | "disabled"
  onDelete?: () => void
  onClick?: () => void
}

function formatHours(decimalHours: number): string {
  const totalMinutes = Math.round(decimalHours * 60)

  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`
  if (hours > 0) return `${hours}h`

  return `${minutes}m`
}

export default function TaskCard({
  id,
  subject,
  duration,
  title,
  difficulty,
  buttonText,
  buttonType = "primary",
  onDelete
}: TaskCardProps) {

  const navigate = useNavigate()

  // 🔊 Sound Ref
  const startSound = useRef<HTMLAudioElement | null>(null)

  // 🔊 Initialize sound once
  useEffect(() => {
    startSound.current = new Audio(startSoundFile)

    if (startSound.current) {
      startSound.current.volume = 0.4 // 🔥 soft premium sound
    }
  }, [])

  const buttonStyles: Record<string, string> = {
    primary: "bg-green-500 hover:bg-green-600 text-white",
    outline: "border border-green-500 text-green-600",
    disabled: "bg-gray-100 text-gray-400 cursor-not-allowed",
  }

  // 🔹 Start Focus
  const handleStart = async () => {
    if (buttonType !== "primary") return

    try {

      // 🔥 PLAY SOUND BEFORE ANYTHING
      if (startSound.current) {
        startSound.current.currentTime = 0
        startSound.current.play().catch(() => {})
      }

      const session = await startFocus(id)

      localStorage.setItem("session_id", session.session_id)

      navigate("/focus")

    } catch (error) {
      console.error("Failed to start focus session", error)
    }
  }

  // 🔹 Delete Task
  const handleDelete = () => {
    onDelete?.()
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm mb-4 border border-gray-100">

      {/* Top */}
      <div className="flex justify-between mb-2">
        <span className="text-xs text-gray-400">{subject}</span>
        <span className="text-xs text-gray-400">{formatHours(duration)}</span>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-lg mb-3 text-gray-800">
        {title}
      </h3>

      {/* Difficulty */}
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((dot) => (
          <div
            key={dot}
            className={`h-2 w-2 rounded-full ${
              dot <= difficulty ? "bg-green-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div>

      {/* 🔥 Premium Start Button */}
      <button
        onClick={handleStart}
        className={`w-full py-3 rounded-full font-medium flex items-center justify-center gap-3 shadow-md transition-all active:scale-95 ${buttonStyles[buttonType]}`}
      >
        <div className="bg-white/20 p-1.5 rounded-full">
          <Play className="w-4 h-4" />
        </div>

        {buttonText}
      </button>

      {/* Delete */}
      <button
        onClick={handleDelete}
        className="w-full mt-3 py-2 rounded-full bg-red-100 text-red-500 text-sm hover:bg-red-200 transition"
      >
        Delete
      </button>

    </div>
  )
}