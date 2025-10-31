// import type { Request, Response } from 'express';
// import prisma from '../lib/prisma.ts';
// import type { Prisma, Workflow } from '@prisma/client';

// export const WorkflowExecution = async (req:Request, res:Response)=>{
//     const {id}=req.params
//     const workflow=await prisma.workflow.findFirst({
//         where:{
//             active:true,
//             webhookUrl:id
//         } as Prisma.WorkflowWhereInput
//     })
//     if(!workflow) return res.json({message:'no active workflow'})

//     const {nodes, connections} = workflow as Workflow
//     const firstNode=nodes[0]

//     const executionResult={
//         node:firstNode,
//         input:{
//             body:req.body,
//             headers: req.headers,
//             query: req.query,
//         }
        
//     }

//     res.json({
//         message: "Workflow executed",
//         workflowId: workflow.id,
//         executionResult,
//       });


//     res.send({message:'this find the workflow and run it'})
// }




import  type { Request, Response } from 'express';
import { startWorkflowFromWebhook } from '../services/execution.service.ts';

export const handleWebhook = async (req: Request, res: Response) => {
    try {
        const { webhookId } = req.params;
        const webhookData = {
            body: req.body,
            headers: req.headers,
            query: req.query,
        };
        if(!webhookId) throw new Error('webhookId not in the params')
        // This is it! The controller's only job is to call the service.
        await startWorkflowFromWebhook(webhookId, webhookData);

        // Immediately respond with success. Don't wait for the workflow to finish.
        res.status(200).json({ status: 'success', message: 'Workflow triggered' });

    } catch (error:any ) {
        console.error(`Webhook error for ${req.params.webhookId}:`, error.message);
        // Don't send a 500 here if it's a "workflow not found" error,
        // as that's a valid outcome.
        if (error.message.includes("not found")) {
            return res.status(404).json({ status: 'error', message: 'Webhook not found or inactive' });
        }
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
};
