import { Router } from "express";
import {
  createWorkflowController,
  getAllWorkflowsController,
  getWorkflowByIdController,
  updateWorkflowController,
  activateWorkflowController,
  deleteWorkflowController
} from "../controller/workflow.controller.ts";
import { protect } from "../middleware/routesProtect.ts";

const router = Router();


router.use(protect);

router.post("/workflows", createWorkflowController);
router.get("/workflows", getAllWorkflowsController);
router.get("/workflows/:id", getWorkflowByIdController);
router.patch("/workflows/:id", updateWorkflowController);
router.put("/workflows/:id/activate", activateWorkflowController);
router.delete("/workflows/:id", deleteWorkflowController);

export default router;