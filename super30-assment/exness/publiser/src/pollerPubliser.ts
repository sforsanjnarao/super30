// import { createClient } from "redis";

// const redis = createClient();
// await redis.connect();

// const url=

// async function produce() {
//   let i = 1;
//   setInterval(async () => {
//     const messageId = await redis.xAdd(
//       "mystream",      // stream name
//       "*",             // let Redis assign ID
//       { value: `live_data_${i}` } // key-value pair
//     );
//     //console.log("Produced:", messageId);
//     i++;
//   }, 1000); // ever
// produce();
import WebSocket from "ws";
import {createClient} from 'redis'
const client = createClient();

await client.connect();

const ws = new WebSocket("wss://ws.backpack.exchange");

ws.on("open", () => {
  console.log("Connected!");

  // Send the subscribe message
  const subscribeMsg = {
    method: "SUBSCRIBE",
    params: ["trade.SOL_USDC"],
    id: 3
  };

  ws.send(JSON.stringify(subscribeMsg));
});

ws.on("message", async (msg) => {
  // console.log("Received:", msg.toString());

  const data=JSON.parse(msg.toString());
  const trade = data.data;
  // console.log(data);
  const stuData=await client.xAdd(
    "ticker-data",'*',{
    'asset': String(trade.s),
    
    'price': trade.p,
    }
  )
  console.log('asset: ',trade.s,' Price:',trade.p);
});

ws.on("error", (err) => {
  console.error("Error:", err);
});

ws.on("close", () => {
  console.log("Connection closed");
});
