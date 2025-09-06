import type { Request, Response } from "express";

import {createClient} from 'redis'
const client=createClient()
client.connect()
const createTrade=(req:Request,res:Response)=>{
    const openTrades=async()=>{
        let entries =await client.xAdd('ticker-data', '+', '-', {COUNT:1})
        if(!entries || entries.length===0){
            res.status(400).json({message: 'no live data is availble'}).send('no data found')
        }
        let [id, fields]= entries[0]
        const trade = {
            id,
            symbol: fields.symbol,
            price: parseFloat(fields.price),
            quantity: parseFloat(fields.quantity),
            timestamp: parseInt(fields.timestamp),
          };
        res.status(200).json({message:'trade created', trade})
    }
    openTrades()
}

const closeTrade=(req:Request,res:Response)=>{
    res.send('close trade')  
}


export {createTrade,closeTrade}