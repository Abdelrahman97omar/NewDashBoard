import asyncio
import json
import websockets
from websockets.exceptions import ConnectionClosedOK

url = "0.0.0.0"
port = 9876
connected_clients = set()  

async def handler(websocket): # This will called and handle any new connection
    print("New client is connected.")
    connected_clients.add(websocket)
    try:
        while True:
            message = await websocket.recv()
            for client in connected_clients.copy():
                if client != websocket:  # prevent sending the message back to the sender
                    try:
                        await client.send(message)
                    except Exception as e:
                        print("Failed to send the message due to:", e)
                        connected_clients.remove(client)
    except ConnectionClosedOK:
        print("Client disconnected.")
    finally:
        connected_clients.remove(websocket)
async def main():
    async with websockets.serve(handler, url, port,ping_interval=None):
        print("WebSocket server running...")
        await asyncio.Future()  # run forever


asyncio.run(main())

