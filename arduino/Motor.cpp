#include "Arduino.h"
#include "Motor.h"

Motor::Motor(int pin1, int pin2)
{
    pinMode(pin1, OUTPUT);
    pinMode(pin2, OUTPUT);
    _pin1 = pin1;
    _pin2 = pin2;
}

void Motor::motorRight(int speed)
{
    analogWrite(_pin1, speed);
    analogWrite(_pin2, 0);
}

void Motor::motorLeft(int speed)
{
    analogWrite(_pin2, speed);
    analogWrite(_pin1, 0);
}

void Motor::motorBackward(int speed)
{
    analogWrite(_pin1, 0);
    analogWrite(_pin2, speed);
}

void Motor::motorForward(int speed)
{
    analogWrite(_pin1, speed);
    analogWrite(_pin2, 0);
}

void Motor::motorStop(int speed)
{
    analogWrite(_pin1, speed);
    analogWrite(_pin2, speed);
}
