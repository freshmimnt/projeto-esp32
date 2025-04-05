import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

<<<<<<< HEAD
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080"); 

    ws.onopen = () => console.log("Connected to WebSocket server");
    ws.onmessage = (message) => {
      const response = JSON.parse(message.data);
      if (response.status === "success") {
        alert("Registration successful!");
        navigate("/");
      } else {
        alert(response.message || "Registration failed");
      }
    };

    ws.onerror = (error) => console.error("WebSocket error:", error);
    ws.onclose = () => console.log("WebSocket connection closed");

    return () => ws.close();
  }, []);

=======
>>>>>>> 26e2b435a8d717d9d277402ced020dc5ec3cd0f9
  const handleRegister = (e) => {
    e.preventDefault();
    if (name && email && password) {
      console.log("Registered:", { name, email, password });
      navigate("/"); // Redirect to login page after registration
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Register</button>
        </form>
        <p>
          Already have an account?{" "}
          <span
            className="register-link"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer", color: "#007bff" }}
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
