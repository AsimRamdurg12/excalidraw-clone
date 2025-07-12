import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/axios";
import { useParams } from "react-router-dom";
import { RiLoader4Fill } from "react-icons/ri";
import { useEffect, useRef, useState } from "react";
import useProfile from "../hooks/useProfile";
import Button from "../ui/Button";
import { BiSend } from "react-icons/bi";
import { useSocket } from "../hooks/useSocket";

interface Chat {
  id: number;
  message: string;
  userId: string;
  roomId: number;
  createdAt: string;
}

const ChatPage = () => {
  const params = useParams();
  const [chats, setChats] = useState<Chat[]>([]);
  const newMessageRef = useRef<HTMLInputElement | null>(null);
  const { user } = useProfile();
  const { socket } = useSocket(params.id!);
  const queryClient = useQueryClient();

  // 1️⃣ Load existing chats once
  const { isLoading, isError, error } = useQuery({
    queryKey: ["chats", params.id],
    queryFn: async () => {
      const response = await api.get(`/chats/${params.id}`);
      const result = await response.data;
      if (!result.success) throw new Error("Unable to load chats");
      setChats(result.message);
      return result.message;
    },
  });

  // 2️⃣ Listen for incoming messages
  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "chat") {
          setChats((prevChats) => [...prevChats, data]); // ✅ Append new chat
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    };

    return () => {
      socket.onmessage = null;
    };
  }, [socket]);

  // 3️⃣ Send new message
  const handleSendMessage = () => {
    if (
      !newMessageRef.current ||
      !socket ||
      socket.readyState !== WebSocket.OPEN
    )
      return;

    const messagePayload = {
      type: "chat",
      message: newMessageRef.current.value,
      roomId: Number(params.id),
    };

    socket.send(JSON.stringify(messagePayload));
    queryClient.fetchQuery({ queryKey: ["chats", params.id] });
    newMessageRef.current.value = "";
  };

  // 4️⃣ Handle error case rendering
  if (isError) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center">
        {error.message}
      </div>
    );
  }

  return isLoading ? (
    <div className="min-h-screen w-full bg-gray-100 flex justify-center items-center">
      <RiLoader4Fill className="animate-spin" />
    </div>
  ) : (
    <section className="min-h-screen max-w-7xl mx-auto flex flex-col">
      <h2 className="text-5xl font-bold py-5">Chat</h2>

      <div className="h-20 border-y">
        <h4 className="text-2xl font-medium">Room Slug</h4>
        <p>1 member</p>
      </div>

      <div className="flex-1 flex flex-col m-5 rounded-lg">
        <div className="flex-1 drop-shadow-2xl bg-white rounded-lg p-4 mx-4 my-2 space-y-1 h-1/2 overflow-y-auto">
          {chats.map((chat) => (
            <div key={chat.id} className="border">
              <p
                className={`flex ${
                  chat.userId === user.message.id
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {chat.message}
              </p>
            </div>
          ))}
        </div>
        <div className="mx-4 mb-2 flex justify-between items-center gap-2">
          <input
            className="rounded-full w-full bg-white px-4 py-2 drop-shadow-2xl"
            ref={newMessageRef}
          />
          <Button
            className="rounded-full py-4 drop-shadow-2xl"
            onClick={handleSendMessage}
          >
            <BiSend />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ChatPage;
