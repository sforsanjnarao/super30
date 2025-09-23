import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const protect=async (req:Request,res:Response)=>{
    const {token}=req.cookies

    if(!token) return res.status(401).json({message:'no token found'})

    const decode= await jwt.verify(token, process.env.JWT_PASS as string)
    

}