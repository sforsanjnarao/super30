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

export const updateWorkflowGraph = async (workflowId: string, userId: string, nodes: any[], connections: any) => {
  const result = await prisma.workflow.updateMany({
    where: {
      id: workflowId,
      authorId: userId, 
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

export const toggleWorkflowActivation = async (workflowId: string, userId: string, active: boolean) => {

    //from above
  const workflow = await getWorkflowById(workflowId, userId);
  if (!workflow) {
    throw new Error("Workflow not found or user does not have permission.");
  }
  
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


export const deleteWorkflow = async (workflowId: string, userId: string) => {
    const result = await prisma.workflow.deleteMany({
        where: {
            id: workflowId,
            authorId: userId 
        }
    });

    if (result.count === 0) {
        throw new Error("Workflow not found or user does not have permission.");
    }

    return { success: true };
}