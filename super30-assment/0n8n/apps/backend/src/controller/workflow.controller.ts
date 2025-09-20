
import type { Request, Response } from 'express';

export const workflowController=async (req:Request, res:Response) => {
    res.send({ message: "Workflow created" });
}
export const workflowIDController=async (req:Request, res:Response) => {
    res.send({ message: "Workflow Id created" });
}