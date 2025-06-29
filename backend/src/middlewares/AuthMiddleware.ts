import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const authMiddleWare = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies["jwt"];
    if (!token) {
      res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err: any, id: any) => {
      if (err) {
        res.status(401).json({
          success: false,
          message: "Unauthorized: Invalid token",
        });
        return;
      }

      req.id = id;

      next();
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error in middleware: ${error}`,
    });
    return;
  }
};
