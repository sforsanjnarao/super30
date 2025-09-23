import type { Request, Response } from 'express';
import prisma from '../lib/prisma.ts';
import bcrypt from 'bcrypt'
import  jwt  from 'jsonwebtoken';

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
    //saving in cookie
    res.cookie('token',token)
    
  res.json({savingUserDataInDB})
};

export const signin=async (req:Request, res:Response)=>{
     res.send("signin")
}