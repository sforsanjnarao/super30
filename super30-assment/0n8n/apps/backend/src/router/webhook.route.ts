import Router, { type Request, type Response } from "express";
import { protect } from "../middleware/routesProtect.ts";
import { WorkflowExecution } from "../controller/webhook.controller.ts";


const router = Router();


router.post("/handler/:webhookId",protect, WorkflowExecution)




export default router;