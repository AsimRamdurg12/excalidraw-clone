import { useEffect, useRef } from "react";
import { Game } from "../draw/Game";
import { useSocket } from "../hooks/useSocket";

const CardCanvas = ({ roomId }: { roomId: string }) => {
  console.log(roomId);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { socket } = useSocket(roomId);

  useEffect(() => {
    if (!socket) return;
    const g = new Game(canvasRef.current!, roomId, socket);
    g.setTool("hand");
  }, [roomId, socket]);

  return (
    <div>
      <canvas ref={canvasRef} className="border"></canvas>
    </div>
  );
};

export default CardCanvas;
