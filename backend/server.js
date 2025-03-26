require("dotenv").config();
const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // --- the front-end url --- NEED TO CHECK
    methods: ["GET", "POST"]
  }
});

const pool = new Pool({
  user: "admin",
  host: "localhost",
  database: "vehicle_db",
  password: "password",
  port: 5432
});

app.use(cors());
app.use(express.json());

io.on("connection", (socket) => {
  console.log("New WebSocket connection established");

  socket.on("register", async (data) => {
    const { name, email, password } = data;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const result = await pool.query(
        "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
        [name, email, hashedPassword]
      );
      socket.emit("register_success", { message: "User registered successfully!", user: result.rows[0] });
    } catch (error) {
      console.error("Registration Error:", error);
      socket.emit("register_error", { message: "Email already exists or invalid data." });
    }
  });

  socket.on("login", async (data) => {
    const { email, password } = data;

    try {
      const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

      if (result.rows.length === 0) {
        socket.emit("login_error", { message: "User not found." });
        return;
      }

      const user = result.rows[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        socket.emit("login_success", { message: "Login successful!", user: { id: user.id, name: user.name, email: user.email } });
      } else {
        socket.emit("login_error", { message: "Incorrect password." });
      }
    } catch (error) {
      console.error("Login Error:", error);
      socket.emit("login_error", { message: "Login failed. Try again." });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
