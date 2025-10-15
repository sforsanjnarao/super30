/*The Decoupler: queue.service.ts (Service Layer)
Responsibility: A simple wrapper around a library like BullMQ to add jobs to the queue.
Flow (addJob):
Takes a job name (e.g., 'execute-node') and a payload.
The payload contains everything a worker needs to start: { executionId, nodeId, inputData }.
Adds this payload to the Redis queue.*/
