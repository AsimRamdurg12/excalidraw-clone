import type { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { api } from "../lib/axios";
import Card from "../ui/Card";

export interface Room {
  id: number;
  slug: string;
  adminId: string;
}

const Room = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);

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
  );
};

export default Room;
