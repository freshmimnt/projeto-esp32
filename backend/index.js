const express = require('express')
const mqtt = require('mqtt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const pool = require('./db');
const dotenv = require('dotenv')
const { createServer } = require("http");
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" },
  transports: ['polling', 'websocket'],
  allowUpgrades: false
});

app.use(express.json())
app.use(cors())
app.use(cookieParser())

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

// MQTT subscribe to receive the ultrasonic
client.subscribe('esp32/ultrasonic_sensor', (err) => {
  if (err) {
    console.error('Subscription error:', err.message);
  } else {
    console.log('Subscribed to topic: esp32/ultrasonic_sensor');
  }
});

// MQTT

client.on('message', (topic, message) => {
  ultrasonicValue = parseFloat(message.toString());
  console.log(`Received message from topic '${topic}': ${message.toString()}`);
  io.emit('ultrasonicData', {distance: ultrasonicValue});
  //pool.query('INSERT INTO sensors(distance, timestamp) VALUES($1, NOW())', [ultrasonicValue], (err) => {
  //  if (err) console.error('DB insert error:', err);
 // });
});

app.get('/api/ultrasonic', (req, res) => {
  res.json({ distance: ultrasonicValue });
});

// MQTT publish to send the command to the vehcle
io.on('connection', (socket) =>{
  socket.on('command', (cmd) =>{
    client.publish('esp32/receive', (cmd), { retain: true }, (err) => {
      console.log(`Received command from frontend: ${cmd}`);
      if (err) {
        console.error('Failed to publish message:', err);
      } else {
        console.log('Command published');
      }
    });
  });
});

//you can put the login, register and logout endpoint below this comment

/*get
  difference between the start time and end time
*/

httpServer.listen(port, () => console.log(`Example app listening on http://localhost:3000`));


