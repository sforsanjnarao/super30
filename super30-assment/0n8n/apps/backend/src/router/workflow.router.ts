import Router, { type Request, type Response } from "express";
import { workflowController, workflowIDController } from "../controller/workflow.controller.ts";
import { protect } from "../middleware/routesProtect.ts";
const router = Router();
router.post("/workflows",protect, workflowController)
router.get("/workflows/:id",protect, workflowIDController)



export default router;