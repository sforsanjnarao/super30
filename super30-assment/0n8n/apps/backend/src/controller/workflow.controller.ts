
import type { Request, Response } from 'express';
import prisma from '../lib/prisma.ts';
import type {Workflow, Prisma} from '@prisma/client'
import { nanoid } from 'nanoid';



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



export const workflowController=  async (req:Request, res:Response) => {
    const { name } = req.body;
    if (!name ) {
        return res.status(400).send({ message: "Missing required fields" });
    }

    try {
        const createWebFlow:Workflow = await prisma.workflow.create({
            data:{
                name: name,
            } as Prisma.WorkflowCreateInput
        })
        console.log(createWebFlow)
        res.status(201).json({ message: "Workflow created successfully" , createWebFlow});
    }  catch (error: any) {
        console.error("Error creating workflow:", error);
    
        if (error.code === 'P2002') { 
            return res.status(400).json({ message: "Workflow name already exists" });
        }
    
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}
export const workflowIDController=async (req:Request, res:Response) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: 'Workflow ID is required' });
      }
    const allWorkFlows= await prisma.workflow.findUnique({
        where:{
            id:id,
        }
    })
    if (!allWorkFlows) {
        return res.status(404).json({ message: "Workflow not found" });
    }
    console.log(allWorkFlows)
    await prisma.$disconnect()
    res.send({ message: "Workflow Id created" , allWorkFlows});
}
export const ActivateWorkflow =async (req:Request,res:Response)=>{
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: "Workflow ID is required" });
    }
    const {active}=req.body
    if (typeof active !== 'boolean') {
        return res.status(400).json({ message: "The 'active' field must be a boolean." });
    }
    let webhookId;
    if(active){
        webhookId= nanoid(10)
    } 
    const updateWorkflow = await prisma.workflow.update({
        where: {
            id: id},
        data: {
            active: true,
            webhookUrl: webhookId  ?? null
        }
    });
    const webhookUrl=`${process.env.LOCAL_SERVER}/webhook/handler/${webhookId}`
    res.status(201).send({message:"successfully make a url",updateWorkflow, webhookUrl})

    res.send({message:"activate workflow"}) // when some message comes it gonna hig thi 
} 
export const getAllWorkflowsController= async(req:Request,res:Response)=>{
        const allWorkflow= await prisma.workflow.findMany();
        res.status(200).json({message: 'got the all workflows', workflow: allWorkflow})
}

export const updateWorkflowController = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
        throw new Error("Workflow ID is required");
      }

    const { nodes, connections } = req.body;
      //add validation for nodes and connection is an array

    const updatedWorkflow = await prisma.workflow.update({
        where: { id: id } ,
        data: {
            nodes,
            connections,
        },
    });
    res.status(200).json({ message: "Workflow updated successfully", updatedWorkflow });
};


export const startButtonForManualTrigger= async (req:Request,res:Response)=>{
    res.send({message:"this is the start button for the manual trigger"})
}

