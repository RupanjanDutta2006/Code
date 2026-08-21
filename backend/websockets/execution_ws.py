import json
import asyncio
from typing import Dict, Optional
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from backend.executor.interactive_runner import InteractiveSession

router = APIRouter(tags=["Live Execution WebSocket"])

@router.websocket("/ws/execute")
async def websocket_execute(websocket: WebSocket):
    await websocket.accept()
    session: Optional[InteractiveSession] = None

    try:
        while True:
            data_text = await websocket.receive_text()
            try:
                msg = json.loads(data_text)
            except Exception:
                await websocket.send_json({"type": "error", "message": "Invalid JSON format."})
                continue

            action = msg.get("action") or msg.get("type")

            if action == "run" or action == "start":
                if session and session.is_running:
                    session.kill()

                language = msg.get("language", "python")
                source_code = msg.get("source_code", "")
                
                session = InteractiveSession(websocket, language, source_code)
                await session.start()

            elif action == "stdin" or action == "input":
                user_input = msg.get("data", "")
                if session and session.is_running:
                    await session.send_input(user_input)

            elif action == "kill" or action == "stop":
                if session:
                    session.kill()
                    session = None
                    await websocket.send_json({"type": "finished", "status": "terminated", "exit_code": 130})

    except WebSocketDisconnect:
        if session:
            session.kill()
    except Exception as e:
        if session:
            session.kill()
        try:
            await websocket.send_json({"type": "error", "message": str(e)})
        except Exception:
            pass
