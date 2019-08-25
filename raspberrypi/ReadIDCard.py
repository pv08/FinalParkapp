import RPi.GPIO as GPIO
import signal, time, MFRC522
from RaspMotor import *
from firebase import *
from utils import *

MIFAREReader = MFRC522.MFRC522()

Util.setDefaultState()
print ("Press Ctrl-C to stop.")
continue_reading = True
GPIO.setwarnings(False)

def main():
    try:
        while continue_reading:
            (status,TagType) = MIFAREReader.MFRC522_Request(MIFAREReader.PICC_REQIDL)
            if status == MIFAREReader.MI_OK:
                print ("Card detected")

            (status,uid) = MIFAREReader.MFRC522_Anticoll()
            if status == MIFAREReader.MI_OK:
                time.sleep(1)
                print ("Card read UID: %s,%s,%s,%s,%s" % (uid[0], uid[1], uid[2], uid[3], uid[4]))
                # key = [0xFF,0xFF,0xFF,0xFF,0xFF,0xFF]
                MIFAREReader.MFRC522_SelectTag(uid)

                rfid = str(uid).replace(', ', ':')
                for char in "[]":
                    rfid = rfid.replace(char, '')

                print(rfid)
                if FirebaseDB.getRFID(rfid) and FirebaseDB.verifySpotVacancy():
                        if FirebaseDB.getRFIDUsability(rfid): #pesqwuisa se existe de fato o usuários
                            print("existe usuário e existe ele nas vagas")
                            FirebaseDB.searchSpot(rfid)
                            print("Balizador abaixa para ele")
                            RaspMotor.motor_control(False, rfid=rfid)
                            time.sleep(5)
                            Util.setDefaultState()
                        else:
                            print("existe usuário, mas ele não está no estacionamento")
                            FirebaseDB.searchSpot(rfid)
                            print("Balizador abaixa para ele")
                            RaspMotor.motor_control(False, rfid=rfid)
                            time.sleep(5)
                            Util.setDefaultState()
                else:
                    print("usuário não existe ou não há vaga para ele")

    finally:
        GPIO.cleanup()

if __name__ == "__main__":
    main()
