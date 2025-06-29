import { type Tool } from "../components/Canvas/Canvas";
import { create } from "zustand";

type CanvasState = {
  tool: Tool;
  stroke: string;
  color: string;
  strokeType: string;
  lineWidth: string;
  setTool: (tool: Tool) => void;
  setStroke: (s: string) => void;
  setColor: (c: string) => void;
  setStrokeType: (t: string) => void;
  setLineWidth: (l: string) => void;
};

export const useCanvasStore = create<CanvasState>((set) => ({
  tool: "hand",
  stroke: "#000000",
  color: "",
  strokeType: "line",
  lineWidth: "line1",
  setTool: (tool) => set({ tool }),
  setStroke: (stroke) => set({ stroke }),
  setColor: (color) => set({ color }),
  setStrokeType: (strokeType) => set({ strokeType }),
  setLineWidth: (lineWidth) => set({ lineWidth }),
}));
