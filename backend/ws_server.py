import asyncio
import json
import websockets
from websockets.exceptions import ConnectionClosedOK

url = "0.0.0.0"
port = 9876
connected_clients = set()  
# async def handler(websocket):
#     print("New client is connected.")
#     connected_clients.add(websocket)
#     while True:
#         try:
#             message = await websocket.recv()
#             message = json.loads(message)
#             value = message.get("/op_mode")
#             for client in connected_clients.copy():
#                 if client != websocket: # prevent sending the message back to the sender
#                     try:
#                         if value == "1":
#                             broadcast_msg = "1"
#                             print("Frim True publishing", broadcast_msg)
#                         else:
#                             broadcast_msg = "0"
#                             print("From False publishing", broadcast_msg)
#                         await client.send(broadcast_msg)
#                     except Exception as e:
#                         print("Failed to send the message due to:",e )
#                         connected_clients.remove(client)

#         except ConnectionClosedOK:
#             print("Client disconnected.")
#         finally:
#             connected_clients.remove(websocket)
async def handler(websocket):
    print("New client is connected.")
    connected_clients.add(websocket)
    try:
        while True:
            message = await websocket.recv()
            message = json.loads(message)
            value = message.get("/op_mode")
            print(f"Received message: {message} from client: {websocket.remote_address}")
            for client in connected_clients.copy():
                if client != websocket:  # prevent sending the message back to the sender
                    try:
                        if value == "1":
                            broadcast_msg = "1"
                            print("From True publishing", broadcast_msg)
                        else:
                            broadcast_msg = "0"
                            print("From False publishing", broadcast_msg)
                        await client.send(broadcast_msg)
                    except Exception as e:
                        print("Failed to send the message due to:", e)
                        connected_clients.remove(client)
    except ConnectionClosedOK:
        print("Client disconnected.")
    finally:
        print(f"Removing client: {websocket.remote_address}")
        connected_clients.remove(websocket)
async def main():
    async with websockets.serve(handler, url, port,ping_interval=None):
        print("WebSocket server running...")
        await asyncio.Future()  # run forever


asyncio.run(main())

