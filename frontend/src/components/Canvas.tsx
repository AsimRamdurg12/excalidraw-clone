import { useEffect, useRef, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import Toolbar from "./Toolbar";
import { Game } from "../draw/Game";

export type Tool = "pencil" | "rect" | "circle" | "move" | "eraser";

const Canvas = ({ roomId }: { roomId: string }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const { socket } = useSocket(roomId);

  const [game, setGame] = useState<Game>();

  const [selectedTool, setSelectedTool] = useState<Tool>("circle");

  useEffect(() => {
    game?.setTool(selectedTool);
  }, [selectedTool, game]);

  useEffect(() => {
    if (canvasRef.current) {
      const g = new Game(canvasRef.current, roomId, socket!);
      setGame(g);

      return () => {
        g.destroy();
      };
    }
  }, [canvasRef, roomId, socket]);

  if (!socket) {
    return <div>Connecting to server.....</div>;
  }

  return (
    <div className="flex overflow-hidden h-screen">
      <Toolbar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
      <canvas height={innerHeight} width={innerWidth} ref={canvasRef}></canvas>
    </div>
  );
};

export default Canvas;
