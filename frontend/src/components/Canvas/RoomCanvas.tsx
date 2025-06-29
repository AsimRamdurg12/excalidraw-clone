import { useParams } from "react-router-dom";
import Canvas from "./Canvas";

const RoomCanvas = () => {
  const params = useParams();

  return (
    <div>
      <Canvas roomId={params.id!} />
    </div>
  );
};

export default RoomCanvas;
