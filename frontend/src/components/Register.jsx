import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    console.log("Form submission:", { name, email, password }); // Log for debugging

    if (name && email && password) {
      try {
        const response = await fetch("http://localhost:3000/api/users/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include',
          body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Registration failed");
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        console.log("Registered successfully:", data);
        navigate("/dashboard");
      } catch (err) {
        setError(err.message);
        console.error("Registration error:", err);
      }
    } else {
      setError("Please fill in all fields.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Register</h2>
        {error && <div className="error-message">{error}</div>}
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
