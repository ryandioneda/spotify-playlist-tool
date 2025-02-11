
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import login, profile, playlists, tracks


app = FastAPI()

origins = [
    "http://localhost:5174",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(login.router)
app.include_router(profile.router)
app.include_router(playlists.router)
app.include_router(tracks.router)