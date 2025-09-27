
import type { Request, Response } from 'express';
import prisma from '../lib/prisma.ts';
import type {Workflow, Prisma} from '@prisma/client'
import { nanoid } from 'nanoid';




export const workflowController=  async (req:Request, res:Response) => {
    const { name, nodes, connections, active,settings, staticData } = req.body;
    if (!name || !nodes || !connections) {
        return res.status(400).send({ message: "Missing required fields" });
    }

    const createWebFlow:Workflow = await prisma.workflow.create({
        data:{
            name: name,
            active: active,
            nodes: nodes,
            connections: connections,
            settings: settings,
            staticData: staticData,
        } as Prisma.WorkflowCreateInput
    })
    console.log(createWebFlow)
    res.status(201).json({ message: "Workflow created successfully" , createWebFlow});
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
    const webhookId = nanoid(10);
    const updateWorkflow = await prisma.workflow.update({
        where: {
            id: id
        },
        data: {
            active: true,
            webhookId: webhookId
        }
    });
    const webhookUrl=`${process.env.LOCAL_SERVER}/webhook/handler/${webhookId}`
    res.status(201).send({message:"successfully make a url",updateWorkflow, webhookUrl})

    res.send({message:"activate workflow"})
}

export const startButtonForManualTrigger= async (req:Request,res:Response)=>{
    res.send({message:"this is the start button for the manual trigger"})
}

