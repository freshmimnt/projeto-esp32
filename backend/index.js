const express = require('express')
const mqtt = require('mqtt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const pool = require('./db');
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

const port = 3000;

let ultrasonicValue = 0;

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
client.publish('esp32/receive', 'Hello, HiveMQ!', { retain: true }, (err) => {
  if (err) {
    console.error('Failed to publish message:', err);
  } else {
    console.log('Message published with retain flag set to true');
  }
});
*/

//you can put the login, register and logout endpoint below this comment

httpServer.listen(port, () => console.log(`Example app listening on http://localhost:3000`));


