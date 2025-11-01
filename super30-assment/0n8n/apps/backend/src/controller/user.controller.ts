import type { Request, Response } from 'express';
import prisma from '../lib/prisma.ts';
import bcrypt from 'bcrypt'
import  jwt  from 'jsonwebtoken';


import type { JwtPayload } from "jsonwebtoken";



import { getUser, signinUser, signupUser } from '../services/user.service.ts'; // Import the service


//router.post("/signup", signup)
export const signup = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).send({ message: "Missing required fields" });
        }

        const savedUser = await signupUser({ name, email, password });

        const token = jwt.sign({ id: savedUser.id }, process.env.JWT_PASS as string,{ expiresIn: "7d" });
        res.cookie('token', token, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production',
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            // sameSite: 'strict',
            sameSite: "lax",
            
        });

        return res.status(200).json({
            message: "User registered",
            user: {
                id: savedUser.id,
                name: savedUser.userName,
                email: savedUser.email
            }
        });

    } catch (error:any) {   //why only the type any
        if (error.message === "User already exists") {
            return res.status(409).json({ message: error.message }); 
        }
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

//router.post("/signin", signin)
export const signin=async (req:Request, res:Response)=>{
  try{
    const {email,password}=req.body
    if( !email || !password){
        return res.status(400).send({message:"Missing required fields"})
    }
        const savedUser= await signinUser({email, password})
        
        const token= jwt.sign({id:savedUser.id}, process.env.JWT_PASS as string)
    
        res.cookie('token', token, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production',
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            // sameSite: 'strict',
            sameSite: "lax",
          });
      

        return res.status(201).json({message:"User signed in successfully",
            user:{
                id:savedUser.id,
                name:savedUser.userName,
                email: savedUser.email
            }
          })
        }catch (error: any) {
          return res.status(401).json({ message: error.message });
        }
}

//router.post("/signout", signout)
export const signout= async (req: Request, res: Response)=>{
    res.clearCookie("token").status(201).json({message:"You are finally logged Out"})
}

interface userExtended {
    id:string
}
interface IGetUserAuthInfoRequest extends Request {
    user?: userExtended
  }


// router.get("/me", protect,itsMe)
export const itsMe=async (req: IGetUserAuthInfoRequest, res: Response)=>{
    if (!req.user) {
        return res.status(401).json({ message: "Not Authenticated" });
      }
    
      try {
        const user = await getUser(req.user.id)
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