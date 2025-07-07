import { useState } from "react";
import { api } from "../lib/axios";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { BiX } from "react-icons/bi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RiLoader4Fill } from "react-icons/ri";

export interface Room {
  id: number;
  slug: string;
  adminId: string;
}

const Room = () => {
  const queryClient = useQueryClient();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [newRoom, setNewRoom] = useState(false);
  const [slug, setSlug] = useState("");

  // Fetch rooms
  const {
    isLoading,
    isError: loadRooms,
    error: roomError,
  } = useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      const response = await api.get("/rooms/get-rooms");
      const result = await response.data;
      setRooms(result.message);
      return result;
    },
  });

  // Create room mutation
  const {
    mutate: createNewRoom,
    isPending,
    isError: isCreateRoomError,
    error: createRoomError,
  } = useMutation({
    mutationFn: async () => {
      const response = await api.post("/rooms/create-room", { slug });
      const result = await response.data;

      if (!result.success) throw new Error("Room creation failed");

      setSlug("");
      setNewRoom(false);
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });

  if (loadRooms || isCreateRoomError) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center">
        {roomError?.message || createRoomError?.message}
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {/* Modal */}
      {newRoom && (
        <div className="absolute top-0 left-0 flex min-h-screen w-full bg-white/50 justify-center items-center z-10">
          <div className="border space-y-4 rounded-lg bg-white px-6 py-4 shadow-md w-full max-w-md">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">New Project</h2>
              <Button
                className="bg-white text-black p-0"
                onClick={() => setNewRoom(false)}
              >
                <BiX size={24} />
              </Button>
            </div>
            <Input
              placeholder="Enter room name"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
            <Button
              onClick={() => createNewRoom()}
              disabled={slug === "" || isPending}
              className={`w-full ${
                (slug === "" || isPending) && "bg-blue-300 cursor-default"
              }`}
            >
              {isPending ? "Creating..." : "Create"}
            </Button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between px-4 py-4">
        <h2 className="text-5xl font-bold">Rooms</h2>
        <Button
          type="button"
          className="text-xl"
          onClick={() => setNewRoom(!newRoom)}
        >
          Create
        </Button>
      </div>

      {/* Rooms */}
      {isLoading ? (
        <div className="min-h-screen w-full flex justify-center items-center">
          <RiLoader4Fill size={30} className="animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-4 gap-4">
          {rooms.map((room: Room) => (
            <Card
              key={room.id}
              room={room}
              isChatOpen={isChatOpen}
              setIsChatOpen={setIsChatOpen}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Room;
