import Router, { type Request, type Response } from "express";
import {  ActivateWorkflow, startButtonForManualTrigger, workflowController, workflowIDController } from "../controller/workflow.controller.ts";
import { protect } from "../middleware/routesProtect.ts";
const router = Router();
router.post("/workflows",protect, workflowController)
router.get("/workflows/:id",protect, workflowIDController)
router.put("/:id/activated",protect,ActivateWorkflow )



//this is for manual trigger -> no use write now cause i am triggering the node bia webhook
router.post("/workflow/:id/run",protect,startButtonForManualTrigger) 




export default router;