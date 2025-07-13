import { useQuery } from "@tanstack/react-query";
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
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const { isLoading, isError, error } = useQuery({
    queryKey: ["chats", params.id],
    queryFn: async () => {
      const response = await api.get(`/chats/${params.id}`);
      const result = await response.data;
      if (!result.success) throw new Error("Unable to load chats");
      setChats(result.message);
      console.log(result.message);
      return result.message;
    },
  });

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "chat") {
          setChats((prev) => [...prev, data.message]);
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    };

    return () => {
      socket.onmessage = null;
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

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
    newMessageRef.current.value = "";
  };

  if (isError) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center">
        {error.message}
      </div>
    );
  }

  return isLoading ? (
    <div className="min-h-screen w-full bg-gray-100 flex justify-center items-center">
      <RiLoader4Fill size={30} className="animate-spin" />
    </div>
  ) : (
    <section className="min-h-screen max-w-7xl mx-auto flex flex-col">
      <h2 className="text-5xl font-bold py-5">Chat</h2>

      <div className="h-20 border-y">
        <h4 className="text-2xl font-medium">Room Slug</h4>
      </div>

      <div className="flex-1 flex flex-col m-5 rounded-lg">
        <div className="flex-1 drop-shadow-2xl bg-white rounded-lg p-4 mx-4 my-2 space-y-1 h-1/2 overflow-y-auto">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`flex ${
                chat.userId === user?.message?.id
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <p
                className={`px-2 py-1 max-w-[80%] rounded-lg ${
                  chat.userId === user.message.id
                    ? "bg-green-200"
                    : "bg-gray-300"
                }`}
              >
                {chat.message}
              </p>
            </div>
          ))}
          <div ref={messagesEndRef} />
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
