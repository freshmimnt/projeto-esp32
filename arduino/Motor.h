#ifndef Motor_h
#define Motor_h

#include "Arduino.h"

class Motor
{
public:
    Motor(int pin1, int pin2);
    void motorStop(int speed);
    void motorLeft(int speed);
    void motorRight(int speed);
    void motorBackward(int speed);
    void motorForward(int speed);

private:
    int _pin1;
    int _pin2;
};

#endif
