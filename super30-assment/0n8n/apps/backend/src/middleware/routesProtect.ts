import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
    user?:{ id: string }
}




export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: "No token found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_PASS as string);

    if (typeof decoded === "object" && "id" in decoded) {
      req.user = { id: decoded.id as string };
    //{id:"745686563763", iat:1760173861}
      next();
    } else {
      return res.status(401).json({ message: "Invalid token payload" });
    }
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
    //export const verifyToken = (req:AuthRequest,res:Response, next:NextFunction) => {
    //     const authHeader = req.headers["authorization"];
    //     const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN
      
    //     if (!token) return res.status(401).json({ message: "No token provided" });
      
    //     try {
    //       const decoded = jwt.verify(token, process.env.JWT_PASS as string);
    //       req.user = decoded; // attach user info
    //       next();
    //     } catch (err) {
    //       return res.status(403).json({ message: "Invalid or expired token" });
    //     }
    //   };