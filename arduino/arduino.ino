#include <Arduino.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <Motor.h>

// Wi-Fi credentials
const char *ssid = "col";
const char *password = "passw0rd";

// MQTT broker details
const char *mqtt_broker = "6ea8d26dbacc48a28de3a4d62b39e9fb.s1.eu.hivemq.cloud";
const int mqtt_port = 8883;
const char *mqtt_username = "mintfresh";
const char *mqtt_password = "M#DJj5@CjJSzvWY";

// MQTT topic for Ultrasonic sensor
const char *topic_publish_ultrasonic = "esp32/ultrasonic_sensor";

// MQTT subscribe topic
const char *topic_subscribe_direction = "esp32/vehicle/direction";
const char *topic_subscribe_speed = "esp32/vehicle/speed";

// Ultrasonic Sensor Pins
#define TRIG_PIN 19 // ESP32 pin GPIO23 connected to Ultrasonic Sensor's TRIG pin
#define ECHO_PIN 18 // ESP32 pin GPIO22 connected to Ultrasonic Sensor's ECHO pin

// Speaker
#define CMD_PLAY_NEXT 0x01
#define CMD_PLAY_PREV 0x02
#define CMD_PLAY_W_INDEX 0x03
#define CMD_SET_VOLUME 0x06
#define CMD_SEL_DEV 0x092
#define CMD_PLAY_W_VOL 0x22
#define CMD_PLAY 0x0D
#define CMD_PAUSE 0x0E
#define CMD_SINGLE_CYCLE 0x19
#define DEV_TF 0x02
#define SINGLE_CYCLE_ON 0x00
#define SINGLE_CYCLE_OFF 0x01

// Wheel Control
Motor forward(32, 22);
Motor backward(33, 23);
Motor right(32, 22);
Motor left(32, 22);
int currentSpeed = 0;

// Create instances
WiFiClientSecure wifiClient;
PubSubClient mqttClient(wifiClient);

// Variables for timing
long previous_time = 0;

// Variables for distance
long duration_us, distance_cm;

// MQTT subscribe to control direction and speed of the wheels
void mqttCallback(char *topic, byte *payload, unsigned int length)
{
    String message = "";
    for (unsigned int i = 0; i < length; i++)
    {
        message += (char)payload[i];
    }
    message.trim();

    Serial.print("Message arrived [");
    Serial.print(topic);
    Serial.print("]: ");
    Serial.println(message);

    // Controls the speed
    if (String(topic) == topic_subscribe_speed)
    {
        if (message == "SLOW")
        {
            currentSpeed = 100;
        }
        else if (message == "NORMAL")
        {
            currentSpeed = 180;
        }
        else if (message == "TURBO")
        {
            currentSpeed = 255;
        }
        Serial.print("Speed set to: ");
        Serial.println(currentSpeed);
    }

    // Controls the direction
    else if (String(topic) == topic_subscribe_direction)
    {
        if (message == "FORWARD")
        {
            forward.motorMoving(currentSpeed);
            backward.motorStop(0);
            Serial.println("FORWARD");
        }
        else if (message == "BACKWARD")
        {
            backward.motorMoving(currentSpeed);
            forward.motorStop(0);
            Serial.println("BACKWARD");
        }
        else if (message == "STOP")
        {
            forward.motorStop(0);
            backward.motorStop(0);
            Serial.println("STOP");
        }
        else if (message == "RIGHT")
        {
            right.motorRight(currentSpeed);
            backward.motorStop(0);
            Serial.println("RIGHT");
        }
        else if (message == "LEFT")
        {
            left.motorLeft(currentSpeed);
            backward.motorStop(0);
            Serial.println("LEFT");
        }
    }
}

void setupMQTT()
{
    mqttClient.setServer(mqtt_broker, mqtt_port);
    mqttClient.setCallback(mqttCallback);
}

void reconnect()
{
    Serial.println("Connecting to MQTT Broker...");
    while (!mqttClient.connected())
    {
        Serial.println("Reconnecting to MQTT Broker...");
        String clientId = "ESP32Client-";
        clientId += String(random(0xffff), HEX);

        if (mqttClient.connect(clientId.c_str(), mqtt_username, mqtt_password))
        {
            Serial.println("Connected to MQTT Broker.");

            // Subscribe to the control topic
            mqttClient.subscribe(topic_subscribe_direction);
            mqttClient.subscribe(topic_subscribe_speed);
        }
        else
        {
            Serial.print("Failed, rc=");
            Serial.print(mqttClient.state());
            Serial.println(" try again in 5 seconds");
            delay(5000);
        }
    }
}

void setup()
{
    Serial.begin(9600);
    Serial2.begin(9600, SERIAL_8N1, 16, 17);
    delay(500); // Wait chip initialization is complete
                /*
                  // Code to control the MP3 Player
                  mp3_command(CMD_SEL_DEV, DEV_TF);  // select the TF card
                  delay(200);                        // wait for 200ms
            
                  mp3_command(CMD_PLAY, 0x0000);       // Play mp3
                  //mp3_command(CMD_PAUSE, 0x0000);      // Pause mp3
                  //mp3_command(CMD_PLAY_NEXT, 0x0000);  // Play next mp3
                  //mp3_command(CMD_PLAY_PREV, 0x0000);  // Play previous mp3
                  //mp3_command(CMD_SET_VOLUME, 30);     // Change volume to 30
                */
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(".");
    }
    Serial.println("\nConnected to Wi-Fi");

    // Initialize secure WiFiClient
    wifiClient.setInsecure(); // Use this only for testing, it allows connecting without a root certificate

    setupMQTT();

    // Set Ultrasonic sensor pins
    pinMode(TRIG_PIN, OUTPUT);
    pinMode(ECHO_PIN, INPUT);
}

void loop()
{
    if (!mqttClient.connected())
    {
        reconnect();
    }
    mqttClient.loop();

    // generate 10-microsecond pulse to TRIG pin
    digitalWrite(TRIG_PIN, HIGH);
    delayMicroseconds(10);
    digitalWrite(TRIG_PIN, LOW);

    duration_us = pulseIn(ECHO_PIN, HIGH);

    // calculate the distance
    distance_cm = 0.017 * duration_us;

    // Convert the distance from long to string
    String distance_cm_str = String(distance_cm);

    // Publish the sensor value to the MQTT topic
    Serial.print("Ultrasonic Sensor Distance: ");
    Serial.print(distance_cm);
    Serial.println(" cm");

    delay(500);

    mqttClient.publish(topic_publish_ultrasonic, distance_cm_str.c_str());
}

/*
void mp3_command(int8_t command, int16_t dat) {
  int8_t frame[8] = { 0 };
  frame[0] = 0x7e;                // starting byte
  frame[1] = 0xff;                // version
  frame[2] = 0x06;                // the number of bytes of the command without starting byte and ending byte
  frame[3] = command;             //
  frame[4] = 0x00;                // 0x00 = no feedback, 0x01 = feedback
  frame[5] = (int8_t)(dat >> 8);  // data high byte
  frame[6] = (int8_t)(dat);       // data low byte
  frame[7] = 0xef;                // ending byte
  for (uint8_t i = 0; i < 8; i++) {
    Serial2.write(frame[i]);
  }
}
*/