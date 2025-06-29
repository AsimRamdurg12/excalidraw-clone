import { useEffect, useState } from "react";

export const useSocket = (roomId: string) => {
  const [socket, setSocket] = useState<WebSocket>();

  const token = localStorage.getItem("token");
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:3001?token=${token}`);

    ws.onopen = () => {
      setSocket(ws);

      const data = JSON.stringify({
        type: "join-room",
        roomId,
      });

      ws.send(data);
    };

    return () => {
      ws.onclose = () => {
        const data = JSON.stringify({
          type: "join-room",
          roomId,
        });

        ws.send(data);
      };
    };
  }, [roomId, token]);

  return { socket };
};
