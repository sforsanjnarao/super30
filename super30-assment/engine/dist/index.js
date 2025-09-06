import { createClient } from "redis";
const client = createClient();
await client.connect();
let lastId = "0"; // or "$" to read only new messages
async function consumeTicker() {
    console.log("Ticker consumer started...");
    while (true) {
        const res = await client.xRead([{ key: "ticker-data", id: lastId }], { BLOCK: 0, COUNT: 10 });
        if (res) {
            for (const stream of res) {
                for (const [id, fields] of stream.messages) {
                    lastId = id;
                    const tickerUpdate = Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, v]));
                    console.log("Processing:", tickerUpdate);
                    // TODO: pass to your order-matching engine, DB, etc.
                    // e.g. await processTicker(tickerUpdate);
                }
            }
        }
    }
}
consumeTicker().catch(console.error);
//# sourceMappingURL=index.js.map