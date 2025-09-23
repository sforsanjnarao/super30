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

  return res.status(201).json({savingUserDataInDB,token:token})
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
    //saving in cookie
    res.cookie('token',token)
    return res.status(201).json({savedUser,token:token})

}