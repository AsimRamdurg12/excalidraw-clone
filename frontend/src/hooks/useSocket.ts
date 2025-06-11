import { useEffect, useState } from "react";

export const useSocket = (roomId: string) => {
  const [socket, setSocket] = useState<WebSocket>();

  useEffect(() => {
    const ws = new WebSocket(
      `ws://localhost:3001?token=eyJhbGciOiJIUzI1NiJ9.ZWRlYzA0ZjgtNDM2My00MTlhLTk2MGUtODNhOGQ0OWQzMDM5.R2MrLFSIHt_ImfWMfo8cbdf7NCRqSZ9Koew2hEXS-uo`
    );

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
  }, [roomId]);

  return { socket };
};
