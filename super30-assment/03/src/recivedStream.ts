// import { createClient } from "redis";

// const redis = createClient();
// await redis.connect();

// async function consume() {
//   let lastId = "0";

//   while (true) {
//     const data = await redis.xRead(
//       { key: "mystream", id: lastId },
//       { BLOCK: 100, COUNT: 1 } // every 100ms sec
//     );

//     if (data) {
//       for (const stream of data) {
//         for (const message of stream.messages) {
//           console.log("Consumed:", message.id, message.message);
//           lastId = message.id;
//         }
//       }
//     }
//   }
// }

// consume();



import {createClient} from "redis";
const client = createClient().connect();






