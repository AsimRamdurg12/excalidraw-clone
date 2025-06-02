import { useEffect, useRef } from "react";
import { InitDraw } from "../draw/draw";
import { useSocket } from "../hooks/useSocket";

const Canvas = ({ roomId }: { roomId: string }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const { socket } = useSocket(roomId);

  console.log(socket);

  useEffect(() => {
    if (canvasRef.current) {
      InitDraw(canvasRef.current, roomId, socket!);
    }
  }, [canvasRef, roomId, socket]);

  if (!socket) {
    return <div>Connecting to server.....</div>;
  }

  return (
    <canvas
      height={window.innerHeight}
      width={window.innerWidth}
      ref={canvasRef}
    ></canvas>
  );
};

export default Canvas;
