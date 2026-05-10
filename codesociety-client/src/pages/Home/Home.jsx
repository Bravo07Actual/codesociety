import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Body from "../../components/Layout/Body.jsx";

const Home = () => {
  const { user } = useAuth();

  return (
    <Body>
      <div className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center text-center">
        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          {user ? (
            <>
              Welcome back, <span className="text-blue-600">{user.firstname || "Coder"}</span>!
            </>
          ) : (
            <>
              Welcome to <span className="text-blue-600">CodeSociety</span>
            </>
          )}
        </h1>

        {/* Subtext */}
        <p className="text-gray-600 text-lg md:text-xl mb-8 max-w-xl">
          {user ? (
            "Sharpen your skills, track your progress, and earn CodeAura as you solve problems."
          ) : (
            "Your platform to sharpen coding skills, compete, and master algorithms — inspired by the best."
          )}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          {user ? (
            <>
              <Link
                to="/problems"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
              >
                Explore Problems
              </Link>
              <Link
                to="/profile"
                className="border border-blue-600 text-blue-600 hover:bg-blue-100 px-6 py-3 rounded-lg font-semibold transition-all duration-200"
              >
                Go to Profile
              </Link>
              {/* Playground CTA visible only to logged in users */}
              <Link
                to="/playground"
                className="border border-yellow-500 text-yellow-600 hover:bg-yellow-50 px-6 py-3 rounded-lg font-semibold transition-all duration-200"
              >
                Try Playground
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
              >
                Get Started
              </Link>
              <Link
                to="/register"
                className="border border-blue-600 text-blue-600 hover:bg-blue-100 px-6 py-3 rounded-lg font-semibold transition-all duration-200"
              >
                Create Account
              </Link>
            </>
          )}
        </div>
      </div>
    </Body>
  );
};

export default Home;
