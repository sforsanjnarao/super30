/*The Conductor: execution.service.ts (Service Layer)
Responsibility: Manage the state of a workflow execution as a whole.
Flow (startWorkflowFromWebhook):
Uses prisma.workflow.findUnique(...) to find the workflow by its webhookId.
If not found or inactive, it throws an error.
Uses prisma.execution.create(...) to create a new Execution record in the database with status: 'running'.
Finds the starting node(s) of the workflow.
Calls queue.service.ts to add the first job(s) to the queue.
Returns the new Execution object to the controller.*/



import prisma from '../lib/prisma.ts';
import { addNodeJobToQueue } from './queue.service.ts';

export const startWorkflowFromWebhook = async (webhookId: string, webhookData: any) => {
    // 1. Find the workflow that should be triggered
    const workflow = await prisma.workflow.findUnique({
        where: { webhookId, active: true }
    });

    if (!workflow) {
        throw new Error("Active workflow for this webhook not found.");
    }

    // 2. Create the master Execution record
    const execution = await prisma.execution.create({
        data: {
            workflowId: workflow.id,
            status: 'running',
            data: webhookData, // Save the initial trigger data
        }
    });

    // 3. Find the first node(s) to execute
    const startingNodes = findStartingNodes(workflow.nodes, workflow.connections);
    if (startingNodes.length === 0) {
        // No start node, so we finish the execution immediately
        await prisma.execution.update({
            where: { id: execution.id },
            data: { status: 'completed', finishedAt: new Date() }
        });
        return execution;
    }

    // 4. For each starting node, add a job to the Kafka queue
    for (const startNode of startingNodes) {
        await addNodeJobToQueue({
            executionId: execution.id,
            nodeId: startNode.id,
            inputData: webhookData, // The first node gets the webhook data
        });
    }

    return execution;
};

// We will need this utility function
// Create a file: src/utils/workflow-utils.ts
export const findStartingNodes = (nodes:any, connections:any ) => {
    const targetNodeIds = new Set(Object.values(connections).flat());
    return nodes.filter((node:any) => !targetNodeIds.has(node.id));
};