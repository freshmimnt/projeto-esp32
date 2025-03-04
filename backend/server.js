const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(express.json());

// Simulated vehicle data
const vehicleData = {
  time: 0,
  velocity: 0,
  inclination: 0,
  battery: 100,
  distance: 0,
  totalTime: 0,
};

// WebSocket connection for real-time updates
io.on("connection", (socket) => {
  console.log("New client connected");

  // Send initial data
  socket.emit("updateData", vehicleData);

  // Receive control commands from frontend
  socket.on("control", (command) => {
    console.log("Command received:", command);
    // Here, you would send commands to ESP32 (via MQTT or Serial)
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
