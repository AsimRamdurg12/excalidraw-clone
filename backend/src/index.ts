import express, { Request, Response } from "express";
import cors from "cors";
import WebSocketSetup from "./ws/ws";
import { createServer } from "http";
import AuthRoutes from "./routes/AuthRoutes";
import RoomRoutes from "./routes/RoomRoutes";
import ChatRoutes from "./routes/ChatRoutes";
import ShapesRoutes from "./routes/ShapesRoutes";

const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

const httpServer = createServer(app);

WebSocketSetup(httpServer);

app.use("/api/auth", AuthRoutes);
app.use("/api/rooms", RoomRoutes);
app.use("/api/chats", ChatRoutes);
app.use("/api/shapes", ShapesRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Asim");
});

httpServer.listen(PORT);
