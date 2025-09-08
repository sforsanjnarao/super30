import type { Request, Response } from "express";
import { Router } from 'express';
import { createClient } from 'redis';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
const client = createClient();
await client.connect();
const createTrade= async (req: Request, res:Response) => {
    //adding data to the redis stream
    try {
        const { asset, type, margin, leverage, slippage } = req.body;

        if (!asset || !type || !margin || !leverage || !slippage) {
            return res.status(400).json({ error: 'Missing fields' });
        }

        // Generate a unique id
        const id = uuidv4();

        // Push to Redis stream
        const messageId = await client.xAdd('ticker-data', '*', {
            id,
            asset,
            type,
            margin: margin.toString(),
            leverage: leverage.toString(),
            slippage: slippage.toString(),
        });

        console.log(`Trade added to stream with ID: ${messageId}`);

        res.json({ id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export default router;

const closeTrade=(req:Request,res:Response)=>{
    res.send('close trade')  
}


export {createTrade,closeTrade}