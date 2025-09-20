
import type { Request, Response } from 'express';
import prisma from '../lib/prisma.ts';

export const workflowController=  async (req:Request, res:Response) => {
    const { name, nodes, connections } = req.body;
    if (!name || !nodes || !connections) {
        return res.status(400).send({ message: "Missing required fields" });
    }

    const createWebFlow= await prisma.workflowEntity.create({
        data:{
            name: "Test workflow",
            active: true,
            nodes: [],
            connections: [],
            settings: "",
            staticData: "",
        }
    })
    console.log(createWebFlow)
    res.status(201).json({ message: "Workflow created successfully" , createWebFlow});
}
export const workflowIDController=async (req:Request, res:Response) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: 'Workflow ID is required' });
      }
    const allWorkFlows= await prisma.workflowEntity.findUnique({
        where:{
            id:id,
        }
    })
    if (!allWorkFlows) {
        return res.status(404).json({ message: "Workflow not found" });
    }
    console.log(allWorkFlows)
    await prisma.$disconnect()
    res.send({ message: "Workflow Id created" });
}