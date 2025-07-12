import { Request, Response } from "express";
import { prisma } from "../utils/prisma";

export const getChats = async (req: Request, res: Response) => {
  try {
    const userId = req.id;
    const roomId = req.params.roomId;

    const room = await prisma.room.findFirst({
      where: {
        id: Number(roomId),
        adminId: userId,
      },
    });
    if (!room) {
      res.status(404).json({
        success: false,
        message: "Room not found",
      });
      return;
    }

    const chats = await prisma.chat.findMany({
      where: {
        roomId: room.id,
      },
      take: 1000,
    });

    if (!chats) {
      res.status(404).json({
        success: false,
        message: "No chats found. Start one!",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: chats,
    });
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error in getChats: ${error}`,
    });
    return;
  }
};
