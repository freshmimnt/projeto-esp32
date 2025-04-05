import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080"); // need to replace this url with websocket url
    setSocket(ws);

    ws.onopen = () => console.log("Connected to WebSocket server");
    ws.onmessage = (message) => {
      const response = JSON.parse(message.data);
      if (response.status === "success") {
        navigate("/dashboard");
      } else {
        alert(response.message || "Login failed");
      }
    };

    ws.onerror = (error) => console.error("WebSocket error:", error);
    ws.onclose = () => console.log("WebSocket connection closed");

    return () => ws.close();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      socket.send(JSON.stringify({ action: "login", email, password }));
    } else {
      alert("Please enter email and password.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
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
          <button type="submit">Login</button>
        </form>
        <p>
          Don't have an account?{" "}
          <span
            className="register-link"
            onClick={() => navigate("/register")}
            style={{ cursor: "pointer", color: "#007bff" }}
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
