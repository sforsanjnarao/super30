/*The Decoupler: queue.service.ts (Service Layer)
Responsibility: A simple wrapper around a library like BullMQ to add jobs to the queue.
Flow (addJob):
Takes a job name (e.g., 'execute-node') and a payload.
The payload contains everything a worker needs to start: { executionId, nodeId, inputData }.
Adds this payload to the Redis queue.*/


import { kafka } from '../lib/kafka.ts'; 

const producer = kafka.producer();
let isConnected = false;

const ensureProducerConnected = async () => {
    if (!isConnected) {
        await producer.connect();
        isConnected = true;
    }
}

export const addNodeJobToQueue = async (jobData: { executionId: string, nodeId: string, inputData: any }) => {
    await ensureProducerConnected();
    await producer.send({
        topic: 'node-execution-jobs', 
        messages: [
            { value: JSON.stringify(jobData) },
        ],
    });
    console.log(`🚀 Job sent to Kafka for executionId: ${jobData.executionId}, nodeId: ${jobData.nodeId}`);
};