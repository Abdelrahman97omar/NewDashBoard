import asyncio
import websockets
from websockets.exceptions import ConnectionClosedOK

url = "0.0.0.0"
port = 9876
connected_clients = set()  
async def handler(websocket):
    print("New client is connected.")
    connected_clients.add(websocket)
    while True:
        try:
            message = await websocket.recv()
            print(f"new message is recieved {message}")
            for client in connected_clients:
                if client != websocket: # prevent sending the message back to the sender
                    try:
                        if message == "true":
                            broadcast_msg = "1"
                        else:
                            broadcast_msg="0"
                        print("publishing", broadcast_msg)
                        await client.send(broadcast_msg)
                    except:
                        connected_clients.remove(client)

        except ConnectionClosedOK:
            break
        print(message)

async def main():
    async with websockets.serve(handler, url, port,ping_interval=None):
        print("WebSocket server running...")
        await asyncio.Future()  # run forever


asyncio.run(main())
