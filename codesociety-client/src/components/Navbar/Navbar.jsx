import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axios";
import { useAuth } from "../../context/AuthContext.jsx";
import { toast } from "react-toastify";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const codeAura = 0; // Static for now; will be made dynamic in Phase 3

  const handleLogout = async () => {
    try {
      await axiosInstance.get("/auth/logout");
      logout(); // clear auth state
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Logout failed");
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-gray-900 text-white shadow-md">
      <Link to="/" className="text-2xl font-bold text-yellow-400">
        CodeSociety
      </Link>
      <div className="space-x-6 text-lg font-medium flex items-center">
        {user ? (
          <>
            <Link to="/" className="hover:text-yellow-400">Home</Link>
            <Link to="/problems" className="hover:text-yellow-400">Problems</Link>
            <Link to="/leaderboard" className="hover:text-yellow-400">Leaderboard</Link>
            <span className="text-sm text-yellow-300 font-semibold">{codeAura} CodeAura</span>
            <Link to="/profile" className="hover:text-yellow-400">Profile</Link>
            <button onClick={handleLogout} className="text-red-400 hover:text-red-300">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-yellow-400">Login</Link>
            <Link to="/register" className="hover:text-yellow-400">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
