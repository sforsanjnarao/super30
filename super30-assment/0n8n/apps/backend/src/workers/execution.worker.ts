//need to write code for background worker process

/*
The Workhorse: execution.worker.ts (Worker Process)
Responsibility: The heart of the execution. This is a separate process that runs continuously, listening for jobs from the queue.
Flow:
Initializes a listener on the 'execute-node' queue.
When a job is received, it pulls the { executionId, nodeId, inputData } from the payload.
It then calls the master execution service: nodeExecutorService.execute(jobPayload).
After nodeExecutorService returns a result ({ status, outputData, error }), the worker is responsible for the aftermath.
It logs the result by calling executionService.logStep(...).
If the status was a success, it finds the next nodes to run and calls queue.service.ts to add new jobs for them.
If the node failed or there are no more nodes, it calls executionService.finishExecution(...) to update the master Execution record to completed or failed.

*/