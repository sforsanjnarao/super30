import type { Request, Response } from 'express';
import * as workflowService from '../services/workflow.service.ts'; 

interface User{
    id:string;
    name?:string;
    email?:string;
}

export interface AuthRequest extends Request{
    user?: User
}

// POST /workflows
export const createWorkflowController = async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.body;
    const userId = req.user!.id; 

    if (!name) {
      return res.status(400).json({ message: "Workflow name is required" });
    }

    const newWorkflow = await workflowService.createWorkflow(name, userId);
    res.status(201).json(newWorkflow);
  } catch (error:any) {
    if (error.code === 'P2002') { 
      return res.status(409).json({ message: "A workflow with this name already exists." });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//GET /workflows
export const getAllWorkflowsController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const workflows = await workflowService.getAllWorkflowsForUser(userId);
        res.status(200).json(workflows);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// GET /workflows/:id
export const getWorkflowByIdController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const { id } = req.params as {id:string}
        const workflow = await workflowService.getWorkflowById(id, userId);

        if (!workflow) {
            return res.status(404).json({ message: "Workflow not found" });
        }
        res.status(200).json(workflow);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

//PATCH /workflows/:id
export const updateWorkflowController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const { id } = req.params as {id:string};
        const { nodes, connections } = req.body;

        await workflowService.updateWorkflowGraph(id, userId, nodes, connections);
        res.status(200).json({ message: "Workflow updated successfully" });
    } catch (error:any) {
        res.status(404).json({ message: error.message }); // Service throws error if not found
    }
};

// PUT /workflows/:id/activate
export const activateWorkflowController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const { id } = req.params as {id:string};
        const { active } = req.body;

        if (typeof active !== 'boolean') {
            return res.status(400).json({ message: "The 'active' field must be a boolean." });
        }

        const updatedWorkflow = await workflowService.toggleWorkflowActivation(id, userId, active);
        
        let webhookUrl = null;
        if (updatedWorkflow.active) {
            webhookUrl = `${process.env.BASE_URL}/webhook/handler/${updatedWorkflow.webhookId}`;
        }
        
        res.status(200).json({ workflow: updatedWorkflow, webhookUrl });
    } catch (error:any) {
        res.status(404).json({ message: error.message });
    }
};

//  DELETE /workflows/:id
export const deleteWorkflowController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const { id } = req.params as {id: string};

        await workflowService.deleteWorkflow(id, userId);
        res.status(204).send({message:'workflow deleted'}); 
    } catch (error:any) {
        res.status(404).json({ message: error.message });
    }
}