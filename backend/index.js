const express = require('express')
const mqtt = require('mqtt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const Pool = require('pg').Pool
const dotenv = require('dotenv')
const { createServer } = require("http");
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" }
});

app.use(express.json())

require('dotenv').config();

let ultrasonicValue = 0;

/*const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: 5432,
});*/

const client = mqtt.connect('mqtts://6ea8d26dbacc48a28de3a4d62b39e9fb.s1.eu.hivemq.cloud:8883', {
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD
});

client.on('connect', () => {
  console.log('Connected to HiveMQ Cloud');
});

client.on('error', (err) => {
  console.error('MQTT Connection Error:', err.message);
});

client.on('close', () => {
  console.warn('MQTT Connection Closed');
});

client.subscribe('esp32/ultrasonic_sensor', (err) => {
  if (err) {
    console.error('Subscription error:', err.message);
  } else {
    console.log('Subscribed to topic: esp32/ultrasonic_sensor');
  }
});

client.on('message', (topic, message) => {
  ultrasonicValue = parseFloat(message.toString());
  console.log(`Received message from topic '${topic}': ${message.toString()}`);
  io.emit('ultrasonicData', {distance: ultrasonicValue});
});

/*
client.publish('esp32/command', )



*/

io.on('connection', (socket) => {
  console.log('connected')

  socket.on('message', (message) => {
    console.log(message);
    io.emit('message', `${socket.id.substr(0, 2)} said ${message}`)
  });
});

httpServer.listen(3000, () => console.log(`Example app listening on http://localhost:3000`));
