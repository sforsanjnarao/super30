import type { Request, Response } from "express";

const createTrade=(req:Request,res:Response)=>{
    
}

const closeTrade=(req:Request,res:Response)=>{
    res.send('close trade')
}


export {createTrade,closeTrade}