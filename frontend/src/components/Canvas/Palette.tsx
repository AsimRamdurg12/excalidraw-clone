import { colors, strokeStyle, strokeWidth } from "../../lib/constants";
import type { Style } from "./Canvas";

interface ColorPicker {
  stroke: string;
  setStroke: (s: string) => void;
  color: string;
  setColor: (c: string) => void;
  strokeType: string;
  setStrokeType: (s: Style) => void;
  lineWidth: number;
  setLineWidth: (s: number) => void;
}

const Palette = ({
  stroke,
  setStroke,
  color,
  setColor,
  strokeType,
  setStrokeType,
  lineWidth,
  setLineWidth,
}: ColorPicker) => {
  return (
    <div className="absolute rounded-lg left-2 top-16 border bg-white border-gray-500">
      <div className="flex flex-col p-2 gap-2">
        <div className="space-y-2">
          <h5 className="text-sm font-semibold">Stroke</h5>
          <div className="flex gap-2">
            {colors.map((color) => (
              <div
                key={color.color}
                className={`${color.color} size-6 rounded ${
                  stroke === color.hex && "ring-2 ring-blue-300"
                }`}
                onClick={() => setStroke(color.hex)}
              ></div>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <h5 className="text-sm font-semibold">Background</h5>
          <div className="flex gap-2">
            {colors.slice(1).map((c) => (
              <div
                key={c.color}
                className={`${c.color} size-6 rounded ${
                  color === c.hex && "ring-2 ring-blue-300"
                }`}
                onClick={() => setColor(c.hex)}
              ></div>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <h5 className="text-sm font-semibold">Stroke Style</h5>
          <div className="flex gap-2">
            {strokeStyle.map((c) => {
              const Icon = c.svg;
              return (
                <div
                  key={c.type}
                  className={`size-6 rounded ${
                    strokeType === c.type && "ring-2 ring-blue-300"
                  }`}
                  onClick={() => setStrokeType(c.type as Style)}
                >
                  <Icon />
                </div>
              );
            })}
          </div>
        </div>
        <div className="space-y-2">
          <h5 className="text-sm font-semibold">Stroke Width</h5>
          <div className="flex gap-2">
            {strokeWidth.map((s) => {
              const Icon = s.svg;
              return (
                <div
                  key={s.type}
                  className={`size-6 rounded ${
                    lineWidth === s.type && "ring-2 ring-blue-300"
                  }`}
                  onClick={() => setLineWidth(s.type)}
                >
                  <Icon />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Palette;
