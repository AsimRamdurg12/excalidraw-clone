type shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      x: number;
      y: number;
      radius: number;
      startAngle: number;
      endAngle: number;
      counterClockwise: boolean;
    }
  | {
      type: "pencil";
      startX: number;
      startY: number;
      endX: number;
      endY: number;
    };

export const InitDraw = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext("2d");
  let clicked = false;
  let startX = 0;
  let startY = 0;

  const existingShapes: shape[] = [];

  canvas.addEventListener("mousedown", (e) => {
    clicked = true;
    startX = e.clientX;
    startY = e.clientY;
  });

  canvas.addEventListener("mouseup", (e) => {
    clicked = false;
    const width = e.clientX - startX;
    const height = e.clientY - startY;

    const radius = Math.max(width, height) / 2;

    existingShapes.push({
      type: "circle",
      x: startX,
      y: startY,
      radius: radius,
      startAngle: 0,
      endAngle: 2 * Math.PI,
      counterClockwise: false,
    });
  });

  canvas.addEventListener("mousemove", (e) => {
    if (clicked) {
      const width = e.clientX - startX;
      const height = e.clientY - startY;
      const radius = Math.max(width, height) / 2;

      clearCanvas(existingShapes, canvas, ctx!);
      ctx?.beginPath();
      ctx?.arc(startX, startY, radius, 0, 2 * Math.PI, false);
      ctx?.stroke();
      ctx?.closePath();
    }
  });
};

function clearCanvas(
  existingShapes: shape[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) {
  ctx?.clearRect(0, 0, canvas.width, canvas.height);
  existingShapes.map((shape) => {
    if (shape.type === "rect") {
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    } else if (shape.type === "circle") {
      ctx.beginPath();
      ctx.arc(
        shape.x,
        shape.y,
        shape.radius,
        shape.startAngle,
        shape.endAngle,
        shape.counterClockwise
      );
      ctx.stroke();
    } else {
      ctx.strokeRect(shape.startX, shape.startY, shape.endX, shape.endY);
    }
  });
}

function getExistingShapes(roomId: string) {}
