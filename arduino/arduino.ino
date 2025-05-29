#include <Arduino.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <Motor.h>
#include <Wire.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>

const char *ssid = "col";
const char *password = "passw0rd";
const char *mqtt_broker = "6ea8d26dbacc48a28de3a4d62b39e9fb.s1.eu.hivemq.cloud";
const int mqtt_port = 8883;
const char *mqtt_username = "mintfresh";
const char *mqtt_password = "M#DJj5@CjJSzvWY";

const char *topic_publish_sensorsData = "esp32/sensorsData";
const char *topic_subscribe_direction = "esp32/vehicle/direction";
const char *topic_subscribe_speed = "esp32/vehicle/speed";
const char *topic_subscribe_mode = "esp32/vehicle/mode";

#define TRIG_PIN 19
#define ECHO_PIN 18
#define LINE_SENSOR_PIN 27
#define SERVO_PIN 26
const int voltagePin = 34;

Motor leftMotor(16, 17);
Motor rightMotor(32, 33);

WiFiClientSecure wifiClient;
PubSubClient mqttClient(wifiClient);
Adafruit_MPU6050 mpu;

int currentSpeed = 255;
bool autonomousMode = false;

long duration_us = 0, distance_cm = 0;
long rawADC = 0, voltage_mV = 0, percentage = 0;

float a = 0, a1 = 0, a2 = 0;
int random2 = 0;

void Car_forward()
{
    leftMotor.motorForward(currentSpeed);
    rightMotor.motorForward(currentSpeed);
}
void Car_back()
{
    leftMotor.motorBackward(currentSpeed);
    rightMotor.motorBackward(currentSpeed);
}
void Car_left()
{
    leftMotor.motorBackward(currentSpeed);
    rightMotor.motorForward(currentSpeed);
}
void Car_right()
{
    leftMotor.motorForward(currentSpeed);
    rightMotor.motorBackward(currentSpeed);
}
void Car_stop()
{
    leftMotor.motorStop(0);
    rightMotor.motorStop(0);
}

void mqttCallback(char *topic, byte *payload, unsigned int length)
{
    String message = "";
    for (unsigned int i = 0; i < length; i++)
        message += (char)payload[i];
    message.trim();

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
    }
    else if (String(topic) == topic_subscribe_direction && !autonomousMode)
    {
        if (message == "FORWARD")
        {
            Car_forward();
        }
        else if (message == "BACKWARD")
        {
            Car_back();
        }
        else if (message == "STOP")
        {
            Car_stop();
        }
        else if (message == "LEFT")
        {
            Car_left();
        }
        else if (message == "RIGHT")
        {
            Car_right();
        }
    }
    else if (String(topic) == topic_subscribe_mode)
    {
        autonomousMode = (message == "AUTONOMOUS");
        Car_stop();
    }
}

void setupMQTT()
{
    mqttClient.setServer(mqtt_broker, mqtt_port);
    mqttClient.setCallback(mqttCallback);
}

void reconnect()
{
    while (!mqttClient.connected())
    {
        String clientId = "ESP32Client-" + String(random(0xffff), HEX);
        if (mqttClient.connect(clientId.c_str(), mqtt_username, mqtt_password))
        {
            mqttClient.subscribe(topic_subscribe_direction);
            mqttClient.subscribe(topic_subscribe_speed);
            mqttClient.subscribe(topic_subscribe_mode);
        }
        else
        {
            delay(5000);
        }
    }
}

float checkdistance()
{
    digitalWrite(TRIG_PIN, LOW);
    delayMicroseconds(2);
    digitalWrite(TRIG_PIN, HIGH);
    delayMicroseconds(10);
    digitalWrite(TRIG_PIN, LOW);
    return pulseIn(ECHO_PIN, HIGH) / 58.0;
}

void lineCheck()
{
    if (digitalRead(LINE_SENSOR_PIN) == HIGH)
    {
        Car_stop();
        delay(200);
        Car_back();
        delay(300);
        Car_forward();
    }
}

void line()
{
    lineCheck(); // your existing line sensor check
}

void procedure(int angle)
{
    int pulsewidth = angle * 11 + 500;
    for (int i = 0; i <= 50; i++)
    {
        digitalWrite(SERVO_PIN, HIGH);
        delayMicroseconds(pulsewidth);
        digitalWrite(SERVO_PIN, LOW);
        delay(20 - pulsewidth / 1000);
    }
}

void autonomousDrivingAdvanced()
{
    random2 = random(1, 100);
    a = checkdistance(); // front distance

    if (a < 20)
    {
        Serial.println("Wall is near");
        Car_stop();
        delay(500);
        procedure(90); // Ultrasonic platform turns left

        for (int j = 1; j <= 10; j++)
        {
            a1 = checkdistance(); // left distance
        }
        delay(300);

        procedure(90); // Ultrasonic platform turns right
        for (int k = 1; k <= 10; k++)
        {
            a2 = checkdistance(); // right distance
        }

        if (a1 < 50 || a2 < 50)
        {
            if (a1 > a2)
            {
                procedure(140); // Ultrasonic platform turns back to right ahead
                Car_left();
                delay(500);
                Car_forward();
            }
            else
            {
                procedure(140);
                Car_right();
                delay(500);
                Car_forward();
            }
        }
        else
        {
            if ((long)(random2) % 2 == 0)
            {
                procedure(140);
                Car_left();
                delay(500);
                Car_forward();
            }
            else
            {
                procedure(140);
                Car_right();
                delay(500);
                Car_forward();
            }
        }
    }
    else
    {
        Car_forward();
    }
    line();
}

void setup()
{
    Serial.begin(9600);
    Wire.begin();
    if (!mpu.begin())
    {
        Serial.println("MPU6050 not found!");
        while (1)
            delay(10);
    }
    mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
    mpu.setGyroRange(MPU6050_RANGE_500_DEG);
    mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);

    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED)
        delay(500);
    wifiClient.setInsecure();

    setupMQTT();

    pinMode(TRIG_PIN, OUTPUT);
    pinMode(ECHO_PIN, INPUT);
    pinMode(SERVO_PIN, OUTPUT);
    pinMode(LINE_SENSOR_PIN, INPUT);
    analogReadResolution(12);

    procedure(90);
    randomSeed(analogRead(0));
}

void loop()
{
    if (!mqttClient.connected())
        reconnect();
    mqttClient.loop();

    if (autonomousMode)
    {
        autonomousDrivingAdvanced();
    }

    sensors_event_t accel, gyro, temp;
    mpu.getEvent(&accel, &gyro, &temp);
    float inclination = atan2(-accel.acceleration.x, sqrt(pow(accel.acceleration.y, 2) + pow(accel.acceleration.z, 2))) * 180.0 / PI;

    digitalWrite(TRIG_PIN, HIGH);
    delayMicroseconds(10);
    digitalWrite(TRIG_PIN, LOW);
    duration_us = pulseIn(ECHO_PIN, HIGH);
    distance_cm = 0.017 * duration_us;

    rawADC = analogRead(voltagePin);
    voltage_mV = (rawADC * 25000L) / 4095;
    voltage_mV = constrain(voltage_mV, 9000L, 12600L);
    percentage = ((voltage_mV - 9000L) * 100L) / (12600L - 9000L);

    String message = "{\"distance\":" + String(distance_cm) + ",\"battery\":" + String(percentage) + ",\"speed\":" + String(currentSpeed) + ",\"inclination\":" + String(inclination, 1) + "}";
    mqttClient.publish(topic_publish_sensorsData, message.c_str());
}
