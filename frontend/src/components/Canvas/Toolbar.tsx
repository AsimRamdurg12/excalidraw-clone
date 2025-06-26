import { BiEraser, BiPencil } from "react-icons/bi";
import IconButton from "../../ui/IconButton";
import { FaRegCircle } from "react-icons/fa";
import { LuRectangleHorizontal } from "react-icons/lu";
import type { Tool } from "./Canvas";
import { HiHandRaised } from "react-icons/hi2";
import { FcCursor } from "react-icons/fc";
import { TbOvalVertical } from "react-icons/tb";
import { FaT } from "react-icons/fa6";
import { GoDash } from "react-icons/go";
import { MdArrowOutward } from "react-icons/md";

const Toolbar = ({
  selectedTool,
  setSelectedTool,
}: {
  selectedTool: Tool;
  setSelectedTool: (s: Tool) => void;
}) => {
  return (
    <div className="absolute flex justify-center mt-5 w-full">
      <div className="opacity-100 flex gap-5 bg-violet-50 w-fit px-4 border rounded-lg">
        <IconButton
          setSelectedTool={() => setSelectedTool("select")}
          active={selectedTool === "select"}
          icon={<FcCursor />}
        />
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
          setSelectedTool={() => setSelectedTool("ellipse")}
          icon={<TbOvalVertical />}
          active={selectedTool === "ellipse"}
        />
        <IconButton
          setSelectedTool={() => setSelectedTool("pencil")}
          active={selectedTool === "pencil"}
          icon={<BiPencil />}
        />
        <IconButton
          setSelectedTool={() => setSelectedTool("line")}
          active={selectedTool === "line"}
          icon={<GoDash />}
        />
        <IconButton
          setSelectedTool={() => setSelectedTool("arrow")}
          active={selectedTool === "arrow"}
          icon={<MdArrowOutward />}
        />

        <IconButton
          setSelectedTool={() => setSelectedTool("text")}
          active={selectedTool === "text"}
          icon={<FaT />}
        />
        <IconButton
          setSelectedTool={() => setSelectedTool("eraser")}
          active={selectedTool === "eraser"}
          icon={<BiEraser />}
        />
        <IconButton
          setSelectedTool={() => setSelectedTool("hand")}
          active={selectedTool === "hand"}
          icon={<HiHandRaised />}
        />
      </div>
    </div>
  );
};

export default Toolbar;
