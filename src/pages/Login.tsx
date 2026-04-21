import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    const res = await fetch("https://acadevia-backend.onrender.com/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.detail || "Login failed");
      return;
    }

    localStorage.setItem("token", data.access_token);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-8">

        <div className="text-center mb-8">
          <div className="bg-green-100 w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4">
            ✨
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Acadevia</h1>
          <p className="text-gray-400 tracking-widest text-sm mt-1">
            ADAPTIVE ACADEMIC OS
          </p>
        </div>

        <div className="space-y-5">

          <div>
            <label className="block text-gray-600 mb-2">University Email</label>
            <input
              type="email"
              placeholder="name@university.edu"
              className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-2">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 rounded-xl shadow-lg transition duration-200"
          >
            Log In →
          </button>

          <p className="text-center text-gray-500 text-sm mt-4">
            Don’t have an account?{" "}
            <Link to="/register" className="text-green-600 font-medium">
              Create Workspace
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}