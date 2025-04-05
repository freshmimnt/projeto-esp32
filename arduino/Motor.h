#ifndef Motor_h
#define Motor_h

#include "Arduino.h"

class Motor
{
public:
    Motor(int pin1, int pin2);
    void motorMoving();
    void motorStop();
    void motorLeft();
    void motorRight();

private:
    int _pin1;
    int _pin2;
};

#endif