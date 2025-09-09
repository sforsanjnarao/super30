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
import { createClient } from 'redis';
const client = createClient();
await client.connect();
const ws = new WebSocket("wss://ws.backpack.exchange");
ws.on("open", () => {
    console.log("Connected!");
    // Send the subscribe message
    const subscribeMsg = {
        method: "SUBSCRIBE",
        params: ["bookTicker.SOL_USDC_PERP"],
        id: 2
    };
    ws.send(JSON.stringify(subscribeMsg));
});
ws.on("message", async (msg) => {
    // console.log("Received:", msg.toString());
    const data = JSON.parse(msg.toString());
    const stuData = await client.xAdd("ticker-data", '*', {
        'timeStamp': String(data.T),
        'asset': String(data.s),
        'bestBid': String(data.b),
        'bestAsk': String(data.a),
    });
    // console.log(stuData);
});
ws.on("error", (err) => {
    console.error("Error:", err);
});
ws.on("close", () => {
    console.log("Connection closed");
});
//# sourceMappingURL=pollerPubliser.js.map