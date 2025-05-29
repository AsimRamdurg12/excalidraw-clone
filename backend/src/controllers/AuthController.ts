import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { CreateUserSchema, signInSchema } from "../Schemas/UserSchema";
import { prisma } from "../utils/prisma";

export const signUp = async (req: Request, res: Response) => {
  try {
    const data = CreateUserSchema.safeParse(req.body);

    if (!data.success) {
      res.json({
        message: data.error,
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: data.data?.email,
      },
    });
    if (user) {
      res.status(401).json({
        success: false,
        message: "User already exists",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(data.data?.password as string, 10);

    const newUser = await prisma.user.create({
      data: {
        name: data.data?.name!,
        email: data.data?.email!,
        password: hashedPassword,
        photo: data.data?.photo!,
      },
    });

    res.status(201).json({
      success: true,
      message: newUser,
    });
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error in signUp: ${error}`,
    });
    return;
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const data = signInSchema.safeParse(req.body);

    if (!data.success) {
      res.json({
        message: data.error,
      });
    }

    const user = await prisma.user.findFirst({
      where: {
        email: data.data?.email,
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    const verifyPassword = await bcrypt.compare(
      data.data?.password as string,
      user.password
    );

    if (!verifyPassword) {
      res.status(401).json({
        success: false,
        message: "Incorrect email or password",
      });
      return;
    }

    const token = jwt.sign(user.id, process.env.JWT_SECRET as string);

    res.status(200).json({
      success: true,
      message: token,
    });
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error in signIn: ${error}`,
    });
    return;
  }
};
