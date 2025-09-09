import { createClient } from "redis";
const client = createClient();
await client.connect();
let lastId = "0";
while (1) {
    console.log('dfjjrff');
    const res = await client.xRead([{ key: "ticker-data", id: '$' }], { BLOCK: 0, COUNT: 10 });
    if (res) {
        const streams = res;
        for (const stream of streams) {
            for (const message of stream.messages) {
                console.log("Processing trade:", message.message);
                lastId = message.id; // move checkpoint
            }
        }
    }
}
//# sourceMappingURL=index.js.map