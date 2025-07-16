import { useEffect, useState } from "react";

export const useSocket = (roomId: string) => {
  const [socket, setSocket] = useState<WebSocket>();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:3001?token=${token}`);

    ws.onopen = () => {
      setSocket(ws);
      ws.send(
        JSON.stringify({
          type: "join-room",
          roomId: Number(roomId),
        })
      );
    };
    return () => {
      try {
        ws.send(
          JSON.stringify({
            type: "leave-room",
            roomId: Number(roomId),
          })
        );
      } catch {
        console.warn("Could not send leave-room, socket already closed.");
      }
      ws.close();
    };
  }, [roomId, token]);

  return { socket };
};
