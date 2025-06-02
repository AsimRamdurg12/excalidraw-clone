import axios from "axios";

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

export const InitDraw = async (
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket
) => {
  const ctx = canvas.getContext("2d");
  let clicked = false;
  let startX = 0;
  let startY = 0;

  const existingShapes: shape[] = await getExistingShapes(roomId);

  console.log(existingShapes);

  if (!ctx) return;

  socket.onmessage = (event) => {
    const message = event.data;

    if (message.type === "shapes") {
      const parsedShapes = JSON.parse(message.message);
      existingShapes?.push(parsedShapes);
      clearCanvas(existingShapes, canvas, ctx);
    }
  };

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

    const shape: shape = {
      type: "circle",
      x: startX,
      y: startY,
      radius: radius,
      startAngle: 0,
      endAngle: 2 * Math.PI,
      counterClockwise: false,
    };

    existingShapes?.push(shape);

    socket.send(
      JSON.stringify({
        type: "shapes",
        message: shape,
        roomId,
      })
    );
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
  existingShapes?.map((shape) => {
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

async function getExistingShapes(roomId: string) {
  try {
    const response = await axios.get(`/api/shapes/room/${roomId}`);
    const message = await response.data.message;

    const shapes = message?.map((x: { message: string }) => {
      const messageData = JSON.parse(x.message);
      return messageData;
    });

    return shapes;
  } catch (error) {
    console.error(`Error in FE getExistingShapes: ${error}`);
  }
}
