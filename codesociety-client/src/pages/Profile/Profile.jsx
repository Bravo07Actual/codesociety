import { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:8000/auth/profile", {
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch (err) {
        setError("Failed to fetch profile. Please login again.");
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">User Profile</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {user ? (
          <div className="space-y-2">
            <p><strong>Name:</strong> {user.firstname} {user.lastname}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
          </div>
        ) : (
          !error && <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
