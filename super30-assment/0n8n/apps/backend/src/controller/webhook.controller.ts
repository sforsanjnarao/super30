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
    if(!workflow) return res.json({message:'no active workflow'})

    const {nodes, connections} = workflow as WorkflowEntity
    const firstNode=nodes[0]
    const executionResult={
        node:firstNode,
        input:{
            body:req.body,
            headers: req.headers,
            query: req.query,
        }
    }
    res.json({
        message: "Workflow executed",
        workflowId: workflow.id,
        executionResult,
      });


    res.send({message:'this find the workflow and run it'})
}
