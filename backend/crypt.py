import bcrypt

def encode(password):
    crypt_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    return crypt_password

def check_crypt(password, crypt_password):
    return bcrypt.checkpw(password.encode("utf-8"), crypt_password.encode("utf-8"))