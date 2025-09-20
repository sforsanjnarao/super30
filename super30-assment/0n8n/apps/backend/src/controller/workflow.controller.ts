
import type { Request, Response } from 'express';
import prisma from '../lib/prisma.ts';

export const workflowController=  async (req:Request, res:Response) => {
    const { name, nodes, connections } = req.body;
    if (!name || !nodes || !connections) {
        return res.status(400).send({ message: "Missing required fields" });
    }

    const createWebFlow= await prisma.WorkflowEntity.create({
        data:{
            name,
            nodes,
            connections
        }
    })
    console.log(createWebFlow)
    res.status(201).json({ message: "Workflow created successfully" , createWebFlow});
}
export const workflowIDController=async (req:Request, res:Response) => {
    const { id } = req.params;
    const allWorkFlows= await prisma.WorkflowEntity.findUnique({
        where:{
            id:id
        }
    })
    if (!allWorkFlows) {
        return res.status(404).json({ message: "Workflow not found" });
    }
    console.log(allWorkFlows)
    await prisma.$disconnect()
    res.send({ message: "Workflow Id created" });
}