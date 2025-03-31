import { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/auth/profile");
        setUser(res.data.user);
      } catch (err) {
        setMessage("Unauthorized or session expired");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    };

    fetchProfile();
  }, [navigate]);

  return (
    <div style={{ paddingTop: "100px", textAlign: "center" }}>
      <h2>Profile</h2>
      {message && <p>{message}</p>}
      {user && (
        <div>
          <p><strong>First Name:</strong> {user.firstname}</p>
          <p><strong>Last Name:</strong> {user.lastname}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      )}
    </div>
  );
}

export default Profile;
