import { useState, useEffect } from "react"
import Navbar from "../components/Navbar"
import { Search, Plus, Lock } from "lucide-react"
import { Preferences } from "@capacitor/preferences"
import AppBlocker from '../plugins/appBlocker'
import { useNavigate } from "react-router-dom"
import { Capacitor } from '@capacitor/core'

// ✅ Plugin type


// ✅ Register plugin


type App = {
  name: string
  package: string
  category: string
  icon: string
}

const availableApps: App[] = [
  { name: "Facebook", package: "com.facebook.katana", category: "Social Media", icon: "🔵" },
  { name: "Instagram", package: "com.instagram.android", category: "Social Media", icon: "📸" },
  { name: "TikTok", package: "com.zhiliaoapp.musically", category: "Entertainment", icon: "🎵" },
  { name: "YouTube", package: "com.google.android.youtube", category: "Video", icon: "▶️" }
]

export default function BlockedApps() {

  const navigate = useNavigate()

  const [enabled, setEnabled] = useState(true)
  const [strictMode, setStrictMode] = useState(false)
  const [search, setSearch] = useState("")
  const [blockedApps, setBlockedApps] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  // ✅ INIT LOAD + SYNC
  useEffect(() => {
    const init = async () => {
      try {
        const { value } = await Preferences.get({ key: "blocked_apps" })

        const apps = value ? JSON.parse(value) : []

        setBlockedApps(apps)

        // 🔥 Sync with Android
        if (Capacitor.isNativePlatform()) {
          await AppBlocker.setBlockedApps({
            apps: apps
          })
        }

        console.log("Loaded apps:", apps)

      } catch (err) {
        console.log("Init error", err)
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [])

  // ✅ SAVE + SYNC
  const saveBlockedApps = async (apps: string[]) => {
    try {
      // 🔥 Save locally (fix reset issue)
      await Preferences.set({
        key: "blocked_apps",
        value: JSON.stringify(apps)
      })

      // 🔥 Sync to Android
      if (Capacitor.isNativePlatform()) {
        await AppBlocker.setBlockedApps({
          apps: apps
        })
      }

      console.log("Saved apps:", apps)

    } catch (e) {
      console.log("Error saving blocked apps", e)
    }
  }

  // ✅ TOGGLE APP
  const toggleApp = async (pkg: string) => {

    let updated: string[]

    if (blockedApps.includes(pkg)) {
      updated = blockedApps.filter(a => a !== pkg)
    } else {
      updated = [...blockedApps, pkg]
    }

    setBlockedApps(updated)
    await saveBlockedApps(updated)
  }

  const filteredApps = availableApps.filter(app =>
    app.name.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-[#f4f6f8] pb-32 max-w-md mx-auto w-full">

      <div className="px-4 sm:px-6 pt-6 sm:pt-8">

        <button
          onClick={() => navigate("/focus")}
          className="mb-4 text-green-600 text-sm font-medium"
        >
          ← Back to Focus Session
        </button>

        <h1 className="text-xl sm:text-2xl font-bold mb-6">FocusFlow</h1>

        {/* Protection */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 mb-6 shadow">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Protection Status</h3>
              <p className="text-gray-500 text-sm">
                Focus protection is {enabled ? "active" : "disabled"}
              </p>
            </div>

            <button
              onClick={() => setEnabled(!enabled)}
              className={`w-12 h-7 rounded-full ${enabled ? "bg-green-500" : "bg-gray-300"}`}
            >
              <div className={`h-5 w-5 bg-white rounded-full m-1 transition ${enabled ? "translate-x-5" : ""}`} />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-green-100 rounded-2xl p-4 mb-6">
          <p className="text-sm text-gray-600">WEEKLY BLOCKED ATTEMPTS</p>
          <div className="flex items-center gap-2 mt-2">
            <h2 className="text-3xl font-bold">247</h2>
            <span className="text-green-600 text-sm">+12%</span>
          </div>
        </div>

        {/* Strict Mode */}
        <div className="bg-[#0f172a] text-white rounded-2xl p-4 flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Lock className="text-green-400" />
            <div>
              <h3 className="font-semibold">Strict Mode</h3>
              <p className="text-sm text-gray-300">Prevent app uninstallation</p>
            </div>
          </div>

          <button
            onClick={() => setStrictMode(!strictMode)}
            className={`w-12 h-7 rounded-full ${strictMode ? "bg-green-500" : "bg-gray-500"}`}
          >
            <div className={`h-5 w-5 bg-white rounded-full m-1 transition ${strictMode ? "translate-x-5" : ""}`} />
          </button>
        </div>

        {/* Header */}
        <div className="mb-3 flex justify-between">
          <h2 className="font-semibold">Blocked Apps</h2>
          <span className="text-gray-500 text-sm">
            {blockedApps.length} Apps Blocked
          </span>
        </div>

        {/* Search */}
        <div className="bg-white flex items-center gap-2 rounded-xl p-3 mb-4 shadow">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search apps..."
            className="outline-none w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Apps */}
        {filteredApps.map(app => {
          const isBlocked = blockedApps.includes(app.package)

          return (
            <div
              key={app.name}
              className="bg-white rounded-2xl p-4 flex justify-between items-center mb-3 shadow"
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">{app.icon}</div>
                <div>
                  <p className="font-semibold">{app.name}</p>
                  <p className="text-sm text-gray-500">{app.category}</p>
                </div>
              </div>

              <button
                onClick={() => toggleApp(app.package)}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isBlocked ? "bg-gray-200" : "bg-green-500 text-white"
                }`}
              >
                {isBlocked ? "−" : "+"}
              </button>
            </div>
          )
        })}

        {/* Add More */}
        <button className="w-full border-2 border-dashed border-green-400 text-green-600 py-4 rounded-2xl flex items-center justify-center gap-2 mt-4">
          <Plus size={18} />
          Add More Apps
        </button>

      </div>

      <Navbar />
    </div>
  )
}