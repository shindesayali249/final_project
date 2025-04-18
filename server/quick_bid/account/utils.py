from random import choice

def getOtp():
    L = list(range(0,10))
    otp = ""
    for i in range(4):
        otp += str(choice( L ))
    return otp
