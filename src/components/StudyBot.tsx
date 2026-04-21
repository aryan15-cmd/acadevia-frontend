import { useState, useRef, useEffect } from "react"
import penguin from "../assets/penguin.png"

type Message = {
  role: "user" | "bot"
  text: string
}

export default function StudyBot() {

  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "Hey! I'm your Study Buddy 🐧. What do you want to learn today?" }
  ])

  const [input, setInput] = useState<string>("")
  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async () => {

    if (!input.trim()) return

    const token = localStorage.getItem("token")

    const userMessage: Message = {
      role: "user",
      text: input
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("https://acadevia-backend.onrender.com/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ message: input })
      })

      if (!res.ok) throw new Error("Request failed")

      const data = await res.json()

      // 🔥 EVENT INSTEAD OF RELOAD
      if (data.reply?.toLowerCase().includes("created")) {
        window.dispatchEvent(new Event("taskCreated"))
      }

      const botReply: Message = {
        role: "bot",
        text: data.reply
      }

      setMessages(prev => [...prev, botReply])

    } catch {
      setMessages(prev => [
        ...prev,
        { role: "bot", text: "Server error. Try again." }
      ])
    }

    setLoading(false)
  }

  return (
    <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end">

      <button
        onClick={() => setOpen(!open)}
        className="rounded-full shadow-xl border border-gray-200 bg-white p-1"
      >
        <img
          src={penguin}
          alt="AI Tutor"
          className="w-16 h-16 object-cover rounded-full"
        />
      </button>

      {open && (
        <div className="w-80 bg-white shadow-2xl rounded-2xl mt-3 overflow-hidden border">

          <div className="bg-green-500 text-white px-4 py-3 flex items-center gap-2">
            <img src={penguin} alt="logo" className="w-6 h-6" />
            <div>
              <p className="text-sm font-semibold">Study Buddy</p>
              <p className="text-xs opacity-80">AI Tutor</p>
            </div>
          </div>

          <div className="h-64 overflow-y-auto px-3 py-2 space-y-2 text-sm bg-gray-50">

            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-xl max-w-[70%] ${
                    m.role === "bot"
                      ? "bg-white text-gray-700 shadow"
                      : "bg-green-500 text-white"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-1 px-2 text-gray-500 text-xs">
                <span className="animate-bounce">.</span>
                <span className="animate-bounce delay-100">.</span>
                <span className="animate-bounce delay-200">.</span>
                <span className="ml-1">Penguin is typing</span>
              </div>
            )}

            <div ref={chatEndRef}></div>
          </div>

          <div className="flex gap-2 p-3 border-t bg-white">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage()
              }}
              className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Ask your AI tutor..."
            />

            <button
              onClick={sendMessage}
              className="bg-green-500 text-white px-4 rounded-lg hover:bg-green-600 transition"
            >
              Send
            </button>
          </div>

        </div>
      )}

    </div>
  )
}