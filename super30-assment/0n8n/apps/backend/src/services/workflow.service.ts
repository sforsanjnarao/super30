import { nanoid } from 'nanoid';
import prisma from '../lib/prisma.ts';

export const createWorkflow = async (name: string, userId: string) => {
  return prisma.workflow.create({
    data: {
      name,
      authorId: userId, 
    },
  });
};

export const getAllWorkflowsForUser = async (userId: string) => {
  return prisma.workflow.findMany({
    where: {
      authorId: userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const getWorkflowById = async (workflowId: string, userId: string) => {
  return prisma.workflow.findFirst({
    where: {
      id: workflowId,
      authorId: userId, 
    },
  });
};

// Service to UPDATE the nodes and connections of a workflow
export const updateWorkflowGraph = async (workflowId: string, userId: string, nodes: any[], connections: any) => {
  // Using updateMany ensures we only update if the authorId matches.
  const result = await prisma.workflow.updateMany({
    where: {
      id: workflowId,
      authorId: userId, // CRITICAL: Security check
    },
    data: {
      nodes,
      connections,
    },
  });

  if (result.count === 0) {
    throw new Error("Workflow not found or user does not have permission.");
  }

  return { success: true };
};

// Service to ACTIVATE or DEACTIVATE a workflow and its webhook
export const toggleWorkflowActivation = async (workflowId: string, userId: string, active: boolean) => {
  // First, verify ownership
  const workflow = await getWorkflowById(workflowId, userId);
  if (!workflow) {
    throw new Error("Workflow not found or user does not have permission.");
  }
  
  // Generate a new webhookId only when activating. Set to null when deactivating.
  const webhookId = active ? nanoid(12) : null;

  return prisma.workflow.update({
    where: {
      id: workflowId,
    },
    data: {
      active,
      webhookId,
    },
  });
};


// Service to DELETE a workflow
export const deleteWorkflow = async (workflowId: string, userId: string) => {
    // We use deleteMany to ensure we only delete if the authorId matches.
    const result = await prisma.workflow.deleteMany({
        where: {
            id: workflowId,
            authorId: userId // CRITICAL: Security check
        }
    });

    if (result.count === 0) {
        throw new Error("Workflow not found or user does not have permission.");
    }

    return { success: true };
}