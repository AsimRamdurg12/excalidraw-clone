import { BiEraser, BiPencil } from "react-icons/bi";
import IconButton from "../../ui/IconButton";
import { FaRegCircle } from "react-icons/fa";
import { LuRectangleHorizontal } from "react-icons/lu";
import type { Tool } from "./Canvas";
import { HiHandRaised } from "react-icons/hi2";

const Toolbar = ({
  selectedTool,
  setSelectedTool,
}: {
  selectedTool: Tool;
  setSelectedTool: (s: Tool) => void;
}) => {
  return (
    <div className="fixed flex justify-center mt-5 w-full">
      <div className="opacity-100 flex gap-5 bg-violet-50 w-fit px-4 border rounded-lg">
        <IconButton
          active={selectedTool === "rect"}
          icon={<LuRectangleHorizontal />}
          setSelectedTool={() => setSelectedTool("rect")}
        />
        <IconButton
          setSelectedTool={() => setSelectedTool("circle")}
          active={selectedTool === "circle"}
          icon={<FaRegCircle />}
        />
        <IconButton
          setSelectedTool={() => setSelectedTool("pencil")}
          active={selectedTool === "pencil"}
          icon={<BiPencil />}
        />
        <IconButton
          setSelectedTool={() => setSelectedTool("move")}
          active={selectedTool === "move"}
          icon={<HiHandRaised />}
        />
        <IconButton
          setSelectedTool={() => setSelectedTool("eraser")}
          active={selectedTool === "eraser"}
          icon={<BiEraser />}
        />
      </div>
    </div>
  );
};

export default Toolbar;
