# -*- coding: utf-8 -*-
# import RaspMotor

firebase_config = {
  "apiKey": "AIzaSyA-Uq6Zy_NXYIGO_TCzz9DL2yYuQTDdVZo",
  "authDomain": "parkappdb.firebaseapp.com",
  "databaseURL": "https://parkappdb.firebaseio.com",
  "storageBucket": "parkappdb.appspot.com",
  "serviceAccount": "C:/Firebase/parkappdb-firebase-adminsdk.json"
}


defaultPass = '123456'
class Util:
    # def setDefaultState():
    #     RaspMotor.motor_control(True, '')
    # def setConnectionPermission():
    #     return connection_permission
    def setDefaultFirebaseConfig():
        return firebase_config
