/*The Conductor: execution.service.ts (Service Layer)
Responsibility: Manage the state of a workflow execution as a whole.
Flow (startWorkflowFromWebhook):
Uses prisma.workflow.findUnique(...) to find the workflow by its webhookId.
If not found or inactive, it throws an error.
Uses prisma.execution.create(...) to create a new Execution record in the database with status: 'running'.
Finds the starting node(s) of the workflow.
Calls queue.service.ts to add the first job(s) to the queue.
Returns the new Execution object to the controller.*/



import type { Prisma } from '@prisma/client';
import prisma from '../lib/prisma.ts';
import { addNodeJobToQueue } from './queue.service.ts';
import type { WebhookData } from '../controller/webhook.controller.ts';


export interface NodeData {
  id: string;
  type: string;
  parameters?: Record<string, any>;
  credentialsId?: string;
  position?: { x: number; y: number };
}

export interface ConnectionData {
  id: string;
  source: string;
  target: string;
}




export const startWorkflowFromWebhook = async (webhookId: string, webhookData:WebhookData) => {
    // 1. Find the active workflow associated with this webhook URL.
    const workflow = await prisma.workflow.findUnique({
        where: { webhookId, active: true }
    });

    if (!workflow) {
        throw new Error("Active workflow for this webhook not found.");
    }
     

    //for prisma don't complain in runtime because of webhookData
    const safeWebhookData = JSON.parse(JSON.stringify(webhookData))
    // 2. Create the master Execution record for tracking.
    const execution = await prisma.execution.create({
        data: {
            workflowId: workflow.id,
            status: 'running',
            data: safeWebhookData as Prisma.InputJsonValue, 
            //	   •	Prisma enforces that Json fields must contain serializable JSON objects.
            //     •	Adding [key: string]: any makes your interface compatible with that.
            //     •	Casting as Prisma.InputJsonValue tells the compiler,
            // “Yes, this object is safe to store as JSON.”
        }
    });
//       // 3️⃣ Safely cast JSON fields
  const nodes = (workflow.nodes ?? []) as unknown as NodeData[];
  const connections = (workflow.connections ?? []) as unknown as ConnectionData[];

    // 3. Find ALL starting nodes (nodes with no incoming connections).
    const allStartingNodes = findStartingNodes(nodes  , connections);

    // 4. Find the specific webhook trigger node among the starting nodes.
    const webhookTriggerNode = allStartingNodes.find(node => node.type === 'webhookNode');

    if (!webhookTriggerNode) {
        // This is a safety check. This should never happen if the activation logic is correct.
        await finishExecution(execution.id, 'failed', { error: 'Workflow has a webhook URL but no webhook trigger node.' });
        throw new Error("Workflow is misconfigured. No webhook trigger node found.");
    }
    

    // 5. --- THE CRITICAL "SKIP" LOGIC ---
    // Find the nodes that are connected DIRECTLY AFTER the webhook trigger node.
    const firstRealNodeIds = connections
        .filter(conn => conn.source === webhookTriggerNode.id)
        .map(conn => conn.target);
        console.log('---we found the first Real Node',firstRealNodeIds)
    
    if (firstRealNodeIds.length === 0) {
        // The webhook is not connected to anything. The workflow is done.
        console.log(`[Execution] Webhook for execution ${execution.id} received, but trigger is not connected. Finishing.`);
        await finishExecution(execution.id, 'completed');
        return execution;
    }

    // 6. For each of these "first real nodes", create a job in the Kafka queue.
    for (const nodeId of firstRealNodeIds) {
        await addNodeJobToQueue({
            executionId: execution.id,
            nodeId: nodeId,
            inputData: webhookData, // Pass the initial webhook data to the first real node(s).
        });
    }
    
    console.log(`[Execution] Started execution ${execution.id} for workflow ${workflow.id}. Enqueued ${firstRealNodeIds.length} starting job(s).`);

    return execution;
};

// We will need this utility function
// Create a file: src/utils/workflow-utils.ts
export const findStartingNodes = (nodes:NodeData[], connections: ConnectionData[] ):NodeData[] => {
    const targetNodeIds = new Set(connections.map(conn => conn.target));
    return nodes.filter((node) => !targetNodeIds.has(node.id));
};
// this function i also made it in execution.worker.ts so think before changing any thing  
export const finishExecution = async (executionId: string, status: 'completed' | 'failed', error?: any) => {
    return prisma.execution.update({
        where: { id: executionId },
        data: {
            status,
            error,
            finishedAt: new Date(),
        }
    });
};
