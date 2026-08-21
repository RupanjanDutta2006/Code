import json
from typing import Dict, List, Set
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from backend.database.database import SessionLocal
from backend.models import PlaygroundSession
from backend.executor.execution_service import execution_service

router = APIRouter(tags=["Collaborative Playground WebSocket"])

class PlaygroundRoomManager:
    def __init__(self):
        # room_id -> list of (websocket, client_id, user_name, color)
        self.rooms: Dict[str, List[Dict]] = {}
        # room_id -> latest code
        self.room_code: Dict[str, str] = {}
        self.room_lang: Dict[str, str] = {}

    async def connect(self, room_id: str, websocket: WebSocket, client_id: str, user_name: str, color: str):
        await websocket.accept()
        if room_id not in self.rooms:
            self.rooms[room_id] = []
            # Load initial state from DB
            db = SessionLocal()
            try:
                session = db.query(PlaygroundSession).filter(PlaygroundSession.id == room_id).first()
                if session:
                    self.room_code[room_id] = session.source_code
                    self.room_lang[room_id] = session.language
                else:
                    self.room_code[room_id] = ""
                    self.room_lang[room_id] = "python"
            finally:
                db.close()

        client_info = {
            "ws": websocket,
            "id": client_id,
            "name": user_name,
            "color": color
        }
        self.rooms[room_id].append(client_info)

        # Send current state to newly joined user
        await websocket.send_json({
            "type": "init",
            "code": self.room_code.get(room_id, ""),
            "language": self.room_lang.get(room_id, "python"),
            "peers": [
                {"id": c["id"], "name": c["name"], "color": c["color"]}
                for c in self.rooms[room_id]
            ]
        })

        # Broadcast new user to others
        await self.broadcast(room_id, {
            "type": "user_joined",
            "user": {"id": client_id, "name": user_name, "color": color}
        }, exclude_ws=websocket)

    def disconnect(self, room_id: str, websocket: WebSocket, client_id: str):
        if room_id in self.rooms:
            self.rooms[room_id] = [c for c in self.rooms[room_id] if c["ws"] != websocket]
            if not self.rooms[room_id]:
                # Persist final code to DB
                db = SessionLocal()
                try:
                    session = db.query(PlaygroundSession).filter(PlaygroundSession.id == room_id).first()
                    if session and room_id in self.room_code:
                        session.source_code = self.room_code[room_id]
                        session.language = self.room_lang.get(room_id, session.language)
                        db.commit()
                finally:
                    db.close()

    async def broadcast(self, room_id: str, message: dict, exclude_ws: WebSocket = None):
        if room_id in self.rooms:
            dead_clients = []
            for client in self.rooms[room_id]:
                ws = client["ws"]
                if ws != exclude_ws:
                    try:
                        await ws.send_json(message)
                    except Exception:
                        dead_clients.append(client)
            for dc in dead_clients:
                self.rooms[room_id].remove(dc)

room_manager = PlaygroundRoomManager()

@router.websocket("/ws/playground/{room_id}")
async def websocket_playground(websocket: WebSocket, room_id: str):
    client_id = None
    try:
        # First message should be handshake with user info
        init_data = await websocket.receive_text()
        init_msg = json.loads(init_data)
        client_id = init_msg.get("clientId", "anon")
        user_name = init_msg.get("name", "Student")
        color = init_msg.get("color", "#3b82f6")

        await room_manager.connect(room_id, websocket, client_id, user_name, color)

        while True:
            raw = await websocket.receive_text()
            msg = json.loads(raw)
            msg_type = msg.get("type")

            if msg_type == "code_change":
                code = msg.get("code", "")
                room_manager.room_code[room_id] = code
                await room_manager.broadcast(room_id, {
                    "type": "code_change",
                    "code": code,
                    "senderId": client_id
                }, exclude_ws=websocket)

            elif msg_type == "language_change":
                lang = msg.get("language", "python")
                room_manager.room_lang[room_id] = lang
                await room_manager.broadcast(room_id, {
                    "type": "language_change",
                    "language": lang,
                    "senderId": client_id
                }, exclude_ws=websocket)

            elif msg_type == "cursor":
                await room_manager.broadcast(room_id, {
                    "type": "cursor",
                    "senderId": client_id,
                    "cursor": msg.get("cursor")
                }, exclude_ws=websocket)

            elif msg_type == "run_code":
                # Execute shared code and broadcast output to all in room
                code = room_manager.room_code.get(room_id, "")
                lang = room_manager.room_lang.get(room_id, "python")
                custom_input = msg.get("custom_input", "")

                await room_manager.broadcast(room_id, {
                    "type": "run_started",
                    "senderName": user_name
                })

                result = execution_service.execute(
                    language=lang,
                    source_code=code,
                    custom_input=custom_input,
                    use_cache=False
                )

                await room_manager.broadcast(room_id, {
                    "type": "run_finished",
                    "status": result.status,
                    "output": result.output,
                    "error": result.error,
                    "execution_time_ms": result.execution_time_ms
                })

    except WebSocketDisconnect:
        if client_id:
            room_manager.disconnect(room_id, websocket, client_id)
            await room_manager.broadcast(room_id, {
                "type": "user_left",
                "clientId": client_id
            })
    except Exception as e:
        if client_id:
            room_manager.disconnect(room_id, websocket, client_id)
