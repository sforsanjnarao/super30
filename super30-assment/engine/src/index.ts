import { createClient } from "redis";

const client = createClient();
await client.connect();

let lastId = "0"; // or "$" to read only new messages
type StreamResponse = {
    name: string;
    messages: {
      id: string;
      message: Record<string, string>;
    }[];
  }[];
async function consumeTicker() {
  console.log("Ticker consumer started...");

  while (true) {
    const res= await client.xRead(
      [{ key: "ticker-data", id: lastId }],
      { BLOCK: 0, COUNT: 10 }
    ) as StreamResponse | null 

    if (res) {
      for (const stream of res) {
        for (const [id, fields] of stream.messages) {
          lastId = id;

          const tickerUpdate = Object.fromEntries(
            Object.entries(fields) // now TS knows fields is iterable
          );

          console.log("Processing:", tickerUpdate);

          // TODO: pass to your order-matching engine, DB, etc.
          // e.g. await processTicker(tickerUpdate);
        }
      }
    }
  }
}

consumeTicker().catch(console.error);