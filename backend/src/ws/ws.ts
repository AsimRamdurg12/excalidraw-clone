import { Server } from "http";
import { WebSocket, WebSocketServer } from "ws";
import checkUser from "../utils/utils";
import { prisma } from "../utils/prisma";

interface User {
  ws: WebSocket;
  id: string;
  rooms: string[];
}

const users: User[] = [];

// Helper function to safely send messages
const safeSend = (ws: WebSocket, data: string) => {
  if (ws.readyState === WebSocket.OPEN) {
    try {
      ws.send(data);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }
};

// Helper function to remove user from users array
const removeUser = (ws: WebSocket) => {
  const index = users.findIndex((user) => user.ws === ws);
  if (index !== -1) {
    users.splice(index, 1);
    console.log(`User removed. Total users: ${users.length}`);
  }
};

const WebSocketSetup = (server: Server) => {
  const wss = new WebSocketServer({ server: server });

  wss.on("connection", (ws, request) => {
    let userId: string | null = null;

    try {
      ws.on("error", (error) => {
        console.error("WebSocket error:", error);
        removeUser(ws);
      });

      const url = request.url;
      if (!url) {
        ws.close();
        return;
      }

      const queryParams = new URLSearchParams(url.split("?")[1]);
      const token = queryParams.get("token");
      const id = checkUser(token!);

      if (id === null) {
        ws.close();
        return;
      }

      userId = id;

      users.push({
        id,
        rooms: [],
        ws,
      });

      console.log(`User connected. Total users: ${users.length}`);

      ws.on("message", async (data) => {
        try {
          let parsedData = JSON.parse(data.toString());

          if (parsedData.type === "join-room") {
            const user = users.find((x) => x.ws === ws);
            if (user && !user.rooms.includes(parsedData.roomId)) {
              user.rooms.push(parsedData.roomId);
              console.log(`User ${user.id} joined room ${parsedData.roomId}`);
            }
          }

          if (parsedData.type === "leave-room") {
            const user = users.find((x) => x.ws === ws);
            if (user) {
              user.rooms = user.rooms.filter((x) => x !== parsedData.roomId);
              console.log(`User ${user.id} left room ${parsedData.roomId}`);
            }
          }

          if (parsedData.type === "chat") {
            const roomId = parsedData.roomId;
            const message = parsedData.message;

            await prisma.chat.create({
              data: {
                roomId: Number(roomId),
                message,
                userId: id,
              },
            });

            // Broadcast to all users in the room (including sender)
            users.forEach((user) => {
              if (user.rooms.includes(roomId)) {
                safeSend(
                  user.ws,
                  JSON.stringify({
                    type: "chat",
                    message: message,
                    roomId,
                    userId: id, // Include sender info
                  })
                );
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
          console.error(`Error processing message from user ${userId}:`, error);
        }
      });

      ws.on("close", () => {
        console.log(`Client ${userId} disconnected`);
        removeUser(ws);
      });
    } catch (error) {
      console.error("Error in connection setup:", error);
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    }
  });
};

export default WebSocketSetup;
