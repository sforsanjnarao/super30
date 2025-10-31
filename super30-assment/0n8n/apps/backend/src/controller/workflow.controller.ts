
// import type { Request, Response } from 'express';
// import prisma from '../lib/prisma.ts';
// import type {Workflow, Prisma} from '@prisma/client'
// import { nanoid } from 'nanoid';







// export const workflowController=  async (req:Request, res:Response) => {
//     const { name } = req.body;
//     if (!name ) {
//         return res.status(400).send({ message: "Missing required fields" });
//     }

//     try {
//         const createWebFlow:Workflow = await prisma.workflow.create({
//             data:{
//                 name: name,
//             } as Prisma.WorkflowCreateInput
//         })
//         console.log(createWebFlow)
//         res.status(201).json({ message: "Workflow created successfully" , createWebFlow});
//     }  catch (error: any) {
//         console.error("Error creating workflow:", error);
    
//         if (error.code === 'P2002') { 
//             return res.status(400).json({ message: "Workflow name already exists" });
//         }
    
//         res.status(500).json({ message: "Internal Server Error", error: error.message });
//     }
// }
// export const workflowIDController=async (req:Request, res:Response) => {
//     const { id } = req.params;
//     if (!id) {
//         return res.status(400).json({ message: 'Workflow ID is required' });
//       }
//     const allWorkFlows= await prisma.workflow.findUnique({
//         where:{
//             id:id,
//         }
//     })
//     if (!allWorkFlows) {
//         return res.status(404).json({ message: "Workflow not found" });
//     }
//     console.log(allWorkFlows)
//     await prisma.$disconnect()
//     res.send({ message: "Workflow Id created" , allWorkFlows});
// }
// export const ActivateWorkflow =async (req:Request,res:Response)=>{
//     const { id } = req.params;
//     if (!id) {
//         return res.status(400).json({ message: "Workflow ID is required" });
//     }
//     const {active}=req.body //from frontend we need to send tue and false
//     if (typeof active !== 'boolean') {
//         return res.status(400).json({ message: "The 'active' field must be a boolean." });
//     }
//     let webhookId = active ? nanoid(10) : null;
    
//     const updateWorkflow = await prisma.workflow.update({
//         where: {
//             id: id
//         },
//         data: {
//             active,
//             webhookId
//         }
//     });
//     const webhookUrl=`${process.env.LOCAL_SERVER}/webhook/handler/${webhookId}`
//     res.status(201).send({message:"successfully make a url",updateWorkflow, webhookUrl})
// } 
// export const getAllWorkflowsController= async(req:Request,res:Response)=>{
//         const allWorkflow= await prisma.workflow.findMany();
//         res.status(200).json({message: 'got the all workflows', workflow: allWorkflow})
// }

// export const updateWorkflowController = async (req: Request, res: Response) => {
//     const { id } = req.params;
//     if (!id) {
//         throw new Error("Workflow ID is required");
//       }

//     const { nodes, connections } = req.body;
//       //add validation for nodes and connection is an array

//       console.log(id, nodes, connections)
//     const updatedWorkflow = await prisma.workflow.update({
//         where: { id: id } ,
//         data: {
//             nodes,
//             connections,
//         },
//     });
//     res.status(200).json({ message: "Workflow updated successfully", updatedWorkflow });
// };


// export const startButtonForManualTrigger= async (req:Request,res:Response)=>{
//     res.send({message:"this is the start button for the manual trigger"})
// }



//the work of this to only create new workflow
// export const workflowController=  async (req:Request, res:Response) => {
//     const { name, nodes, connections, active,settings, staticData } = req.body;
//     if (!name || !nodes || !connections) {
//         return res.status(400).send({ message: "Missing required fields" });
//     }

//     const createWebFlow:Workflow = await prisma.workflow.create({
//         data:{
//             name: name,
//             active: active,
//             nodes: nodes,
//             connections: connections,
//             settings: settings,
//             staticData: staticData,
//         } as Prisma.WorkflowCreateInput
//     })
//     console.log(createWebFlow)
//     res.status(201).json({ message: "Workflow created successfully" , createWebFlow});
// }






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
    const userId = req.user!.id; // From 'protect' middleware

    if (!name) {
      return res.status(400).json({ message: "Workflow name is required" });
    }

    const newWorkflow = await workflowService.createWorkflow(name, userId);
    res.status(201).json(newWorkflow);
  } catch (error:any) {
    if (error.code === 'P2002') { // Prisma's unique constraint violation
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
            webhookUrl = `${process.env.BASE_URL}/webhooks/handler/${updatedWorkflow.webhookId}`;
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