import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
    user?:any
}

export const protect=async (req:AuthRequest,res:Response, next:NextFunction)=>{
    const {token}=req.cookies

    if(!token) return res.status(401).json({message:'no token found'})

    const decode= jwt.verify(token, process.env.JWT_PASS as string) 
    req.user=decode
    next()

}