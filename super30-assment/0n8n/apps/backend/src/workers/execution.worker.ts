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



// import { kafka } from '../lib/kafka.ts';
// import prisma from '../lib/prisma.ts'; // We need direct DB access for logging/updating

// // Import the services the worker will orchestrate
// import { executeNode  } from '../services/node-executor.service.ts';
// import { addNodeJobToQueue } from '../services/queue.service.ts';

// const consumer = kafka.consumer({ groupId: 'workflow-execution-group' });

// /**
//  * The main worker function. Listens for jobs from Kafka and processes them.
//  */
// export const startWorker = async () => {
//   await consumer.connect();
//   await consumer.subscribe({ topic: 'node-execution-jobs', fromBeginning: true });
//   console.log('✅ Worker started and subscribed to "node-execution-jobs" topic.');

//   await consumer.run({
//     eachMessage: async ({ message }) => {
//       const job = JSON.parse(message.value.toString());
//       const { executionId, nodeId, inputData } = job;

//       console.log(`[WORKER] Received job for Execution: ${executionId}, Node: ${nodeId}`);

//       // Fetch the full workflow context once for the current job
//       const execution = await prisma.execution.findUnique({
//         where: { id: executionId },
//         include: { workflow: true }
//       });

//       if (!execution || !execution.workflow) {
//           console.error(`[WORKER] FATAL: Could not find execution or workflow for ID: ${executionId}`);
//           return; // Stop processing this job
//       }

//       const { workflow } = execution;
      
//       try {
//         // STEP 1: Execute the node's logic via the Node Executor Service
//         const output = await nodeExecutorService(workflow, nodeId, inputData);

//         // STEP 2: Log the successful step
//         await logStep(executionId, nodeId, inputData, output.result, 'success');

//         // STEP 3: Find the next nodes based on connections
//         const nextNodes = findNextNodes(nodeId, workflow.connections);

//         if (nextNodes.length > 0) {
//           // STEP 4: Enqueue jobs for the next nodes
//           for (const nextNodeId of nextNodes) {
//             await addNodeJobToQueue({
//               executionId: executionId,
//               nodeId: nextNodeId,
//               inputData: output.result, // Pass the result as input to the next node
//             });
//           }
//         } else {
//           // STEP 5: This is a terminal node, finish the execution
//           console.log(`[WORKER] Workflow branch finished for Execution: ${executionId}`);
//           await finishExecution(executionId, 'completed');
//         }
//       } catch (error:any) {
//         console.error(`[WORKER] ERROR processing Node ${nodeId} for Execution ${executionId}:`, error);
        
//         // Log the failure
//         await logStep(executionId, nodeId, inputData, { error: error.message }, 'failed');
        
//         // Mark the entire workflow as failed
//         await finishExecution(executionId, 'failed', { error: error.message });
//       }
//     },
//   });
// };


// // --- Helper functions for the worker ---

// /**
//  * Finds the IDs of the nodes connected to the output of the current node.
//  */
// const findNextNodes = (currentNodeId: string, connections: any): string[] => {
//   return connections[currentNodeId] || [];
// };

// /**
//  * Creates a log entry for a single node execution step.
//  */
// const logStep = async (executionId: string, nodeId: string, input: any, output: any, status: 'success' | 'failed') => {
//     // In a real app, you might want to fetch nodeType/nodeName here as well for richer logs
//     return prisma.executionLog.create({
//         data: {
//             executionId,
//             nodeId,
//             status,
//             inputData: input,
//             outputData: output,
//         }
//     });
// };

// /**
//  * Updates the master Execution record to a final state (completed or failed).
//  */
// const finishExecution = async (executionId: string, status: 'completed' | 'failed', error?: any) => {
//     // Note: This is a simplified approach. A more robust system would check if all parallel branches are complete
//     // before marking the entire execution as 'completed'. For now, this works for linear workflows.
//     return prisma.execution.update({
//         where: { id: executionId },
//         data: {
//             status,
//             error,
//             finishedAt: new Date(),
//         }
//     });
// };

// // --- Start the worker ---
// startWorker().catch(console.error);










import { error } from 'console';
import { kafka } from '../lib/kafka.ts';
import prisma from '../lib/prisma.ts';

// 1. Correct the import to match the exported function name
import { executeNode } from '../services/node-executor.service.ts';
import { addNodeJobToQueue } from '../services/queue.service.ts';

const consumer = kafka.consumer({ groupId: 'workflow-execution-group' });

export const startWorker = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'node-execution-jobs', fromBeginning: true });
  console.log('✅ Worker started and subscribed to "node-execution-jobs" topic.');

  await consumer.run({
    eachMessage: async ({ message }) => {
        if(message.value==null) throw error('no data found')
      const job = JSON.parse(message.value.toString());
      const { executionId, nodeId, inputData } = job;

      console.log(`[WORKER] Received job for Execution: ${executionId}, Node: ${nodeId}`);

      // The worker no longer needs to fetch the workflow.
      // This is now the responsibility of the node-executor service.
      
      try {
        // STEP 1: Call the service correctly with the single 'job' object.
        const output = await executeNode(job);

        // STEP 2: Log the successful step
        await logStep(executionId, nodeId, inputData, output.result, 'success');

        // We need to fetch the workflow here just to find the next nodes.
        const workflow = await getWorkflowForExecution(executionId);
        if (!workflow) {
            throw new Error(`[WORKER] Could not find workflow to determine next steps for execution: ${executionId}`);
        }
        
        // STEP 3: Find the next nodes based on connections
        const nextNodes = findNextNodes(nodeId, workflow.connections);

        if (nextNodes.length > 0) {
          // STEP 4: Enqueue jobs for the next nodes
          for (const nextNodeId of nextNodes) {
            await addNodeJobToQueue({
              executionId: executionId,
              nodeId: nextNodeId,
              inputData: output.result,
            });
          }
        } else {
          // STEP 5: This is a terminal node, finish the execution
          console.log(`[WORKER] Workflow branch finished for Execution: ${executionId}`);
          await finishExecution(executionId, 'completed');
        }
      } catch (error:any) {
        console.error(`[WORKER] ERROR processing Node ${nodeId} for Execution ${executionId}:`, error);
        
        await logStep(executionId, nodeId, inputData, { error: error.message }, 'failed');
        await finishExecution(executionId, 'failed', { error: error.message });
      }
    },
  });
};

// --- Helper functions ---

const getWorkflowForExecution = async (executionId: string) => {
    const execution = await prisma.execution.findUnique({
        where: { id: executionId },
        select: { workflow: true }
    });
    return execution?.workflow;
}

const findNextNodes = (currentNodeId: string, connections: any): string[] => {
  return connections[currentNodeId] || [];
};

const logStep = async (executionId: string, nodeId: string, input: any, output: any, status: 'success' | 'failed') => {
    return prisma.executionLog.create({
        data: {
            executionId,
            nodeId,
            status,
            // nodeName,
            // nodeType,
            inputData: input,
            outputData: output,

        }
    });
};

const finishExecution = async (executionId: string, status: 'completed' | 'failed', error?: any) => {
    return prisma.execution.update({
        where: { id: executionId },
        data: {
            status,
            error,
            finishedAt: new Date(),
        }
    });
};

// --- Start the worker ---
startWorker().catch(console.error);

// ### Summary of Changes and Why They Are Correct

// 1.  **Correct Import:** The import is now `import { executeNode } from ...` which matches the export from the service file.
// 2.  **Simplified Worker Logic:** The worker no longer fetches the `execution` and `workflow` records at the beginning. Its only job is to pass the `job` object directly to the `executeNode` service.
// 3.  **Correct Function Call:** The call is now `await executeNode(job);`, which perfectly matches the function signature in `node-executor.service.ts`.
// 4.  **Clear Responsibility:** This change solidifies our architecture.
//     *   The **Worker** is the orchestrator.
//     *   The **Executor Service** is responsible for all the details of executing a single node, including fetching its own data.

// You have now successfully connected the two most complex parts of the backend. Thank you for being so thorough in your review—you have made the final design much stronger and more correct.