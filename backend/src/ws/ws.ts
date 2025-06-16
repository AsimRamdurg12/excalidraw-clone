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

const WebSocketSetup = (server: Server) => {
  const wss = new WebSocketServer({ server: server });

  wss.on("connection", (ws, request) => {
    try {
      ws.on("error", console.error);

      const url = request.url;
      if (!url) return;

      const queryParams = new URLSearchParams(url.split("?")[1]);
      const token = queryParams.get("token");
      const id = checkUser(token!);

      if (id === null) {
        ws.close();
        return;
      }

      users.push({
        id,
        rooms: [],
        ws,
      });
      try {
        ws.on("message", async (data) => {
          let parsedData = JSON.parse(data.toString());

          if (parsedData.type === "join-room") {
            const user = users.find((x) => x.ws === ws);
            user?.rooms.push(parsedData.roomId);
          }

          if (parsedData.type === "leave-room") {
            const user = users.find((x) => x.ws === ws);
            if (!user) {
              return;
            }

            user.rooms = user.rooms.filter((x) => x !== parsedData.roomId);
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

            users.forEach((user) => {
              if (user.rooms.includes(roomId)) {
                user.ws.send(
                  JSON.stringify({
                    type: "chat",
                    message: message,
                    roomId,
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
                user.ws.send(
                  JSON.stringify({
                    type: "shapes",
                    message: shapeMessage,
                    roomId,
                  })
                );
              }
            });
          }

          if (parsedData.type === "update") {
            const roomId = parsedData.roomId;
            const shapeId = parsedData.message.id;
            const message = parsedData.message;

            await prisma.shapes.update({
              where: {
                id: shapeId,
              },
              data: {
                shape: message.shape,
              },
            });

            users.forEach((user) => {
              if (user.rooms.includes(roomId)) {
                user.ws.send(
                  JSON.stringify({
                    type: "update",
                    message: message,
                    roomId,
                  })
                );
              }
            });
          }
        });
      } catch (error) {
        console.log(`Error in ws.message: ${error}`);
        return;
      }

      ws.on("close", () => {
        console.log("Client disconnected");
      });
    } catch (error) {
      console.error("Error parsing data:", error);
      return;
    }
  });
};

export default WebSocketSetup;
