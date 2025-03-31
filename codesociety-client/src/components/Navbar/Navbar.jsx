import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./navbar.module.css";
import axios from "../../utils/axios";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get("/auth/logout");
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <nav className={styles.navbar}>
      <Link to="/">Home</Link>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
      <Link to="/profile">Profile</Link>
      <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
    </nav>
  );
}

export default Navbar;
