import  type { Request, Response } from 'express';
import { startWorkflowFromWebhook } from '../services/execution.service.ts';


//POST   /api/v0/webhook/handler/:webhookId
export const handleWebhook = async (req: Request, res: Response) => {
    try {
        const { webhookId } = req.params;
        const webhookData = {
            body: req.body,
            headers: req.headers,
            query: req.query,
        };
        if(!webhookId) throw new Error('webhookId not in the params')
        await startWorkflowFromWebhook(webhookId, webhookData);

        res.status(200).json({ status: 'success', message: 'Workflow triggered' });

    } catch (error:any ) {
        console.error(`Webhook error for ${req.params.webhookId}:`, error.message);
        if (error.message.includes("not found")) {
            return res.status(404).json({ status: 'error', message: 'Webhook not found or inactive' });
        }
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
};
