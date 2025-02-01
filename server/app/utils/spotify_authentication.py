from fastapi import Cookie, HTTPException
import secrets

def generate_random_string(length: int) -> str:
    return secrets.token_urlsafe(length)[:length]

async def get_current_user(access_token: str = Cookie(None)):
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return access_token