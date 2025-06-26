import { BiZoomIn, BiZoomOut } from "react-icons/bi";

interface Zoom {
  zoomIn: () => void;
  zoomOut: () => void;
}

const Zoom = ({ zoomIn, zoomOut }: Zoom) => {
  return (
    <div className="absolute flex rounded-lg bottom-3 left-3 border border-gray-500 bg-white p-1">
      <button
        className="px-4 py-2 hover:bg-gray-200 rounded-lg"
        onClick={zoomIn}
      >
        <BiZoomIn className="size-5" />
      </button>
      <button
        className="px-4 py-2 hover:bg-gray-200 rounded-lg"
        onClick={zoomOut}
      >
        <BiZoomOut className="size-5" />
      </button>
    </div>
  );
};

export default Zoom;
