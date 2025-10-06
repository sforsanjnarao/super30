import Router, { type Request, type Response } from "express";
import {  ActivateWorkflow, startButtonForManualTrigger, workflowController, workflowIDController,getAllWorkflowsController,updateWorkflowController } from "../controller/workflow.controller.ts";
import { protect } from "../middleware/routesProtect.ts";
const router = Router();
router.post("/workflows", workflowController)
router.get("/workflows", getAllWorkflowsController);
router.get("/workflows/:id",protect, workflowIDController)
router.patch('/workflows/:id',updateWorkflowController)
router.put("/:id/activated",protect,ActivateWorkflow )



//this is for manual trigger -> no use write now cause i am triggering the node bia webhook
router.post("/workflow/:id/run",protect,startButtonForManualTrigger) 




export default router;