from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import sqlite3

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database setup
def init_db():
    conn = sqlite3.connect("standups.db")
    cursor = conn.cursor()
    cursor.execute("""CREATE TABLE IF NOT EXISTS standups (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        yesterday TEXT,
        today TEXT,
        blockers TEXT
    )""")
    conn.commit()
    conn.close()

init_db()

class Standup(BaseModel):
    name: str
    yesterday: str
    today: str
    blockers: str

connections: List[WebSocket] = []

@app.post("/standup")
def create_standup(standup: Standup):
    conn = sqlite3.connect("standups.db")
    cursor = conn.cursor()
    cursor.execute("INSERT INTO standups (name, yesterday, today, blockers) VALUES (?, ?, ?, ?)",
                   (standup.name, standup.yesterday, standup.today, standup.blockers))
    conn.commit()
    conn.close()
    return {"status": "success"}

@app.get("/standups")
def get_standups():
    conn = sqlite3.connect("standups.db")
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, yesterday, today, blockers FROM standups")
    rows = cursor.fetchall()
    conn.close()
    return [{"id": r[0], "name": r[1], "yesterday": r[2], "today": r[3], "blockers": r[4]} for r in rows]

@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await ws.accept()
    connections.append(ws)
    try:
        while True:
            data = await ws.receive_text()
            for conn in connections:
                if conn != ws:
                    await conn.send_text(data)
    except:
        connections.remove(ws)
