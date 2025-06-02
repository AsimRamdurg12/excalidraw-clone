import { Request, Response } from "express";
import { prisma } from "../utils/prisma";

export const getShapes = async (req: Request, res: Response) => {
  try {
    const userId = req.id;
    const roomId = req.params.roomId;
    const room = await prisma.room.findFirst({
      where: {
        adminId: userId,
        id: Number(roomId),
      },
    });

    if (!room) {
      res.status(404).json({
        success: false,
        message: "Room not found",
      });
      return;
    }

    const shapes = await prisma.shapes.findMany({
      where: {
        userId: userId,
        roomId: room.id,
      },
    });

    if (!shapes) {
      res.status(404).json({
        success: false,
        message: "No shapes found. Start drawing.",
      });
    }

    res.status(200).json({
      success: true,
      message: shapes,
    });
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error in getShapes: ${error}`,
    });
    return;
  }
};
