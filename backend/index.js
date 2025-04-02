const express = require('express')
const mqtt = require('mqtt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const Pool = require('pg').Pool
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

const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

let ultrasonicValue = 0;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

pool.connect((err, client, done) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Successfully connected to PostgreSQL database');
  done();
});

// Conexão com o broker MQTT (desativada temporariamente)
/*
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
*/

io.on('connection', (socket) => {
  console.log('connected')

  socket.on('message', (message) => {
    console.log(message);
    io.emit('message', `${socket.id.substr(0, 2)} said ${message}`)
  });
});

httpServer.listen(3000, () => console.log(`Example app listening on http://localhost:3000`));







// ----new code---- 
/*
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

const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

let ultrasonicValue = 0;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

pool.connect((err, client, done) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Successfully connected to PostgreSQL database');
  done();
});

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


/*
io.on('connection', (socket) => {
  console.log('connected')

  socket.on('message', (message) => {
    console.log(message);
    io.emit('message', `${socket.id.substr(0, 2)} said ${message}`)
  });
});

httpServer.listen(3000, () => console.log(`Example app listening on http://localhost:3000`));
*/