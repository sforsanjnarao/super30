import type { Request, Response } from 'express';
import prisma from '../lib/prisma.ts';
import type { Prisma, WorkflowEntity } from '@prisma/client';
export const WorkflowExecution = async (req:Request, res:Response)=>{
    const {id}=req.params
    const workflow=await prisma.workflowEntity.findFirst({
        where:{
            active:true,
            webhookId:id
        } as Prisma.WorkflowEntityWhereInput
    })
    if(!workflow) res.json({message:'no active workflow'})
        
    
    res.send({message:'this find the workflow and run it'})
}
