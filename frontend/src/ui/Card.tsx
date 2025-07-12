import { useNavigate } from "react-router-dom";
import Button from "./Button";
import { images } from "../lib/constants";
import type { Room } from "../pages/Room";

const Card = ({ room }: { room: Room }) => {
  const navigate = useNavigate();

  const n = Math.floor(Math.random() * images.length);

  return (
    <section className="max-w-lg border px-4 py-2 rounded-xl">
      <div>
        <h3>{room.slug}</h3>
        <div className="border rounded-lg">
          <div className="h-full">
            <img src={images[n]} alt="image1" className="rounded-lg" />
          </div>
        </div>
        <div className="flex gap-2 my-2">
          <Button
            className="w-full bg-black"
            onClick={() => navigate(`/room/chat/${room.id}`)}
          >
            Chat
          </Button>
          <Button
            className="w-full "
            type="button"
            onClick={() => navigate(`/room/${room.id}`)}
          >
            Canvas
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Card;
