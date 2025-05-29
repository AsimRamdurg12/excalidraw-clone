import express, { Request, Response } from "express";
import WebSocketSetup from "./ws/ws";
import { createServer } from "http";
import AuthRoutes from "./routes/AuthRoutes";
import RoomRoutes from "./routes/RoomRoutes";
import ChatRoutes from "./routes/ChatRoutes";

const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.json());

const httpServer = createServer(app);

WebSocketSetup(httpServer);

app.use("/api/auth", AuthRoutes);
app.use("/api/rooms", RoomRoutes);
app.use("/api/chats", ChatRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Asim");
});

httpServer.listen(PORT);
