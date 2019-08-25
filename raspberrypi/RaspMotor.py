# -*- coding: utf-8 -*-
import time, os
from DB import *
from utils import *
import RPi.GPIO as GPIO


halfstep_seq = [
  [1,0,0,0],
  [1,1,0,0],
  [0,1,0,0],
  [0,1,1,0],
  [0,0,1,0],
  [0,0,1,1],
  [0,0,0,1],
  [1,0,0,1]
]

def motor_control(operation, *args, **kwargs):
    GPIO.setmode(GPIO.BOARD)

    if (not operation):
        control = [15, 13, 11, 7]
        action = "down"

    else:
        control = [7, 11, 13, 15]
        action = "up"

    for pin in control:
        GPIO.setup(pin, GPIO.OUT)
        GPIO.output(pin, 0)
        print(pin)

    for i in range(765):
        for halfstep in range(8):
            for pin in range(4):
                GPIO.output(control[pin], halfstep_seq[halfstep][pin])
                time.sleep(0.001)


    GPIO.cleanup()
    
    if 'rfid' in kwargs:
        print("[!] Operation of " + action + " performed by RFID user " + str(kwargs['rfid']))
