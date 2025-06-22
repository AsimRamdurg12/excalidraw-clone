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
  private isMoving: boolean;
  private isResizing: boolean;
  private initialX = 0;
  private initialY = 0;
  private originalShape: Shape | null = null;

  constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.existingShapes = [];
    this.roomId = roomId;
    this.socket = socket;

    this.clicked = false;
    this.isMoving = false;
    this.isResizing = false;
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
    if (this.selectedTool !== "select") {
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

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.existingShapes.forEach((shape) => {
      this.drawShape(shape.shape);
    });
  }

  onEdge(x: number, y: number, shape: Shape) {
    const t = 10;
    switch (shape.type) {
      case "rect":
        return (
          Math.abs(x - shape.x) < t ||
          Math.abs(x - shape.x + shape.width) < t ||
          Math.abs(y - shape.y) < t ||
          Math.abs(y - shape.y + shape.height) < t
        );

      case "circle":
        return (
          Math.abs(Math.hypot(x - shape.x, y - shape.y) - shape.radius) < t
        );

      case "pencil": {
        const px = shape.points.map((s) => s.x);
        const py = shape.points.map((s) => s.y);

        const minX = Math.min(...px);
        const minY = Math.min(...py);
        const maxX = Math.max(...px);
        const maxY = Math.max(...py);

        return (
          Math.abs(x - minX) < t ||
          Math.abs(x - maxX) < t ||
          Math.abs(y - minY) < t ||
          Math.abs(y - maxY) < t
        );
      }

      default:
        return false;
    }
  }

  insideShape(x: number, y: number, shape: Shape) {
    if (shape.type === "rect") {
      return (
        x >= shape.x &&
        x <= shape.x + shape.width &&
        y >= shape.y &&
        y <= shape.y + shape.height
      );
    } else if (shape.type === "circle") {
      return Math.hypot(x - shape.x, y - shape.y) <= shape.radius;
    } else if (shape.type === "pencil") {
      return shape.points.some((p) => Math.hypot(x - p.x, y - p.y) < 10);
    }
    return false;
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

  mouseDownHandler = (e: MouseEvent) => {
    this.clicked = true;
    this.startX = e.clientX;
    this.startY = e.clientY;

    if (this.selectedTool === "pencil") {
      this.currentPencilStroke = [{ x: this.startX, y: this.startY }];
    }

    this.initialX = e.clientX;
    this.initialY = e.clientY;

    if (this.selectedTool === "select") {
      for (const shape of this.existingShapes) {
        if (this.onEdge(this.initialX, this.initialY, shape.shape)) {
          this.activeShape = shape;
          this.originalShape = JSON.parse(JSON.stringify(shape.shape)); // deep copy
          this.isResizing = true;
          return;
        }
        if (this.insideShape(this.initialX, this.initialY, shape.shape)) {
          this.activeShape = shape;
          this.originalShape = JSON.parse(JSON.stringify(shape.shape)); // deep copy
          this.isMoving = true;
          return;
        }
      }
    }
  };

  mouseUpHandler = (e: MouseEvent) => {
    this.clicked = false;
    this.clicked = false;
    this.isMoving = false;
    this.isResizing = false;
    this.originalShape = null;
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
    } else if (selectedTool === "select") {
      if (this.activeShape) {
        this.socket.send(
          JSON.stringify({
            type: "update",
            message: this.activeShape,
            roomId: this.roomId,
          })
        );
      }
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
    if (!this.clicked) return;

    const x = e.clientX;
    const y = e.clientY;
    const dx = x - this.initialX;
    const dy = y - this.initialY;

    this.clearCanvas();

    if (
      this.selectedTool === "select" &&
      this.activeShape &&
      this.originalShape
    ) {
      const shape = this.activeShape.shape;

      if (this.isMoving) {
        if (shape.type === "rect" && this.originalShape.type === "rect") {
          shape.x = this.originalShape.x + dx;
          shape.y = this.originalShape.y + dy;
        } else if (
          shape.type === "circle" &&
          this.originalShape.type === "circle"
        ) {
          shape.x = this.originalShape.x + dx;
          shape.y = this.originalShape.y + dy;
        } else if (
          shape.type === "pencil" &&
          this.originalShape.type === "pencil"
        ) {
          shape.points = this.originalShape.points.map((p) => ({
            x: p.x + dx,
            y: p.y + dy,
          }));
        }
      }

      if (this.isResizing) {
        if (shape.type === "rect" && this.originalShape.type === "rect") {
          shape.x = this.originalShape.x;
          shape.y = this.originalShape.y;
          shape.width = this.originalShape.width + dx;
          shape.height = this.originalShape.height + dy;
        } else if (
          shape.type === "circle" &&
          this.originalShape.type === "circle"
        ) {
          shape.radius = this.originalShape.radius + Math.hypot(dx, dy) / 2;
        }
      }

      this.clearCanvas();
    }

    // Drawing tools
    if (this.selectedTool === "rect") {
      this.ctx.strokeRect(this.startX, this.startY, dx, dy);
    } else if (this.selectedTool === "circle") {
      const radius = Math.abs(Math.max(dx, dy) / 2);
      const centerX = this.startX + radius;
      const centerY = this.startY + radius;
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
      this.ctx.stroke();
      this.ctx.closePath();
    } else if (this.selectedTool === "pencil") {
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
    }
  };

  initMousehandlers() {
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
    this.canvas.addEventListener("mouseup", this.mouseUpHandler);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
  }
}
