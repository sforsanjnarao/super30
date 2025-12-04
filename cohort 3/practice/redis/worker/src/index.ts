import { createClient } from "redis";
const client = createClient();
async function startWorker() {
    try {
        await client.connect();
        console.log("Worker connected to Redis.");

        // Main loop
        while (true) {
            try {
                const submission = await client.brPop("submission", 0);
                console.log(submission)
                await new Promise(resolve => setTimeout(resolve, 1000));
                await client.publish('trade',JSON.stringify(submission))
            } catch (error) {
                console.error("Error processing submission:", error);
            }
        }
    } catch (error) {
        console.error("Failed to connect to Redis", error);
    }
}

startWorker();