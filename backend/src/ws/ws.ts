import { Server } from "http";
import { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";

const WebSocketSetup = (server: Server) => {
  const wss = new WebSocketServer({ server: server });

  wss.on("connection", (ws, request) => {
    try {
      ws.on("error", console.error);

      const url = request.url;
      if (!url) return;

      const queryParams = new URLSearchParams(url.split("?")[1]);
      const token = queryParams.get("token");
      const decode = jwt.verify(token!, process.env.JWT_SECRET as string);

      if (!decode || !(decode as JwtPayload).id) {
        ws.close();
        return;
      }

      ws.on("message", (data) => {
        ws.send(data.toString());
      });

      ws.on("close", () => {
        console.log("Client disconnected");
      });
    } catch (error) {
      console.error("Error parsing data:", error);
    }
  });
};

export default WebSocketSetup;
