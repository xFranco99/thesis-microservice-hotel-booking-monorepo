import random
import string

def generate_otp_code():
    # generate a 6 char code like: U911K4
    return ''.join(random.SystemRandom().choice(string.ascii_uppercase + string.digits) for _ in range(6))