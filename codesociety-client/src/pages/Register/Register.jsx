import { useState } from "react";
import axios from "../../utils/axios";

function Register() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await axios.post("/auth/register", formData);
      setMessage(res.data.message || "Registered Successfully!");
    } catch (err) {
      setMessage(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div style={{ paddingTop: "100px", textAlign: "center" }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="firstname" placeholder="First Name" value={formData.firstname} onChange={handleChange} /><br />
        <input type="text" name="lastname" placeholder="Last Name" value={formData.lastname} onChange={handleChange} /><br />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} /><br />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} /><br />
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Register;
