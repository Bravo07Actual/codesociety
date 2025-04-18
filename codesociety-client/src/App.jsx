import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.jsx";
import Footer from "./components/Footer/Footer.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Register from "./pages/Register/Register.jsx";
import Home from "./pages/Home/Home.jsx";
import Login from "./pages/Login/Login.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import ProblemsList from "./pages/Problems/ProblemsList.jsx";
import ProblemDetail from "./pages/Problems/ProblemDetail.jsx";
import Leaderboard from "./pages/Leaderboard/Leaderboard.jsx";

import PrivateRoute from "./context/PrivateRoute"; // ✅ added

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />

        <div className="flex-grow overflow-y-auto pt-20 pb-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            {/* ✅ Protected Routes */}
            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />

            <Route path="/problems" element={
              <PrivateRoute>
                <ProblemsList />
              </PrivateRoute>
            } />

            <Route path="/leaderboard" element={
              <PrivateRoute>
                <Leaderboard />
              </PrivateRoute>
            } />

            <Route path="/problems/:slug" element={
              <PrivateRoute>
                <ProblemDetail />
              </PrivateRoute>
            } />
          </Routes>
        </div>

        <ToastContainer position="top-right" autoClose={3000} />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
