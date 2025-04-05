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
const char *topic_subscribe = "esp32/receive";

// Ultrasonic Sensor Pins
#define TRIG_PIN 19 // ESP32 pin GPIO23 connected to Ultrasonic Sensor's TRIG pin
#define ECHO_PIN 18 // ESP32 pin GPIO22 connected to Ultrasonic Sensor's ECHO pin

// Wheel Control
String command;
Motor forward(32, 22);
Motor backward(33, 23);
Motor right(32, 22);
Motor left(32, 22);

// Create instances
WiFiClientSecure wifiClient;
PubSubClient mqttClient(wifiClient);

// Variables for timing
long previous_time = 0;

// Variables for distance
float duration_us, distance_cm;

void mqttCallback(char *topic, byte *payload, unsigned int length)
{
    command = ""; // Clear previous command
    for (unsigned int i = 0; i < length; i++)
    {
        command += (char)payload[i];
    }
    command.trim(); // Remove any extra whitespace
    Serial.print("Message arrived [");
    Serial.print(topic);
    Serial.print("]: ");
    Serial.println(command);

    if (command == "START")
    {
        forward.motorMoving();
        backward.motorStop();
        Serial.println("FORWARD");
    }
    else if (command == "BACKWARD")
    {
        backward.motorMoving();
        forward.motorStop();
        Serial.println("BACKWARD");
    }
    else if (command == "STOP")
    {
        forward.motorStop();
        backward.motorStop();
        Serial.println("STOP");
    }
    else if (command == "RIGHT")
    {
        right.motorRight();
        backward.motorStop();
        Serial.println("RIGHT");
    }
    else if (command == "LEFT")
    {
        left.motorLeft();
        backward.motorStop();
        Serial.println("LEFT");
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
            mqttClient.subscribe(topic_subscribe);
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

    // Convert the distance from float to string
    String distance_cm_str = String(distance_cm);

    // Publish the sensor value to the MQTT topic
    Serial.print("Ultrasonic Sensor Distance: ");
    Serial.print(distance_cm);
    Serial.println(" cm");

    delay(500);

    mqttClient.publish(topic_publish_ultrasonic, distance_cm_str.c_str());
}
