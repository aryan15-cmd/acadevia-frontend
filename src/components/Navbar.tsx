import { useLocation, useNavigate } from "react-router-dom"
import { LayoutDashboard, BarChart3, User } from "lucide-react"

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { label: "Insights", icon: BarChart3, path: "/insights" },
    { label: "Profile", icon: User, path: "/profile" },
  ]

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-50">

      {/* Floating Container */}
      <div className="bg-white/90 backdrop-blur-xl shadow-xl rounded-2xl px-6 py-3 flex justify-between items-center border border-gray-100">

        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center flex-1"
            >

              {/* Active Icon Background */}
              <div
                className={`p-2 rounded-xl transition ${
                  isActive
                    ? "bg-green-500 text-white shadow-md"
                    : "text-gray-400"
                }`}
              >
                <Icon size={20} />
              </div>

              {/* Label */}
              <span
                className={`text-[10px] mt-1 ${
                  isActive ? "text-green-600" : "text-gray-400"
                }`}
              >
                {item.label}
              </span>

            </button>
          )
        })}

      </div>
    </div>
  )
}