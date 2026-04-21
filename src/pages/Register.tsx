import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRegister = async (): Promise<void> => {
    if (!fullName || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("https://acadevia-backend.onrender.com/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: fullName,
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Registration failed");
        return;
      }

      alert("Registration successful! Please login.");
      navigate("/");

    } catch (error) {
      console.error("Registration error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-8">

        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="bg-green-100 w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4">
            ✨
          </div>

          <h1 className="text-3xl font-bold text-gray-800">
            Acadevia
          </h1>

          <p className="text-gray-400 tracking-widest text-sm mt-1">
            CREATE YOUR ACCOUNT
          </p>
        </div>

        <div className="space-y-5">

          {/* Full Name */}
          <div>
            <label className="block text-gray-600 mb-2">
              Full Name
            </label>

            <input
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFullName(e.target.value)
              }
              className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-600 mb-2">
              User Email
            </label>

            <input
              type="email"
              placeholder="name@gmail.com"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-600 mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Register Button */}
          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 rounded-xl shadow-lg transition duration-200 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Workspace →"}
          </button>

          {/* Login Link */}
          <p className="text-center text-gray-500 text-sm mt-4">
            Already have an account?{" "}
            <Link to="/" className="text-green-600 font-medium">
              Log In
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}