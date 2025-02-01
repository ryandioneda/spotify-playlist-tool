from fastapi import Cookie, HTTPException
import secrets

def generate_random_string(length: int) -> str:
    return secrets.token_urlsafe(length)[:length]
