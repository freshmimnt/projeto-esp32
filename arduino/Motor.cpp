#include "Arduino.h"
#include "Motor.h"

Motor::Motor(int pin1, int pin2)
{
    pinMode(pin1, OUTPUT);
    pinMode(pin2, OUTPUT);
    _pin1 = pin1;
    _pin2 = pin2;
}

void Motor::motorMoving()
{
    digitalWrite(_pin1, HIGH);
    digitalWrite(_pin2, HIGH);
}

void Motor::motorStop()
{
    digitalWrite(_pin1, LOW);
    digitalWrite(_pin2, LOW);
}

void Motor::motorRight()
{
    digitalWrite(_pin1, HIGH);
    digitalWrite(_pin2, LOW);
}

void Motor::motorLeft()
{
    digitalWrite(_pin1, LOW);
    digitalWrite(_pin2, HIGH);
}
