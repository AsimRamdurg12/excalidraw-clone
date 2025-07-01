import type { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { api } from "../lib/axios";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { BiX } from "react-icons/bi";

export interface Room {
  id: number;
  slug: string;
  adminId: string;
}

const Room = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [newRoom, setNewRoom] = useState(false);
  const [slug, setSlug] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);

  const createRoom = async () => {
    try {
      const response = await api.post("/rooms/create-room", { slug });
      const result = await response.data;

      if (!result.success) {
        setCreateError(result.message);
      } else {
        setRooms((prev) => [...prev, result.message]);
        setNewRoom(false);
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      throw new Error(axiosError.message);
    }
  };

  useEffect(() => {
    const getRooms = async () => {
      try {
        const response = await api.get("/rooms/get-rooms");
        const result = await response.data;

        if (result.success) {
          setRooms(result.message);
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        console.log(axiosError);
      }
    };
    getRooms();
  }, []);

  return (
    <div className="relative h-full w-full">
      {newRoom && (
        <div className="fixed flex min-h-screen top-0 w-full bg-white/50 items-center">
          <div className="fixed border space-y-2.5 rounded-lg bg-white px-4 py-2 left-1/2">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">New Project</h2>
              <Button
                className="bg-white text-black p-0"
                onClick={() => setNewRoom(false)}
              >
                <BiX />
              </Button>
            </div>
            <Input
              placeholder="Enter room name"
              onChange={(e) => setSlug(e.target.value)}
            />
            {createError && <p className="text-red-500">{createError}</p>}
            <Button
              onClick={createRoom}
              disabled={slug == ""}
              className={`${slug == "" && "bg-blue-300 cursor-default"}`}
            >
              Create
            </Button>
          </div>
        </div>
      )}
      <div className="flex justify-between px-4 py-2">
        <h2 className="text-5xl">Rooms</h2>
        <Button
          type="submit"
          className="text-xl"
          onClick={() => {
            setNewRoom(!newRoom);
          }}
        >
          Create
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-4 gap-4 ">
        {rooms.map((room) => (
          <Card
            key={room.id}
            room={room}
            isChatOpen={isChatOpen}
            setIsChatOpen={setIsChatOpen}
          />
        ))}
      </div>
    </div>
  );
};

export default Room;
