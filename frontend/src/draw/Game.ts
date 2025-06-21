import type { Tool } from "../components/Canvas/Canvas";
import { getExistingShapes } from "./http";

type AllShapes = {
  id?: number;
  roomId?: number;
  userId?: string;
  shape: Shape;
};

type Shape =
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
      points: { x: number; y: number }[];
    }
  | {
      type: "move";
      shape: Shape;
      offsetX: number;
      offsetY: number;
    }
  | {
      type: "eraser";
      shape: AllShapes;
    };

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private existingShapes: AllShapes[];
  private roomId: string;
  private clicked: boolean;
  private startX = 0;
  private startY = 0;
  private currentPencilStroke: { x: number; y: number }[] = [];
  private selectedTool: Tool = "circle";
  private socket: WebSocket;
  private activeShape: AllShapes | null = null;

  constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.existingShapes = [];
    this.roomId = roomId;
    this.socket = socket;

    this.clicked = false;
    this.init();
    this.initHandlers();
    this.initMousehandlers();
  }

  destroy() {
    this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
    this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
    this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
  }

  setTool(tool: Tool) {
    this.selectedTool = tool;
    if (this.selectedTool !== "move") {
      this.canvas.style.cursor = "crosshair";
    } else {
      this.canvas.style.cursor = "default";
    }
  }

  async init() {
    this.existingShapes = await getExistingShapes(this.roomId);
    this.clearCanvas();
  }

  initHandlers() {
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "shapes") {
        const parsedShapes = message.message;
        this.existingShapes.push(parsedShapes);

        this.clearCanvas();
      }
      if (message.type === "update") {
        const updatedShape = message.message;

        // Replace existing shape with the updated one
        this.existingShapes = this.existingShapes.map((shape) =>
          shape.id === updatedShape.id ? updatedShape : shape
        );

        this.clearCanvas();
      }
    };
  }

  drawShape(shape: Shape) {
    if (shape.type === "rect") {
      this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    } else if (shape.type === "circle") {
      this.ctx.beginPath();
      this.ctx.arc(
        shape.x,
        shape.y,
        shape.radius,
        shape.startAngle,
        shape.endAngle,
        shape.counterClockwise
      );
      this.ctx.stroke();
      this.ctx.closePath();
    } else if (shape.type === "pencil") {
      this.ctx.beginPath();
      this.ctx.moveTo(shape.points[0].x, shape.points[0].y);
      shape.points.forEach((point) => this.ctx.lineTo(point.x, point.y));
      this.ctx.stroke();
      this.ctx.closePath();
    }
  }

  drawOutline(shape: Shape) {
    if (shape.type === "rect") {
      this.ctx.save();
      this.ctx.setLineDash([5, 5]);
      this.ctx.strokeStyle = "blue";

      this.ctx.strokeRect(
        shape.x - 5,
        shape.y - 5,
        shape.width + 10,
        shape.height + 10
      );
    }
    this.ctx.setLineDash([]);
    this.ctx.strokeStyle = "black"; // Reset
    this.ctx.restore();
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.existingShapes.forEach((shape) => {
      this.drawShape(shape.shape);

      if (shape === this.activeShape && this.clicked) {
        this.drawOutline(this.activeShape.shape);
      }
    });
  }

  getMovedShape(movedshape: AllShapes): AllShapes | null {
    if (movedshape?.shape.type !== "move") return null;
    const { offsetX, offsetY, shape } = movedshape.shape;

    let updatedShape: Shape;

    if (shape.type === "rect") {
      updatedShape = {
        ...shape,
        x: shape.x + offsetX,
        y: shape.y + offsetY,
      };
    } else if (shape.type === "circle") {
      updatedShape = {
        ...shape,
        x: shape.x + offsetX,
        y: shape.y + offsetY,
      };
    } else if (shape.type === "pencil") {
      updatedShape = {
        ...shape,
        points: shape.points.map((point) => ({
          x: point.x + offsetX,
          y: point.y + offsetY,
        })),
      };
    } else {
      return null;
    }

    return {
      ...movedshape,
      shape: updatedShape,
    };
  }

  eraseShape(e: MouseEvent, shape: AllShapes) {
    const x = e.clientX;
    const y = e.clientY;

    return { shape, x, y };
  }

  mouseDownHandler = (e: MouseEvent) => {
    this.clicked = true;
    this.startX = e.clientX;
    this.startY = e.clientY;

    if (this.selectedTool === "pencil") {
      this.currentPencilStroke = [{ x: this.startX, y: this.startY }];
    }

    const shapeToMove = this.existingShapes.find((shape) => {
      if (shape?.shape.type === "rect") {
        return (
          this.startX >= shape?.shape.x &&
          this.startX <= shape?.shape.x + shape?.shape.width &&
          this.startY >= shape?.shape.y &&
          this.startY <= shape?.shape.y + shape?.shape.height
        );
      } else if (shape?.shape.type === "circle") {
        return (
          Math.hypot(
            this.startX - shape?.shape.x,
            this.startY - shape?.shape.y
          ) <= shape?.shape.radius
        );
      } else if (shape?.shape.type === "pencil") {
        return shape?.shape.points.some(
          (point) =>
            Math.hypot(this.startX - point.x, this.startY - point.y) <= 10
        );
      }

      return false;
    });

    if (this.selectedTool === "move") {
      console.log(shapeToMove);

      if (shapeToMove) {
        this.existingShapes = this.existingShapes.filter(
          (shape) => shape?.id !== shapeToMove?.id
        );

        this.activeShape = {
          ...shapeToMove,
          shape: {
            type: "move",
            shape: shapeToMove.shape,
            offsetX: 0,
            offsetY: 0,
          },
        };

        this.drawOutline(shapeToMove.shape);
      }
    } else if (this.selectedTool === "eraser") {
      this.eraseShape(e, this.activeShape!);
    } else if (this.selectedTool === "select") {
      if (shapeToMove) {
        this.activeShape = shapeToMove;
        this.drawOutline(shapeToMove.shape);
      }
    }
  };

  mouseUpHandler = (e: MouseEvent) => {
    this.clicked = false;
    const width = e.clientX - this.startX;
    const height = e.clientY - this.startY;

    const selectedTool = this.selectedTool;
    let shape: Shape | null = null;

    if (selectedTool === "rect") {
      shape = {
        type: "rect",
        x: this.startX,
        y: this.startY,
        width: width,
        height: height,
      };
    } else if (selectedTool === "circle") {
      const radius = Math.abs(Math.max(width, height) / 2);

      shape = {
        type: "circle",
        x: this.startX + radius,
        y: this.startY + radius,
        radius: radius,
        startAngle: 0,
        endAngle: 2 * Math.PI,
        counterClockwise: false,
      };
    } else if (
      selectedTool === "pencil" &&
      this.currentPencilStroke.length > 1
    ) {
      shape = {
        type: "pencil",
        points: this.currentPencilStroke,
      };
    } else if (selectedTool === "move") {
      this.canvas.style.cursor = "crosshair";
      const moveShape = this.activeShape;
      if (!moveShape || moveShape.shape.type !== "move") return;
      const finalShape = this.getMovedShape(moveShape);

      if (!finalShape) return;

      this.socket.send(
        JSON.stringify({
          type: "update",
          message: finalShape,
          roomId: this.roomId,
        })
      );

      this.existingShapes.push({
        ...finalShape,
        shape: finalShape.shape,
      });
      this.activeShape = null;

      this.clearCanvas();
    }

    if (!shape) return;

    this.socket.send(
      JSON.stringify({
        type: "shapes",
        message: shape,
        roomId: this.roomId,
      })
    );

    console.log(JSON.stringify(shape));
  };

  mouseMoveHandler = (e: MouseEvent) => {
    if (this.clicked) {
      const width = e.clientX - this.startX;
      const height = e.clientY - this.startY;
      const x = e.clientX;
      const y = e.clientY;

      this.clearCanvas();

      const selectedTool = this.selectedTool;

      if (selectedTool === "rect") {
        this.ctx.strokeRect(this.startX, this.startY, width, height);
      } else if (selectedTool === "circle") {
        const radius = Math.abs(Math.max(width, height) / 2);
        const centerX = this.startX + radius;
        const centerY = this.startY + radius;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        this.ctx.stroke();
        this.ctx.closePath();
      } else if (selectedTool === "pencil") {
        this.currentPencilStroke.push({ x, y });
        this.ctx.beginPath();
        this.ctx.moveTo(
          this.currentPencilStroke[0].x,
          this.currentPencilStroke[0].y
        );
        this.currentPencilStroke.forEach((point) =>
          this.ctx.lineTo(point.x, point.y)
        );
        this.ctx.stroke();
        this.ctx.closePath();
      } else if (selectedTool === "move" && this.activeShape) {
        if (this.activeShape?.shape.type === "move") {
          this.activeShape.shape.offsetX = x - this.startX;
          this.activeShape.shape.offsetY = y - this.startY;

          const movedShape = this.getMovedShape(this.activeShape);
          if (movedShape) {
            this.drawShape(movedShape.shape);
          }
        }
      }
    }
  };

  initMousehandlers() {
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
    this.canvas.addEventListener("mouseup", this.mouseUpHandler);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
  }
}
