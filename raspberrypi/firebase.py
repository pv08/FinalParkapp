# -*- coding: utf-8 -*-
from pyrebase import *
from utils import *
class FirebaseDB:
    def getRFID(rfid):
        firebase = pyrebase.initialize_app(Util.setDefaultFirebaseConfig())
        database = firebase.database()
        users = database.child("Users").get()
        for user in users.each():
            current_user = user.val()
            if current_user['rfid'] == rfid:
                print(current_user)
                return True
            return False

    def getRFIDUsability(rfid):
        firebase = pyrebase.initialize_app(Util.setDefaultFirebaseConfig())
        database = firebase.database()

        spots = database.child("Spots").get()
        for spot in spots.each():
            current_spot = spot.val()
            user_spot = current_spot['user']
            if user_spot['rfid'] == rfid:
                print("O usuário " + rfid + " se encontra no estacionamento")
                return True
            print("O usuário " + rfid + " não se encontra no estacionamento")
            return False

    def verifySpotVacancy():
        count = 0
        firebase = pyrebase.initialize_app(Util.setDefaultFirebaseConfig())
        database = firebase.database()
        spots = database.child("Spots").get()
        for spot in spots.each():
            current_spot = spot.val()
            if current_spot['status']:
                count = count + 1
        if count > 0:
            return True
        else:
            return False


    def getVacancyUser():
        firebase = pyrebase.initialize_app(Util.setDefaultFirebaseConfig())
        database = firebase.database()
        user = dict(database.child("Users").child("201510000").get().val())
        print(user)
        return user
    def getUserObj(rfid):
        firebase = pyrebase.initialize_app(Util.setDefaultFirebaseConfig())
        database = firebase.database()
        users = database.child("Users").get()
        for user in users.each():
            current_user = user.val()

            if current_user['rfid'] == rfid:
                print(current_user)
                return current_user



    def searchSpot(rfid):
        firebase = pyrebase.initialize_app(Util.setDefaultFirebaseConfig())
        database = firebase.database()

        if getRFIDUsability(rfid):
            spots = database.child("Spots").get()
            for spot in spots.each():
                current_spot = spot.val()
                user_spot = current_spot['user']
                if user_spot['rfid'] == rfid:
                    print("RFID: " + user_spot['rfid'] + " na vaga " + current_spot['position'] + ". Então ele sai do estacionamento")
                    operateVacancy(current_spot['position'], getVacancyUser(), True)
                    break
        else:
            spots = database.child("Spots").get()
            for spot in spots.each():
                current_spot = spot.val()
                if current_spot['status']:
                    print("RFID: " + rfid + " não está no estacionamento. Então pega a vaga " + current_spot['position'] + " para ele entrar")
                    operateVacancy(current_spot['position'], getUserObj(rfid), False)
                    break

    def operateVacancy(position, rfid, newState):
        print("Alterar a posição " + position + " para usuario " + str(rfid) + " colocando " + str(newState))

        firebase = pyrebase.initialize_app(Util.setDefaultFirebaseConfig())
        database = firebase.database()
        spots = database.child("Spots").get()
        if not newState:
            for spot in spots.each():
                current_spot = spot.val()
                if current_spot['position'] == position:
                    database.child("Spots").child(position).update({"user": rfid, "status": newState})
                    print("Spot " + current_spot['position'] + " updated para " + str(newState))
                    print("Spot ocupado agora")
        else:
            for spot in spots.each():
                current_spot = spot.val()
                if current_spot['position'] == position:
                    database.child("Spots").child(position).update({"user": rfid, "status": newState})
                    print("Spot " + current_spot['position'] + " updated para " + str(newState))
                    print("Spot livre agora")
