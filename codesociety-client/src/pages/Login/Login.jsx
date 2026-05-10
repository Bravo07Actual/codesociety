import { useState } from "react";
import axiosInstance from "../../utils/axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axiosInstance.post("/auth/login", formData);

      if (res.status === 200) {
        login(res.data.user);
        toast.success("Logged in successfully!");
        navigate("/");
      }
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Something went wrong";

      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      <div className="flex-1 bg-blue-50 flex flex-col justify-center items-center p-8">
        <h2 className="text-4xl font-bold text-blue-700 mb-4">Welcome Back!</h2>
        <p className="text-gray-700 text-lg max-w-md text-center">
          Ready to dive into problems, sharpen your skills, and join the CodeSociety?
        </p>
      </div>

      <div className="flex-1 bg-white flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>

          {error && (
            <p className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm text-center">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Login
            </button>
          </form>

          {/* Playground CTA */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 mb-2">
              Want to just try writing code first?
            </p>
            <Link
              to="/playground"
              className="inline-block border border-yellow-500 text-yellow-600 hover:bg-yellow-50 px-4 py-2 rounded-lg font-semibold transition-all duration-200 text-sm"
            >
              Try Playground
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
