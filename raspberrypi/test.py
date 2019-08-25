from pyrebase import *

firebase_config = {
  "apiKey": "AIzaSyA-Uq6Zy_NXYIGO_TCzz9DL2yYuQTDdVZo",
  "authDomain": "parkappdb.firebaseapp.com",
  "databaseURL": "https://parkappdb.firebaseio.com",
  "storageBucket": "parkappdb.appspot.com",
  "serviceAccount": "C:/Firebase/parkappdb-firebase-adminsdk.json"
}
def firebaseConnection():
    firebase = pyrebase.initialize_app(firebase_config)
    database = firebase.database()
    users = database.child("Users").child("201510846").get()
    user = dict(users.val())
    print(user['car'])

def udpateSpotStatus(position):
    firebase = pyrebase.initialize_app(firebase_config)
    database = firebase.database()
    spots = dict(database.child("Spots").child(str(position)).get().val())
    print(spots)
    user = dict(database.child("Users").child('201510000').get().val())
    spot_update = database.child("Spots").child(str(position)).update({'status':'false', 'user': user})
    print(spot_update)


def main():
    udpateSpotStatus(0)

if __name__ == "__main__":
    main()
