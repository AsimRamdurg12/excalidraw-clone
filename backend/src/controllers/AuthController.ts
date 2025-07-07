import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { CreateUserSchema, signInSchema } from "../Schemas/UserSchema";
import { prisma } from "../utils/prisma";
import { sendResetEmail } from "../utils/resend";

export const signUp = async (req: Request, res: Response) => {
  try {
    const data = CreateUserSchema.safeParse(req.body);

    if (!data.success) {
      res.status(400).json({
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
      res.status(400).json({
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

    res.cookie("jwt", token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: false,
    });

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

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User to found. Enter a valid email.",
      });
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const resetToken = await bcrypt.hash(otp, 5);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        resetToken: resetToken,
        tokenExpiresAt: Date.now() + 5 * 60 * 1000,
      },
    });

    await sendResetEmail(email, otp);

    res.status(201).json({
      success: true,
      message: "OTP has been sent to your mail.",
    });
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error in forgotPassword: ${error}`,
    });
    return;
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    if (user?.tokenExpiresAt! < Date.now()) {
      res.status(403).json({
        success: false,
        message: "OTP expired. Generate a new one.",
      });
      return;
    }

    const verify = bcrypt.compare(user?.resetToken!, otp);

    if (!verify) {
      res.status(401).json({
        success: false,
        message: "OTP doesn't match",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "OTP verified",
    });
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error in verifyOTP: ${error}`,
    });
    return;
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    const updateHashPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        password: updateHashPassword,
      },
    });

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error in updatePassword: ${error}`,
    });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const id = req.id;

    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: user,
    });
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error in getProfile: ${error}`,
    });
    return;
  }
};
