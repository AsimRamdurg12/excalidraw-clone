import { BiPencil } from "react-icons/bi";
import IconButton from "../ui/IconButton";
import { FaRegCircle } from "react-icons/fa";
import { LuRectangleHorizontal } from "react-icons/lu";
import type { Tool } from "./Canvas";

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
      </div>
    </div>
  );
};

export default Toolbar;
