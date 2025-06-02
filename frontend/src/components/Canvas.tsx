import { useEffect, useRef } from "react";
import { InitDraw } from "../draw/draw";

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      InitDraw(canvasRef.current);
    }
  }, [canvasRef]);

  return (
    <canvas
      height={window.innerHeight}
      width={window.innerWidth}
      ref={canvasRef}
    ></canvas>
  );
};

export default Canvas;
