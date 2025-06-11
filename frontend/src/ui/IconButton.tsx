import type { ReactNode } from "react";

type Icon = {
  icon: ReactNode;
  active: boolean;
  setSelectedTool: () => void;
};

const IconButton = ({ icon, active, setSelectedTool }: Icon) => {
  return (
    <div
      className={`rounded-lg px-4 py-2 w-fit flex cursor-pointer ${
        active && "bg-gray-200 text-blue-600"
      }`}
      onClick={setSelectedTool}
    >
      {icon}
    </div>
  );
};

export default IconButton;
