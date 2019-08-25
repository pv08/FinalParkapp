# -*- coding: utf-8 -*-
import time, optparse
# from DB import Mongo
from RaspMotor import *
from utils import *

def manipulate_parking_lot(operation, user_id):
    RaspMotor.motor_control(operation, user_id)

def main():
    # Example: python parking_lot_manual_operation.py -o -u "10:77:33:45:21"
    # obs: se for -o fará com que a primeira vaga disponível fique indisponível
    #se for -c com o usuário feito, procurará a vaga e setará como disponíveç
    parser = optparse.OptionParser('usage%prog -o <open operation handle> -c <close operation handle> -u <user login>')
    parser.add_option('-o', '--open', dest = 'operation', action = 'store_true', default = True, help = 'specify the operation. open')
    parser.add_option('-c', '--close', dest = 'operation', action = 'store_false', help = 'specify the operation. close')
    parser.add_option('-u', '--user' ,dest = 'user', type = 'string', help = 'specify the user logged. the card')

    (options, args) = parser.parse_args()
    operation = options.operation
    user_id = options.user

    if (user_id is None):
        print(parser.usage)
        exit(0)
    print("operação de ", operation, " feita por ", user_id)
    manipulate_parking_lot(operation, user_id)

if __name__ == '__main__':
    main()
