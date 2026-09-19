from datetime import datetime, timedelta, timezone
from jose import jwt
from cryptography.fernet import Fernet
from ..config import settings

fernet = Fernet(settings.token_encryption_key.encode())

def encrypt(value: str) -> str: return fernet.encrypt(value.encode()).decode()
def decrypt(value: str) -> str: return fernet.decrypt(value.encode()).decode()
def make_session(user_id: int):
    return jwt.encode({"sub": str(user_id), "exp": datetime.now(timezone.utc)+timedelta(days=7)}, settings.jwt_secret, algorithm="HS256")
def decode_session(token: str): return jwt.decode(token, settings.jwt_secret, algorithms=["HS256"])
