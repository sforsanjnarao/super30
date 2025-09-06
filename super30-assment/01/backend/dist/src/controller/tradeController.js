// import {createClient} from 'redis'
// const client=createClient()
// client.connect()
// const createTrade=(req:Request,res:Response)=>{
//     const openTrades=async()=>{
//         let entries =await client.xAdd('ticker-data', '+', '-', {COUNT:1})
//         if(!entries || entries.length===0){
//             res.status(400).json({message: 'no live data is availble'}).send('no data found')
//         }
//         let [id, fields]= entries[0]
//         const trade = {
//             id,
//             symbol: fields.symbol,
//             price: parseFloat(fields.price),
//             quantity: parseFloat(fields.quantity),
//             timestamp: parseInt(fields.timestamp),
//           };
//         res.status(200).json({message:'trade created', trade})
//     }
//     openTrades()
// }
// src/routes/trade.ts
import { Router } from 'express';
import { createClient } from 'redis';
import { v4 as uuidv4 } from 'uuid';
const router = Router();
const client = createClient();
await client.connect();
const createTrade = async (req, res) => {
    try {
        const { asset, type, margin, leverage, slippage } = req.body;
        if (!asset || !type || !margin || !leverage || !slippage) {
            return res.status(400).json({ error: 'Missing fields' });
        }
        // Generate a unique id
        const id = uuidv4();
        // Push to Redis stream
        const messageId = await client.xAdd('trades', '*', {
            id,
            asset,
            type,
            margin: margin.toString(),
            leverage: leverage.toString(),
            slippage: slippage.toString(),
        });
        console.log(`Trade added to stream with ID: ${messageId}`);
        res.json({ id });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
export default router;
const closeTrade = (req, res) => {
    res.send('close trade');
};
export { createTrade, closeTrade };
//# sourceMappingURL=tradeController.js.map