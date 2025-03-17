const express = require('express')
const mqtt = require('mqtt')
const jwt  = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const Pool = require('pg').Pool
const dotenv = require('dotenv')
const app = express()
const port = 3000

app.use(express.json())

require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host:process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password:process.env.DB_PASSWORD,
  port: 5432,
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
  console.log(`Received message from topic '${topic}': ${message.toString()}`);
});

/*app.post('/login', async (req, res) => {
  try{
    const {email, password} = req.body;

    const [userResult] = await pool.query({
      text: 'SELECT * FROM users WHERE email = $1',
      values: [email]
    });

  }*/

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

