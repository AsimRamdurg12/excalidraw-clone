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

    ws.onerror = (error) => {
      console.error(error);
    };

    return () => {
      ws.onclose = () => {
        const data = JSON.stringify({
          type: "leave-room",
          roomId,
        });

        ws.send(data);
      };
    };
  }, [roomId, token]);

  return { socket };
};
