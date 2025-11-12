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

interface NodeData {
  id: string;
  type: string;
  parameters?: Record<string, any>;
  credentialsId?: string;
  position?: { x: number; y: number };
}

interface ConnectionData {
  id: string;
  source: string;
  target: string;
}


export const toggleWorkflowActivation = async (workflowId: string, userId: string, active: boolean):Promise<any> => {

  const workflow = await getWorkflowById(workflowId, userId);
  if (!workflow) {
    throw new Error("Workflow not found or user does not have permission.");
  }
  
  // const webhookId = active ? nanoid(12) : null;
  let webhookId = workflow.webhookId; 
  

  if (active) {
        const startingNodes = findStartingNodes(workflow.nodes as any , workflow.connections as any);
        
        const hasWebhookTrigger = startingNodes.some(node => node.type === 'webhookNode');

        if (hasWebhookTrigger) {
            if (!webhookId) {
                webhookId = nanoid(12);
            }
        } else {
            webhookId = null;
        }

    } else {
        webhookId = null;
    }


  return prisma.workflow.update({
    where: {
      id: workflowId,
    },
    data: {
      active,
      webhookId,
    },
  }) ;

};

  const findStartingNodes = (nodes: NodeData[], connections: ConnectionData[])=> {
    const targetNodeIds = new Set<string>();
    connections.forEach(conn => {
    if (conn && conn.target) {
      targetNodeIds.add(conn.target);
    }
  });
    return nodes.filter(node => !targetNodeIds.has(node.id));
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