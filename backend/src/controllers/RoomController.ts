import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { roomSchema } from "../Schemas/UserSchema";

export const createRoom = async (req: Request, res: Response) => {
  try {
    const id = req.id;
    const data = roomSchema.safeParse(req.body);

    const user = await prisma.user.findFirst({
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

    const room = await prisma.room.create({
      data: {
        adminId: user.id,
        slug: data.data?.slug!,
      },
    });

    res.status(201).json({
      success: true,
      message: "",
    });
  } catch (error) {}
};

export const joinRoom = (req: Request, res: Response) => {
  try {
    let { roomId } = req.body;
  } catch (error) {}
};

export const deleteRoom = (req: Request, res: Response) => {
  try {
    let { roomId } = req.body;
  } catch (error) {}
};
