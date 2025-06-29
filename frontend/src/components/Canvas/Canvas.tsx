import { useEffect, useRef, useState } from "react";
import { useSocket } from "../../hooks/useSocket";
import Toolbar from "./Toolbar";
import { Game } from "../../draw/Game";
import Palette from "./Palette";
import Zoom from "./Zoom";
import { useWindowSize } from "../../hooks/useWindowSize";

export type Style = "line" | "dotted" | "dashed";

export type Tool =
  | "pencil"
  | "rect"
  | "ellipse"
  | "line"
  | "arrow"
  | "text"
  | "eraser"
  | "hand"
  | "select";

const Canvas = ({ roomId }: { roomId: string }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const { socket } = useSocket(roomId);

  const size = useWindowSize();

  const [game, setGame] = useState<Game>();
  const [selectedTool, setSelectedTool] = useState<Tool>("hand");
  const [stroke, setStroke] = useState("#000000");
  const [color, setColor] = useState("transparent");
  const [strokeType, setStrokeType] = useState<Style>("line");
  const [lineWidth, setLineWidth] = useState(1);

  useEffect(() => {
    game?.setTool(selectedTool);
    game?.setPalette(stroke, color, strokeType, lineWidth);
  }, [selectedTool, game, stroke, color, strokeType, lineWidth]);

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
    <div className="relative flex overflow-hidden h-screen">
      <Palette
        stroke={stroke}
        setStroke={setStroke}
        color={color}
        setColor={setColor}
        strokeType={strokeType}
        setStrokeType={setStrokeType}
        lineWidth={lineWidth}
        setLineWidth={setLineWidth}
      />
      <Toolbar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
      <Zoom zoomIn={() => game?.zoomIn()} zoomOut={() => game?.zoomOut()} />
      <canvas height={size[1]} width={size[0]} ref={canvasRef}></canvas>
    </div>
  );
};

export default Canvas;
