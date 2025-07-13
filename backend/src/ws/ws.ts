import { Server } from "http";
import { WebSocket, WebSocketServer } from "ws";
import checkUser from "../utils/utils";
import { prisma } from "../utils/prisma";

interface User {
  ws: WebSocket;
  id: string;
  rooms: number[];
}

const users: User[] = [];

const safeSend = (ws: WebSocket, data: string) => {
  if (ws.readyState === WebSocket.OPEN) {
    try {
      ws.send(data);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }
};

const removeUser = (ws: WebSocket) => {
  const index = users.findIndex((user) => user.ws === ws);
  if (index !== -1) {
    users.splice(index, 1);
    console.log(`User removed. Total users: ${users.length}`);
  }
};

const WebSocketSetup = (server: Server) => {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws, request) => {
    let userId: string | null = null;

    try {
      const url = request.url;
      if (!url) {
        ws.close();
        return;
      }

      const queryParams = new URLSearchParams(url.split("?")[1]);
      const token = queryParams.get("token");
      const id = checkUser(token!);

      if (!id) {
        ws.close();
        return;
      }

      userId = id;
      users.push({ id, rooms: [], ws });
      console.log(`User connected. Total users: ${users.length}`);

      ws.on("message", async (data) => {
        try {
          const parsedData = JSON.parse(data.toString());

          if (parsedData.type === "join-room") {
            const roomId = Number(parsedData.roomId);
            const user = users.find((u) => u.ws === ws);
            if (user && !user.rooms.includes(roomId)) {
              user.rooms.push(roomId);
              console.log(`User ${user.id} joined room ${roomId}`);
            }
          }

          if (parsedData.type === "leave-room") {
            const roomId = Number(parsedData.roomId);
            const user = users.find((u) => u.ws === ws);
            if (user) {
              user.rooms = user.rooms.filter((r) => r !== roomId);
              console.log(`User ${user.id} left room ${roomId}`);
            }
          }

          if (parsedData.type === "chat") {
            const roomId = Number(parsedData.roomId);
            const message = parsedData.message;

            const savedChat = await prisma.chat.create({
              data: {
                roomId,
                message,
                userId: id,
              },
            });

            const chatPayload = {
              type: "chat",
              message: {
                id: savedChat.id,
                message: savedChat.message,
                userId: savedChat.userId,
                roomId: savedChat.roomId,
                createdAt: savedChat.createdAt,
              },
            };

            users.forEach((user) => {
              if (user.rooms.includes(roomId)) {
                safeSend(user.ws, JSON.stringify(chatPayload));
              }
            });
          }

          if (parsedData.type === "shapes") {
            const roomId = parsedData.roomId;
            const message = parsedData.message;

            const shapeMessage = await prisma.shapes.create({
              data: {
                shape: message,
                roomId: Number(roomId),
                userId: id,
              },
            });

            users.forEach((user) => {
              if (user.rooms.includes(roomId)) {
                safeSend(
                  user.ws,
                  JSON.stringify({
                    type: "shapes",
                    message: shapeMessage,
                    roomId,
                    userId: id,
                  })
                );
              }
            });
          }

          if (parsedData.type === "update") {
            const roomId = parsedData.roomId;
            const shapeId = parsedData.message.id;
            const message = parsedData.message;

            const updatedShape = await prisma.shapes.update({
              where: {
                id: shapeId,
              },
              data: {
                shape: message.shape,
              },
            });

            // Broadcast to all users in the room (including sender)
            users.forEach((user) => {
              if (user.rooms.includes(roomId)) {
                safeSend(
                  user.ws,
                  JSON.stringify({
                    type: "update",
                    message: updatedShape,
                    roomId,
                    userId: id,
                  })
                );
              }
            });
          }
        } catch (error) {
          console.error(`Message error from ${userId}:`, error);
        }
      });

      ws.on("close", () => {
        console.log(`Client ${userId} disconnected`);
        removeUser(ws);
      });

      ws.on("error", (err) => {
        console.error("WebSocket error:", err);
        removeUser(ws);
      });
    } catch (err) {
      console.error("Connection error:", err);
      ws.close();
    }
  });
};

export default WebSocketSetup;
