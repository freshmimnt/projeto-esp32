const express = require('express')
const mqtt = require('mqtt')
const jwt  = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const Pool = require('pg').Pool
const dotenv = require('dotenv')
const app = express()
const port = 3000

app.use(express.json())

const pool = new Pool({
  user: process.env.DB_USER,
  host:process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password:process.env.DB_PASSWORD,
  port: 5432,
})

const client = mqtt.connect('mqtt://broker.hivemq.com', { 
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD
});

const topic = "hello";

client.on('connect', async () => {
  console.log('Connected to MQTT broker');
  client.subscribe(topic);
});

client.on('message', (topic, message) => {
  console.log(`Received message on topic: `, topic, 'message: ', message);
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

