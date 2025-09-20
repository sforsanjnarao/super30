import Router, { type Request, type Response } from "express";
import { workflowController, workflowIDController } from "../controller/workflow.controller.ts";
const router = Router();
router.post("/workflows", workflowController)
router.get("/workflows/:id", workflowIDController)



export default router;