import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { roomSchema } from "../Schemas/UserSchema";

export const createRoom = async (req: Request, res: Response) => {
  try {
    const id = req.id;
    const data = roomSchema.safeParse(req.body);

    if (!data.success) {
      res.json({
        message: data.error,
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      res.status(403).json({
        success: false,
        message: "User not authenticated. Please login first",
      });
      return;
    }

    const existingRoom = await prisma.room.findUnique({
      where: {
        slug: data.data?.slug,
      },
    });

    if (existingRoom) {
      res.status(411).json({
        success: false,
        message: "Room already exists. Try different room name",
      });
    }

    const room = await prisma.room.create({
      data: {
        adminId: id?.toString()!,
        slug: data.data?.slug!,
      },
    });

    res.status(201).json({
      success: true,
      message: room,
    });
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error in createRoom: ${error}`,
    });
    return;
  }
};

export const getRooms = async (req: Request, res: Response) => {
  try {
    const id = req.id;

    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Please login to join the room",
      });
      return;
    }

    const rooms = await prisma.room.findMany({
      where: {
        adminId: id,
      },
    });

    if (!rooms) {
      res.status(404).json({
        success: false,
        message: "No Rooms found. Please create one.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: rooms,
    });

    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error in getRooms: ${error}`,
    });
    return;
  }
};

export const getRoomBySlug = async (req: Request, res: Response) => {
  try {
    const id = req.id;
    const slug = req.params.slug;

    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Please login to join the room",
      });
      return;
    }

    const room = await prisma.room.findFirst({
      where: {
        adminId: id,
        slug: slug,
      },
    });

    if (!room) {
      res.status(404).json({
        success: false,
        message: "Room not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: room,
    });
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error in joinRoom: ${error}`,
    });
  }
};

export const deleteRoom = async (req: Request, res: Response) => {
  try {
    const id = req.id;
    const slug = req.params.slug;

    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      res.status(403).json({
        success: false,
        message:
          "You are unauthorized to delete this room. Please login with correct credentials",
      });
      return;
    }

    const room = await prisma.room.findFirst({
      where: {
        adminId: id,
        slug: slug,
      },
    });

    if (!room) {
      res.status(404).json({
        success: false,
        message: "Room not found. Please check the details",
      });
      return;
    }

    await prisma.room.delete({
      where: {
        adminId: id,
        slug: room.slug,
      },
    });

    res.status(200).json({
      success: true,
      message: "Room deleted successfully",
    });
    return;
  } catch (error) {
    res.status(500).json({
      success: true,
      message: `Error in deleteRoom: ${error}`,
    });

    return;
  }
};
