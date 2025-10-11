import type { Request, Response } from 'express';
import prisma from '../lib/prisma.ts';
import bcrypt from 'bcrypt'
import  jwt  from 'jsonwebtoken';


import type { JwtPayload } from "jsonwebtoken";

// export interface AuthRequest extends Request {
//   user?: string | JwtPayload;
// }

export const signup= async (req:Request, res:Response)=>{
    const {name,email,password}=req.body;
    if(!name || !email || !password){
        return res.status(400).send({message:"Missing required fields"})
    }
    const existingUser=await prisma.user.findUnique({
        where:{
            email:email
        }
    })
    if(existingUser){
        return res.json({message:"user already exist, try signin", existingUser:existingUser.id})
    }
    let hashedPassword= await bcrypt.hash(password,10)
    const savingUserDataInDB=await prisma.user.create({
        data:{
            userName:name,
            email:email,
            password:hashedPassword
        }
    })
    const token= jwt.sign({id:savingUserDataInDB.id}, process.env.JWT_PASS as string)
  
    res.cookie('token', token, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production',
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: 'strict',
      });
  

  return res.status(201).json({message:"User registered",
    user:{
        id:savingUserDataInDB.id,
        name:savingUserDataInDB.userName,
        email: savingUserDataInDB.email
    }
  })
};

export const signin=async (req:Request, res:Response)=>{
    const {email,password}=req.body
    if( !email || !password){
        return res.status(400).send({message:"Missing required fields"})
    }
    const savedUser=await prisma.user.findUnique({
        where:{
            email:email
        }
    })
    if(!savedUser) return res.status(401).json({message:'please register use first'})
       
        const checkPassword=await bcrypt.compare(password,savedUser.password as string)
    if(!checkPassword) return res.json({message:'wrong credentials'})
        
        
        const token= jwt.sign({id:savedUser.id}, process.env.JWT_PASS as string)
    
        res.cookie('token', token, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production',
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: 'strict',
          });
      

        return res.status(201).json({message:"User registered",
            user:{
                id:savedUser.id,
                name:savedUser.userName,
                email: savedUser.email
            }
          })

}


export const signout= async (req: Request, res: Response)=>{
    res.clearCookie("token").status(201).json({message:"You are finally logged Out"})
}

interface userExtended {
    id:string
}
interface IGetUserAuthInfoRequest extends Request {
    user?: userExtended
  }

export const itsMe=async (req: IGetUserAuthInfoRequest, res: Response)=>{
    if (!req.user) {
        return res.status(401).json({ message: "Not Authenticated" });
      }
    
      try {
        const user = await prisma.user.findUnique({
          where: {
            id: req.user.id,
          },
          select: {
            id: true,
            userName: true,
            email: true,
          },
        });
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
    
        return res.status(200).json(user);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
      }
    
}

// axios.get('/api/protected', {
//     headers: {
//       Authorization: `Bearer ${token}`
//     }
//   });