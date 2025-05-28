import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const authMiddleWare = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let authHeaders = req.headers["authorization"];

    const token = authHeaders && authHeaders.split(" ")[1];

    if (!token) {
      res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (error, id) => {
      if (error) {
        res.status(401).json({
          success: false,
          message: "Unauthorized: invalid token",
        });
      }

      req.id = id as string;

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
