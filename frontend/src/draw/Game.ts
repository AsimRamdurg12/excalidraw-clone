import type { Tool } from "../components/Canvas/Canvas";
import { getExistingShapes } from "./http";

type AllShapes = {
  id?: number;
  roomId?: number;
  userId?: string;
  shape: Shape;
};

type ResizeHandle = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";

// FIX: Added missing properties to Circle and Ellipse types
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
      type: "ellipse";
      x: number;
      y: number;
      width: number;
      height: number;
      rotation: number;
      startAngle: number;
      endAngle: number;
      counterClockWise: boolean;
    }
  | {
      type: "pencil";
      points: { x: number; y: number }[];
    }
  | {
      type: "text";
      x: number;
      y: number;
      text: string;
      fontSize: number;
      fontFamily: string;
      color: string;
    }
  | {
      type: "line";
      x1: number;
      y1: number;
      x2: number;
      y2: number;
    }
  | {
      type: "arrow";
      x1: number;
      y1: number;
      x2: number;
      y2: number;
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
  // Canvas
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private roomId: string;
  private socket: WebSocket;

  // Elements storage
  private existingShapes: AllShapes[] = [];
  private undoStack: AllShapes[][] = [];
  private redoStack: AllShapes[][] = [];

  // Drawing State
  private selectedTool: Tool = "circle";
  private currentPencilStroke: { x: number; y: number }[] = [];
  private activeShape: AllShapes | null = null;
  private originalShape: Shape | null = null;
  private isDrawing = false;
  private isMoving = false;
  private isResizing = false;
  private selectedElements: AllShapes[] = [];
  private isEditingText = false;
  private textInput: HTMLInputElement | null = null;
  private pendingTextShape: { x: number; y: number } | null = null;
  private strokeColor = "#000000";
  private fillColor = "transparent";
  private strokeWidth = 2;
  private fontSize = 16;
  private fontFamily = "Arial";

  // Interaction state
  private startX = 0;
  private startY = 0;
  private dragX = 0;
  private dragY = 0;
  private resizeHandle: ResizeHandle | null = null;
  private selectionBox: {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  } | null = null;

  // Infinite canvas state
  private viewportX = 0;
  private viewportY = 0;
  private scale = 1;
  private minScale = 0.1;
  private maxScale = 5;

  constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.roomId = roomId;
    this.socket = socket;
    this.init();
    this.initMouseHandlers();
    this.initSocketHandlers();
  }

  // --- Event Handler Management ---

  private mouseDownHandler = (e: MouseEvent) => {
    // Finish any pending text input if clicking elsewhere
    if (this.isEditingText) {
      this.finishTextInput(true);
      return;
    }

    this.isDrawing = true;
    const pos = this.getMousPos(e);
    this.startX = pos.x;
    this.startY = pos.y;

    switch (this.selectedTool) {
      case "select":
        this.handleSelectMouseDown(pos);
        break;
      case "text":
        this.startTextInput(pos);
        break;
      case "pencil":
        this.currentPencilStroke = [{ x: pos.x, y: pos.y }];
        break;
      case "rect":
      case "circle":
      case "ellipse":
      case "line":
      case "arrow":
        this.activeShape = {
          shape: this.createInitialShape(this.selectedTool, pos.x, pos.y),
        };
        break;
      case "eraser":
        // Eraser logic on mouse down (if any)
        break;
    }
  };

  private mouseMoveHandler = (e: MouseEvent) => {
    const pos = this.getMousPos(e);

    if (this.selectedTool === "select") {
      this.handleSelectMouseMove(pos);
    } else if (this.isDrawing && this.activeShape) {
      this.updateDrawingShape(pos);
    } else if (this.isDrawing && this.selectedTool === "pencil") {
      this.currentPencilStroke.push({ x: pos.x, y: pos.y });
      this.clearCanvas();
      this.drawShape({ type: "pencil", points: this.currentPencilStroke });
    }
  };

  private mouseUpHandler = () => {
    this.isDrawing = false;
    if (this.selectedTool === "select") {
      this.handleSelectMouseUp();
    } else if (this.activeShape) {
      this.existingShapes.push(this.activeShape);
      this.socket.send(
        JSON.stringify({
          type: "shapes",
          message: this.activeShape.shape,
          roomId: this.roomId,
        })
      );
      this.activeShape = null;
    } else if (
      this.selectedTool === "pencil" &&
      this.currentPencilStroke.length > 1
    ) {
      const pencilShape: Shape = {
        type: "pencil",
        points: this.currentPencilStroke,
      };

      this.socket.send(
        JSON.stringify({
          type: "shapes",
          message: pencilShape,
          roomId: this.roomId,
        })
      );
      this.currentPencilStroke = [];
    }
    this.clearCanvas();
  };

  private keyDownHandler = (e: KeyboardEvent) => {
    if (e.key === "Backspace" || e.key === "Delete") {
      // Implement delete functionality for selected items
    }
    if (e.ctrlKey && e.key === "z") {
      this.undo();
    }
    if (e.ctrlKey && e.key === "y") {
      this.redo();
    }
  };

  // A new method to create shapes during drawing
  private createInitialShape(tool: Tool, x: number, y: number): Shape {
    switch (tool) {
      case "rect":
        return { type: "rect", x, y, width: 0, height: 0 };
      case "circle":
        // FIX: Initialize all properties for circle
        return {
          type: "circle",
          x,
          y,
          radius: 0,
          startAngle: 0,
          endAngle: 2 * Math.PI,
          counterClockwise: false,
        };
      case "ellipse":
        // FIX: Initialize all properties for ellipse
        return {
          type: "ellipse",
          x,
          y,
          width: 0,
          height: 0,
          rotation: 0,
          startAngle: 0,
          endAngle: 2 * Math.PI,
          counterClockWise: false,
        };
      case "line":
        return { type: "line", x1: x, y1: y, x2: x, y2: y };
      case "arrow":
        return { type: "arrow", x1: x, y1: y, x2: x, y2: y };
      case "pencil":
        return { type: "pencil", points: [{ x: x, y: y }] };
        break;
      default:
        throw new Error(`Unknown shape tool: ${tool}`);
    }
  }

  // A new method to update shapes during drawing
  private updateDrawingShape(pos: { x: number; y: number }) {
    if (!this.activeShape) return;
    const { shape } = this.activeShape;
    const dx = pos.x - this.startX;
    const dy = pos.y - this.startY;

    switch (shape.type) {
      case "rect":
        shape.width = dx;
        shape.height = dy;
        break;
      case "circle":
        shape.radius = Math.sqrt(dx * dx + dy * dy);
        break;
      case "ellipse":
        // FIX: Corrected ellipse drawing to use bounding box logic
        shape.x = Math.min(this.startX, pos.x);
        shape.y = Math.min(this.startY, pos.y);
        shape.width = Math.abs(dx);
        shape.height = Math.abs(dy);
        break;
      case "line":
      case "arrow":
        shape.x2 = pos.x;
        shape.y2 = pos.y;
        break;
    }
    this.clearCanvas();
    this.drawShape(shape);
  }

  destroy() {
    this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
    this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
    this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
    this.canvas.removeEventListener("wheel", this.wheelHandler);
    document.removeEventListener("keydown", this.keyDownHandler);
  }

  setTool(tool: Tool) {
    this.selectedTool = tool;
    switch (this.selectedTool) {
      case "select":
        this.canvas.style.cursor = "default";
        break;
      case "pencil":
        this.canvas.style.cursor = "crosshair";
        break;
      case "eraser":
        this.canvas.style.cursor = "cell";
        break;
      default:
        this.canvas.style.cursor = "crosshair";
    }
  }

  async init() {
    this.existingShapes = await getExistingShapes(this.roomId);
    this.saveState();
    this.clearCanvas();
  }

  initMouseHandlers() {
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
    this.canvas.addEventListener("mouseup", this.mouseUpHandler);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
    this.canvas.addEventListener("wheel", this.wheelHandler);
    document.addEventListener("keydown", this.keyDownHandler);
  }

  initSocketHandlers() {
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "shapes") {
        this.existingShapes.push({ shape: message.message });
        this.saveState();
        this.clearCanvas();
      }
      if (message.type === "update") {
        const updatedShapeData = message.message;
        this.existingShapes = this.existingShapes.map((s) =>
          s.id === updatedShapeData.id ? updatedShapeData : s
        );
        this.saveState();
        this.clearCanvas();
      }
    };
  }

  // --- State and Drawing ---
  saveState() {
    // Deep clone the current state
    const currentState = JSON.parse(JSON.stringify(this.existingShapes));
    this.undoStack.push(currentState);

    // Limit undo stack size
    if (this.undoStack.length > 50) {
      this.undoStack.shift();
    }

    // Clear redo stack when new action is performed
    this.redoStack = [];
  }

  undo() {
    if (this.undoStack.length > 1) {
      const currentState = this.undoStack.pop();
      if (currentState) {
        this.redoStack.push(currentState);
      }

      const previousState = this.undoStack[this.undoStack.length - 1];
      this.existingShapes = JSON.parse(JSON.stringify(previousState));
      this.clearCanvas();
    }
  }

  redo() {
    if (this.redoStack.length > 0) {
      const nextState = this.redoStack.pop();
      if (nextState) {
        this.undoStack.push(nextState);
        this.existingShapes = JSON.parse(JSON.stringify(nextState));
        this.clearCanvas();
      }
    }
  }

  // --- Infinite Canvas ---
  screenToWorld(screenX: number, screenY: number) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: (screenX - rect.left - this.viewportX) / this.scale,
      y: (screenY - rect.top - this.viewportY) / this.scale,
    };
  }

  worldToScreen(worldX: number, worldY: number) {
    return {
      x: worldX * this.scale + this.viewportX,
      y: worldY * this.scale + this.viewportY,
    };
  }

  pan(deltaX: number, deltaY: number) {
    this.viewportX += deltaX;
    this.viewportY += deltaY;
    this.clearCanvas();
  }

  zoom(factor: number, centerX: number, centerY: number) {
    const newScale = Math.max(
      this.minScale,
      Math.min(this.maxScale, this.scale * factor)
    );

    if (newScale !== this.scale) {
      const worldCenter = this.screenToWorld(centerX, centerY);
      this.scale = newScale;
      const newScreenCenter = this.worldToScreen(worldCenter.x, worldCenter.y);

      this.viewportX += centerX - newScreenCenter.x;
      this.viewportY += centerY - newScreenCenter.y;

      this.clearCanvas();
    }
  }

  getMousPos(e: MouseEvent) {
    return this.screenToWorld(e.clientX, e.clientY);
  }

  // --- Hit Detection ---
  getElementAtPosition(pos: { x: number; y: number }) {
    for (let i = this.existingShapes.length - 1; i >= 0; i--) {
      const element = this.existingShapes[i];
      if (this.isPointInElement(pos, element.shape)) {
        return element;
      }
    }
    return null;
  }

  isPointInElement(pos: { x: number; y: number }, element: Shape) {
    switch (element.type) {
      case "rect":
        return (
          pos.x >= element.x &&
          pos.x <= element.x + element.width &&
          pos.y >= element.y &&
          pos.y <= element.y + element.height
        );
      case "circle": {
        const dx = pos.x - element.x;
        const dy = pos.y - element.y;
        return dx * dx + dy * dy <= element.radius * element.radius;
      }
      case "ellipse": {
        // FIX: Ellipse hit detection is mathematically correct based on bounding box (x, y, width, height)
        const centerX = element.x + element.width / 2;
        const centerY = element.y + element.height / 2;
        const radiusX = element.width / 2;
        const radiusY = element.height / 2;
        const dx = (pos.x - centerX) / radiusX;
        const dy = (pos.y - centerY) / radiusY;
        return dx * dx + dy * dy <= 1;
      }
      case "pencil":
        return element.points.some(
          (p) => Math.hypot(pos.x - p.x, pos.y - p.y) < 10 / this.scale
        );
      case "text": {
        const textWidth = this.ctx.measureText(element.text).width;
        return (
          pos.x >= element.x &&
          pos.x <= element.x + textWidth &&
          pos.y <= element.y &&
          pos.y >= element.y - element.fontSize
        );
      }
      case "line":
      case "arrow": {
        const dist =
          Math.abs(
            (element.y2 - element.y1) * pos.x -
              (element.x2 - element.x1) * pos.y +
              element.x2 * element.y1 -
              element.y2 * element.x1
          ) /
          Math.sqrt(
            Math.pow(element.y2 - element.y1, 2) +
              Math.pow(element.x2 - element.x1, 2)
          );
        return dist < 5 / this.scale;
      } // 5px tolerance
      default:
        return false;
    }
  }

  // --- Selection and Resizing ---

  isElementInBox(
    element: Shape,
    minX: number,
    minY: number,
    maxX: number,
    maxY: number
  ) {
    switch (element.type) {
      case "rect":
        return (
          element.x >= minX &&
          element.x + element.width <= maxX &&
          element.y >= minY &&
          element.y + element.height <= maxY
        );
      case "ellipse":
        return (
          element.x >= minX &&
          element.x + element.width <= maxX &&
          element.y >= minY &&
          element.y + element.height <= maxY
        );
      case "circle":
        return (
          element.x - element.radius >= minX &&
          element.x + element.radius <= maxX &&
          element.y - element.radius >= minY &&
          element.y + element.radius <= maxY
        );
      case "pencil":
        return element.points.every(
          (point) =>
            point.x >= minX &&
            point.x <= maxX &&
            point.y >= minY &&
            point.y <= maxY
        );
      default:
        return false;
    }
  }

  createSelectionBox(startPos: { x: number; y: number }) {
    this.selectionBox = {
      startX: startPos.x,
      startY: startPos.y,
      endX: startPos.x,
      endY: startPos.y,
    };
  }

  updateSelectionBox(pos: { x: number; y: number }) {
    if (this.selectionBox) {
      this.selectionBox.endX = pos.x;
      this.selectionBox.endY = pos.y;
    }
  }

  finalizeSelectionBox() {
    if (this.selectionBox) {
      const box = this.selectionBox;
      const minX = Math.min(box.startX, box.endX);
      const maxX = Math.max(box.startX, box.endX);
      const minY = Math.min(box.startY, box.endY);
      const maxY = Math.max(box.startY, box.endY);

      this.selectedElements = this.existingShapes.filter((element) => {
        return this.isElementInBox(element.shape, minX, minY, maxX, maxY);
      });

      this.selectionBox = null;
    }
  }

  moveSelectedElements(dx: number, dy: number) {
    this.selectedElements.forEach((element) => {
      if (element.shape.type === "pencil") {
        element.shape.points.forEach((point) => {
          point.x += dx;
          point.y += dy;
        });
      } else if (
        element.shape.type === "rect" ||
        element.shape.type === "ellipse" ||
        element.shape.type === "text"
      ) {
        element.shape.x += dx;
        element.shape.y += dy;
      } else if (element.shape.type === "circle") {
        element.shape.x += dx;
        element.shape.y += dy;
      } else if (
        element.shape.type === "line" ||
        element.shape.type === "arrow"
      ) {
        element.shape.x1 += dx;
        element.shape.y1 += dy;
        element.shape.x2 += dx;
        element.shape.y2 += dy;
      }
    });
    this.clearCanvas();
  }

  handleSelectMouseDown(pos: { x: number; y: number }) {
    if (this.selectedElements.length === 1) {
      const handle = this.getResizeHandle(
        pos.x,
        pos.y,
        this.selectedElements[0].shape
      );
      if (handle) {
        this.isResizing = true;
        this.resizeHandle = handle;
        this.activeShape = this.selectedElements[0];
        this.originalShape = JSON.parse(JSON.stringify(this.activeShape.shape));
        return;
      }
    }

    const clickedElement = this.getElementAtPosition(pos);
    if (clickedElement) {
      this.selectedElements = [clickedElement];
      this.isMoving = true;
      this.dragX = pos.x;
      this.dragY = pos.y;
    } else {
      this.selectedElements = [];
      this.createSelectionBox(pos);
    }
    this.clearCanvas();
  }

  handleSelectMouseMove(pos: { x: number; y: number }) {
    if (this.isResizing && this.activeShape) {
      // The crucial fix: Re-assign the shape after resizing
      this.activeShape.shape = this.resizeElement(this.activeShape.shape, pos);
      this.clearCanvas();
    } else if (this.isMoving) {
      const dx = pos.x - this.dragX;
      const dy = pos.y - this.dragY;
      this.moveSelectedElements(dx, dy);
      this.dragX = pos.x;
      this.dragY = pos.y;
    } else if (this.selectionBox) {
      this.updateSelectionBox(pos);
      this.clearCanvas();
    }
  }

  handleSelectMouseUp() {
    if (this.selectionBox) {
      this.finalizeSelectionBox();
    }
    if (this.activeShape && (this.isMoving || this.isResizing)) {
      this.socket.send(
        JSON.stringify({
          type: "update",
          message: this.activeShape,
          roomId: this.roomId,
        })
      );
      this.saveState();
    }
    this.isMoving = false;
    this.isResizing = false;
    this.resizeHandle = null;
    this.activeShape = null;
    this.originalShape = null;
    this.clearCanvas();
  }

  // FIX: Corrected resizeElement logic
  resizeElement(element: Shape, pos: { x: number; y: number }): Shape {
    if (!this.originalShape || !this.resizeHandle) return element;

    const newElement = JSON.parse(JSON.stringify(element)); // Create a copy to modify
    const original = this.originalShape;
    const minSize = 10 / this.scale;

    if (
      (newElement.type === "rect" && original.type === "rect") ||
      (newElement.type === "ellipse" && original.type === "ellipse")
    ) {
      switch (this.resizeHandle) {
        case "se":
          newElement.width = Math.max(minSize, pos.x - original.x);
          newElement.height = Math.max(minSize, pos.y - original.y);
          break;
        case "nw":
          newElement.width = Math.max(
            minSize,
            original.x + original.width - pos.x
          );
          newElement.height = Math.max(
            minSize,
            original.y + original.height - pos.y
          );
          newElement.x = original.x + original.width - newElement.width;
          newElement.y = original.y + original.height - newElement.height;
          break;
        case "ne":
          newElement.width = Math.max(minSize, pos.x - original.x);
          newElement.height = Math.max(
            minSize,
            original.y + original.height - pos.y
          );
          newElement.y = original.y + original.height - newElement.height;
          break;
        case "sw":
          newElement.width = Math.max(
            minSize,
            original.x + original.width - pos.x
          );
          newElement.height = Math.max(minSize, pos.y - original.y);
          newElement.x = original.x + original.width - newElement.width;
          break;
        case "n":
          newElement.height = Math.max(
            minSize,
            original.y + original.height - pos.y
          );
          newElement.y = original.y + original.height - newElement.height;
          break;
        case "s":
          newElement.height = Math.max(minSize, pos.y - original.y);
          break;
        case "w":
          newElement.width = Math.max(
            minSize,
            original.x + original.width - pos.x
          );
          newElement.x = original.x + original.width - newElement.width;
          break;
        case "e":
          newElement.width = Math.max(minSize, pos.x - original.x);
          break;
      }
    }
    // Line/Arrow resizing
    else if (newElement.type === "line" || newElement.type === "arrow") {
      // Ensure original type assertion for line/arrow properties
      const originalLineArrow = original as Extract<
        Shape,
        { type: "line" | "arrow" }
      >;
      if (this.resizeHandle === "se") {
        newElement.x2 = pos.x;
        newElement.y2 = pos.y;
        newElement.x1 = originalLineArrow.x1; // Keep original start point
        newElement.y1 = originalLineArrow.y1; // Keep original start point
      } else if (this.resizeHandle === "nw") {
        newElement.x1 = pos.x;
        newElement.y1 = pos.y;
        newElement.x2 = originalLineArrow.x2; // Keep original end point
        newElement.y2 = originalLineArrow.y2; // Keep original end point
      }
    }

    return newElement;
  }

  getPathBounds(path: { x: number; y: number }[]) {
    if (path.length === 0) return { x: 0, y: 0, width: 0, height: 0 };

    let minX = path[0].x;
    let maxX = path[0].x;
    let minY = path[0].y;
    let maxY = path[0].y;

    path.forEach((point) => {
      minX = Math.min(minX, point.x);
      maxX = Math.max(maxX, point.x);
      minY = Math.min(minY, point.y);
      maxY = Math.max(maxY, point.y);
    });

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }

  getResizeHandle(x: number, y: number, shape: Shape): ResizeHandle | null {
    const handleSize = 8 / this.scale;
    let bounds: { x: number; y: number; width: number; height: number };

    if (shape.type === "rect") {
      bounds = {
        x: shape.x,
        y: shape.y,
        width: shape.width,
        height: shape.height,
      };
    } else if (shape.type === "ellipse") {
      bounds = {
        x: shape.x,
        y: shape.y,
        width: shape.width,
        height: shape.height,
      };
    } else if (shape.type === "circle") {
      bounds = {
        x: shape.x - shape.radius,
        y: shape.y - shape.radius,
        width: shape.radius * 2,
        height: shape.radius * 2,
      };
    } else if (shape.type === "pencil") {
      bounds = this.getPathBounds(shape.points);
    } else if (shape.type === "line" || shape.type === "arrow") {
      // For lines/arrows, check handles at endpoints
      if (Math.hypot(x - shape.x1, y - shape.y1) < handleSize) return "nw";
      if (Math.hypot(x - shape.x2, y - shape.y2) < handleSize) return "se";
      return null; // No other handles for lines/arrows
    } else {
      return null;
    }

    const handles = [
      { x: bounds.x, y: bounds.y, handle: "nw" },
      { x: bounds.x + bounds.width / 2, y: bounds.y, handle: "n" },
      { x: bounds.x + bounds.width, y: bounds.y, handle: "ne" },
      {
        x: bounds.x + bounds.width,
        y: bounds.y + bounds.height / 2,
        handle: "e",
      },
      { x: bounds.x + bounds.width, y: bounds.y + bounds.height, handle: "se" },
      {
        x: bounds.x + bounds.width / 2,
        y: bounds.y + bounds.height,
        handle: "s",
      },
      { x: bounds.x, y: bounds.y + bounds.height, handle: "sw" },
      { x: bounds.x, y: bounds.y + bounds.height / 2, handle: "w" },
    ];

    for (const handle of handles) {
      if (
        x >= handle.x - handleSize / 2 &&
        x <= handle.x + handleSize / 2 &&
        y >= handle.y - handleSize / 2 &&
        y <= handle.y + handleSize / 2
      ) {
        return handle.handle as ResizeHandle;
      }
    }

    return null;
  }

  drawShape(shape: Shape) {
    this.ctx.save();
    this.ctx.strokeStyle = this.strokeColor;
    this.ctx.lineWidth = this.strokeWidth / this.scale;
    this.ctx.fillStyle = this.fillColor;

    switch (shape.type) {
      case "rect":
        this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        if (this.fillColor !== "transparent") {
          this.ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
        }
        break;
      case "circle":
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
        if (this.fillColor !== "transparent") {
          this.ctx.fill();
        }
        this.ctx.closePath();
        break;
      case "ellipse":
        this.ctx.beginPath();
        this.ctx.ellipse(
          shape.x + shape.width / 2,
          shape.y + shape.height / 2,
          shape.width / 2,
          shape.height / 2,
          shape.rotation,
          shape.startAngle,
          shape.endAngle,
          shape.counterClockWise
        );
        this.ctx.stroke();
        if (this.fillColor !== "transparent") {
          this.ctx.fill();
        }
        this.ctx.closePath();
        break;
      case "pencil":
        if (shape.points.length > 0) {
          this.ctx.beginPath();
          this.ctx.moveTo(shape.points[0].x, shape.points[0].y);
          shape.points.forEach((point) => this.ctx.lineTo(point.x, point.y));
          this.ctx.stroke();
          this.ctx.closePath();
        }
        break;
      // FIXED: Added text drawing logic
      case "text":
        this.ctx.fillStyle = shape.color;
        this.ctx.font = `${shape.fontSize / this.scale}px ${shape.fontFamily}`;
        this.ctx.fillText(shape.text, shape.x, shape.y);
        break;

      // NEW: Line drawing logic
      case "line":
        this.ctx.beginPath();
        this.ctx.moveTo(shape.x1, shape.y1);
        this.ctx.lineTo(shape.x2, shape.y2);
        this.ctx.stroke();
        break;

      // NEW: Arrow drawing logic
      case "arrow":
        this.ctx.beginPath();
        this.ctx.moveTo(shape.x1, shape.y1);
        this.ctx.lineTo(shape.x2, shape.y2);
        this.ctx.stroke();
        this.drawArrowhead(shape.x1, shape.y1, shape.x2, shape.y2);
        break;
    }
    this.ctx.restore();
  }

  // NEW: Helper function to draw an arrowhead
  private drawArrowhead(
    fromX: number,
    fromY: number,
    toX: number,
    toY: number
  ) {
    const headLength = 10 / this.scale;
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);
    this.ctx.lineTo(
      toX - headLength * Math.cos(angle - Math.PI / 6),
      toY - headLength * Math.sin(angle - Math.PI / 6)
    );
    this.ctx.moveTo(toX, toY);
    this.ctx.lineTo(
      toX - headLength * Math.cos(angle + Math.PI / 6),
      toY - headLength * Math.sin(angle + Math.PI / 6)
    );
    this.ctx.stroke();
  }

  private startTextInput(pos: { x: number; y: number }) {
    if (this.isEditingText && this.textInput) {
      // If already editing, finish the current input before starting a new one
      this.finishTextInput(true);
    }

    this.isEditingText = true;
    this.pendingTextShape = pos;

    // Create input element
    this.textInput = document.createElement("input");
    this.textInput.type = "text";
    this.textInput.style.position = "absolute";
    this.textInput.style.zIndex = "1000";
    this.textInput.style.fontSize = `${this.fontSize}px`;
    this.textInput.style.fontFamily = this.fontFamily;
    this.textInput.style.color = this.strokeColor;
    this.textInput.style.background = "transparent"; // Set background to transparent
    this.textInput.style.border = "1px solid #ccc";
    this.textInput.style.padding = "2px";
    this.textInput.style.outline = "none"; // Remove outline on focus

    // Position the input
    const screenPos = this.worldToScreen(pos.x, pos.y);
    const canvasRect = this.canvas.getBoundingClientRect();
    this.textInput.style.left = `${canvasRect.left + screenPos.x}px`;
    this.textInput.style.top = `${
      canvasRect.top + screenPos.y - this.fontSize
    }px`; // Adjust Y to align baseline

    document.body.appendChild(this.textInput);
    this.textInput.focus();

    // Handle input completion
    const completeTextInput = (force = false) => {
      if (
        this.textInput &&
        this.pendingTextShape &&
        (this.textInput.value.trim() || force) // Allow empty text if forced (e.g., blur without content)
      ) {
        const textShape: Shape = {
          type: "text",
          x: this.pendingTextShape.x,
          y: this.pendingTextShape.y,
          text: this.textInput.value,
          fontSize: this.fontSize,
          fontFamily: this.fontFamily,
          color: this.strokeColor,
        };

        if (this.textInput.value.trim()) {
          // Only send if there's actual text
          this.socket.send(
            JSON.stringify({
              type: "shapes",
              message: textShape,
              roomId: this.roomId,
            })
          );
        }
      }
      this.finishTextInput();
    };

    // Use a flag to prevent multiple calls on blur and keydown
    let finishing = false;
    const finishAndCleanup = (force = false) => {
      if (!finishing) {
        finishing = true;
        completeTextInput(force);
      }
    };

    this.textInput.addEventListener("blur", () => finishAndCleanup(true)); // Force on blur
    this.textInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        finishAndCleanup();
      } else if (e.key === "Escape") {
        this.finishTextInput(); // Don't save on escape
      }
    });

    // Initial drawing of placeholder text (optional, but good for visual feedback)
    this.ctx.save();
    this.ctx.font = `${this.fontSize / this.scale}px ${this.fontFamily}`;
    this.ctx.fillStyle = this.strokeColor;
    this.ctx.fillText("_", pos.x, pos.y); // Placeholder underscore
    this.ctx.restore();
  }

  private finishTextInput(saveContent: boolean = false) {
    if (this.textInput) {
      if (saveContent && this.pendingTextShape && this.textInput.value.trim()) {
        const textShape: Shape = {
          type: "text",
          x: this.pendingTextShape.x,
          y: this.pendingTextShape.y,
          text: this.textInput.value,
          fontSize: this.fontSize,
          fontFamily: this.fontFamily,
          color: this.strokeColor,
        };
        this.socket.send(
          JSON.stringify({
            type: "shapes",
            message: textShape,
            roomId: this.roomId,
          })
        );
      }
      this.textInput.remove();
      this.textInput = null;
    }
    this.isEditingText = false;
    this.pendingTextShape = null;
    this.clearCanvas(); // Redraw canvas to remove placeholder/ensure consistency
  }

  clearCanvas() {
    this.ctx.save();

    // Clear the entire canvas
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Apply transformations for infinite canvas
    this.ctx.translate(this.viewportX, this.viewportY);
    this.ctx.scale(this.scale, this.scale);

    // Draw all existing shapes
    this.existingShapes.forEach((shape) => {
      this.drawShape(shape.shape);
    });

    // Draw selection
    this.drawSelection();

    // Draw selection box
    this.drawSelectionBox();

    // Draw active drawing shape (if any)
    if (this.isDrawing && this.activeShape) {
      this.drawShape(this.activeShape.shape);
    }
    // Draw current pencil stroke (if any)
    if (this.isDrawing && this.selectedTool === "pencil") {
      this.drawShape({ type: "pencil", points: this.currentPencilStroke });
    }

    this.ctx.restore();
  }

  drawSelectionBox() {
    if (!this.selectionBox) return;

    this.ctx.save();
    this.ctx.strokeStyle = "#6366f1";
    this.ctx.lineWidth = 1 / this.scale;
    this.ctx.setLineDash([5 / this.scale, 5 / this.scale]);

    const width = this.selectionBox.endX - this.selectionBox.startX;
    const height = this.selectionBox.endY - this.selectionBox.startY;

    this.ctx.strokeRect(
      this.selectionBox.startX,
      this.selectionBox.startY,
      width,
      height
    );
    this.ctx.restore();
  }

  drawSelection() {
    if (this.selectedElements.length === 0) return;

    this.ctx.save();
    this.ctx.strokeStyle = "#6366f1";
    this.ctx.lineWidth = 2 / this.scale;
    this.ctx.setLineDash([8 / this.scale, 4 / this.scale]);

    // Draw selection outline for each selected element
    this.selectedElements.forEach((element) => {
      if (element.shape.type === "pencil") {
        // Draw bounding box for pencil
        const bounds = this.getPathBounds(element.shape.points);
        this.ctx.strokeRect(
          bounds.x - 5 / this.scale,
          bounds.y - 5 / this.scale,
          bounds.width + 10 / this.scale,
          bounds.height + 10 / this.scale
        );
      } else if (
        element.shape.type === "rect" ||
        element.shape.type === "ellipse" ||
        element.shape.type === "text" // Assuming text also has x, y, width, height for selection
      ) {
        // For text, you might need to calculate width based on text metrics
        let width = element.shape.width;
        let height = element.shape.height;
        if (element.shape.type === "text") {
          width = this.ctx.measureText(element.shape.text).width;
          height = element.shape.fontSize;
          this.ctx.strokeRect(
            element.shape.x - 2 / this.scale,
            element.shape.y - height - 2 / this.scale, // Adjust y for text baseline
            width + 4 / this.scale,
            height + 4 / this.scale
          );
        } else {
          this.ctx.strokeRect(
            element.shape.x - 2 / this.scale,
            element.shape.y - 2 / this.scale,
            width + 4 / this.scale,
            height + 4 / this.scale
          );
        }
      } else if (element.shape.type === "circle") {
        this.ctx.strokeRect(
          element.shape.x - element.shape.radius - 2 / this.scale,
          element.shape.y - element.shape.radius - 2 / this.scale,
          element.shape.radius * 2 + 4 / this.scale,
          element.shape.radius * 2 + 4 / this.scale
        );
      } else if (
        element.shape.type === "line" ||
        element.shape.type === "arrow"
      ) {
        // For lines/arrows, draw a bounding box around their endpoints
        const minX = Math.min(element.shape.x1, element.shape.x2);
        const maxX = Math.max(element.shape.x1, element.shape.x2);
        const minY = Math.min(element.shape.y1, element.shape.y2);
        const maxY = Math.max(element.shape.y1, element.shape.y2);

        this.ctx.strokeRect(
          minX - 5 / this.scale,
          minY - 5 / this.scale,
          maxX - minX + 10 / this.scale,
          maxY - minY + 10 / this.scale
        );
      }
    });

    this.ctx.setLineDash([]);
    this.ctx.restore();

    // Draw resize handles for single selection
    if (this.selectedElements.length === 1) {
      this.drawResizeHandles(this.selectedElements[0].shape);
    }
  }

  drawResizeHandles(shape: Shape) {
    this.ctx.save();
    this.ctx.fillStyle = "#1971c2";
    this.ctx.strokeStyle = "#fff";
    this.ctx.lineWidth = 1 / this.scale;
    this.ctx.setLineDash([]);

    const handleSize = 8 / this.scale;
    let bounds: { x: number; y: number; width: number; height: number };

    if (shape.type === "rect") {
      bounds = {
        x: shape.x,
        y: shape.y,
        width: shape.width,
        height: shape.height,
      };
    } else if (shape.type === "ellipse") {
      bounds = {
        x: shape.x,
        y: shape.y,
        width: shape.width,
        height: shape.height,
      };
    } else if (shape.type === "circle") {
      bounds = {
        x: shape.x - shape.radius,
        y: shape.y - shape.radius,
        width: shape.radius * 2,
        height: shape.radius * 2,
      };
    } else if (shape.type === "pencil") {
      bounds = this.getPathBounds(shape.points);
    } else if (shape.type === "line" || shape.type === "arrow") {
      // Handles only at endpoints for lines/arrows
      const handles = [
        { x: shape.x1, y: shape.y1 },
        { x: shape.x2, y: shape.y2 },
      ];
      handles.forEach(({ x, y }) => {
        this.ctx.fillRect(
          x - handleSize / 2,
          y - handleSize / 2,
          handleSize,
          handleSize
        );
        this.ctx.strokeRect(
          x - handleSize / 2,
          y - handleSize / 2,
          handleSize,
          handleSize
        );
      });
      this.ctx.restore();
      return;
    } else if (shape.type === "text") {
      const textWidth = this.ctx.measureText(shape.text).width;
      bounds = {
        x: shape.x,
        y: shape.y - shape.fontSize, // Adjust y for text baseline
        width: textWidth,
        height: shape.fontSize,
      };
    } else {
      this.ctx.restore();
      return;
    }

    const handles = [
      { x: bounds.x, y: bounds.y, handle: "nw" },
      { x: bounds.x + bounds.width / 2, y: bounds.y, handle: "n" },
      { x: bounds.x + bounds.width, y: bounds.y, handle: "ne" },
      {
        x: bounds.x + bounds.width,
        y: bounds.y + bounds.height / 2,
        handle: "e",
      },
      { x: bounds.x + bounds.width, y: bounds.y + bounds.height, handle: "se" },
      {
        x: bounds.x + bounds.width / 2,
        y: bounds.y + bounds.height,
        handle: "s",
      },
      { x: bounds.x, y: bounds.y + bounds.height, handle: "sw" },
      { x: bounds.x, y: bounds.y + bounds.height / 2, handle: "w" },
    ];

    handles.forEach(({ x, y }) => {
      this.ctx.fillRect(
        x - handleSize / 2,
        y - handleSize / 2,
        handleSize,
        handleSize
      );
      this.ctx.strokeRect(
        x - handleSize / 2,
        y - handleSize / 2,
        handleSize,
        handleSize
      );
    });

    this.ctx.restore();
  }

  wheelHandler = (e: WheelEvent) => {
    e.preventDefault();

    if (e.ctrlKey || e.metaKey) {
      // Zoom
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      this.zoom(zoomFactor, e.clientX, e.clientY);
    } else {
      // Pan
      this.pan(-e.deltaX, -e.deltaY);
    }
  };
}
