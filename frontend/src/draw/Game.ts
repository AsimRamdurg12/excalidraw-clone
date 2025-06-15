import type { Tool } from "../components/Canvas";
import { getExistingShapes } from "./http";

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
      x: number;
      y: number;
      width: number;
      height: number;
    };

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private existingShapes: Shape[];
  private roomId: string;
  private clicked: boolean;
  private startX = 0;
  private startY = 0;
  private currentPencilStroke: { x: number; y: number }[] = [];
  private activeShape: Shape | null = null;
  private selectedTool: Tool = "circle";
  private socket: WebSocket;

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
  }

  async init() {
    this.existingShapes = await getExistingShapes(this.roomId);
    this.clearCanvas();
  }

  initHandlers() {
    this.socket.onmessage = (event) => {
      const message = event.data;

      if (message.type === "shapes") {
        const parsedShapes = message.message;
        this.existingShapes.push(parsedShapes.shape);
        this.clearCanvas();
      }
    };
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.existingShapes.map((shape) => {
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
      } else if (shape.type === "pencil" && shape.points) {
        this.ctx.beginPath();
        this.ctx.moveTo(shape.points[0].x, shape.points[0].y);
        shape.points.forEach((point) => this.ctx.lineTo(point.x, point.y));
        this.ctx.stroke();
        this.ctx.closePath();
      }
    });
  }

  mouseInShape(movedshape: Shape & { type: "move" }): Shape {
    const { offsetX, offsetY, shape } = movedshape;

    switch (shape.type) {
      case "rect":
        return {
          ...shape,
          x: shape.x + offsetX,
          y: shape.y + offsetY,
        };
      case "circle":
        return {
          ...shape,
          x: shape.x + offsetX,
          y: shape.y + offsetY,
        };
      case "pencil":
        return {
          ...shape,
          points: shape.points.map((point) => ({
            x: point.x + offsetX,
            y: point.y + offsetY,
          })),
        };
      default:
        return shape;
    }
  }

  mouseDownHandler = (e: MouseEvent) => {
    this.clicked = true;
    this.startX = e.clientX;
    this.startY = e.clientY;

    if (this.selectedTool === "move") {
      const shapeToMove = this.existingShapes.reverse().find((shape) => {
        if (shape.type === "rect") {
          return (
            this.startX >= shape.x &&
            this.startX <= shape.x + shape.width &&
            this.startY >= shape.y &&
            this.startY <= shape.y + shape.height
          );
        } else if (shape.type === "circle") {
          return (
            Math.hypot(this.startX - shape.x, this.startY - shape.y) <=
            shape.radius
          );
        } else if (shape.type === "pencil") {
          return shape.points.some(
            (point) =>
              Math.hypot(this.startX - point.x, this.startY - point.y) <= 10
          );
        }
        return false;
      });

      if (shapeToMove) {
        this.existingShapes = this.existingShapes.filter(
          (shape) => shape != shapeToMove
        );
        const moveShape = {
          type: "move" as const,
          shape: shapeToMove,
          offsetX: 0,
          offsetY: 0,
        };

        this.activeShape = moveShape;
        this.existingShapes.push(moveShape);
        this.clearCanvas();
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
      const moveShape = this.activeShape as Shape & { type: "move" };
      const finalShape = this.mouseInShape(moveShape);

      this.existingShapes = this.existingShapes.filter(
        (shape) => shape !== moveShape
      );
      this.existingShapes.push(finalShape);

      // this.socket.send(
      //   JSON.stringify({
      //     type: "shapes",
      //     message: JSON.stringify({
      //       type: "update",
      //       shapes: this.existingShapes,
      //     }),
      //     roomId: this.roomId,
      //   })
      // );
      this.activeShape = null;
      this.clearCanvas();
      return;
    }

    if (!shape) return;

    this.existingShapes.push(shape);

    this.socket.send(
      JSON.stringify({
        type: "shapes",
        message: shape,
        roomId: this.roomId,
      })
    );
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
        this.clearCanvas();
        const moveShape = this.activeShape as Shape & { type: "move" };
        moveShape.offsetX = x - this.startX;
        moveShape.offsetY = y - this.startY;
        this.clearCanvas();
      }
    }
  };

  initMousehandlers() {
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
    this.canvas.addEventListener("mouseup", this.mouseUpHandler);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
  }
}
