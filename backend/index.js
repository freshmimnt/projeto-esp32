const express = require('express')
const mqtt = require('mqtt')
const pool = require('./db');
const dotenv = require('dotenv')
const { createServer } = require("http");
const { Server } = require('socket.io');
const cors = require('cors');
const userRoutes = require('./routes/users.js');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" },
  transports: ['polling', 'websocket'],
  allowUpgrades: false
});


app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(cookieParser());

require('dotenv').config();

// Import routes
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

const port = 3000;

let ultrasonicValue = 0;
let speed = 0;

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

// MQTT subscribe to receive the ultrasonic value
client.subscribe('esp32/ultrasonic_sensor', (err) => {
  if (err) {
    console.error('Subscription error:', err.message);
  } else {
    console.log('Subscribed to topic: esp32/ultrasonic_sensor');
  }
});

// MQTT subscribe to receive the speed value
/*
  client.subscribe('esp32/accelerometer_sensor', (err) =>{
  if (err){
    console.error('Subscription error', err.message);  
  }  else{
    console.log('Subscribed to topic: esp32/accelerometer_sensor') ; 
  }
});
*/

client.on('message', (topic, message) => {
  ultrasonicValue = parseFloat(message.toString());
  console.log(`Received message from topic '${topic}': ${message.toString()}`);
  io.emit('ultrasonicData', {distance: ultrasonicValue});
});

app.get('/api/ultrasonic', (req, res) => {
  res.json({ distance: ultrasonicValue });
});

// MQTT publish to send the direction, speed and switch between manual and autonomous mode
io.on('connection', (socket) => {
  socket.on('command', (cmd) => {
    client.publish('esp32/vehicle/direction', cmd, { retain: true }, (err) => {
      console.log(`Received command from frontend: ${cmd}`);
      if (err) {
        console.error('Failed to publish message:', err);
      } else {
        console.log('Command published');
      }
    });
  });

  socket.on('speed', (speed) => {
    client.publish('esp32/vehicle/speed', speed, { retain: true }, (err) => {
      console.log(`Received speed from frontend: ${speed}`);
      if (err) {
        console.error('Failed to publish message:', err);
      } else {
        console.log('Speed published');
      }
    });

    socket.on('mode', (mode) => {
      client.publish('esp32/vehicle/mode', mode, { retain: true }, (err) => {
        console.log(`Received mode from frontend: ${mode}`);
        if (err) {
          console.error('Failed to publish message:', err);
        } else {
          console.log('Mode published');
        }
      });
    });
  });
});

//you can put the login, register and logout endpoint below this comment
app.use('/api/users', userRoutes);

/*get
  difference between the start time and end time
*/

//NC35HJ49NE sock

httpServer.listen(port, () => console.log(`Example app listening on http://localhost:3000`));



