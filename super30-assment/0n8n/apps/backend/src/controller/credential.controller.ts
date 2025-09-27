import type { Request,Response } from "express";

export const getCredential=async (req:Request,res:Response)=>{
  res.send({message:"get the credentials: from here we give user the credentials"})

}

export const postCredential=async (req:Request,res:Response)=>{
    res.send({message:"post the credentials: from here we make use post the credentials"})
  }