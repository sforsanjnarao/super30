// import Router, { type Request, type Response } from "express";
// import {  ActivateWorkflow, startButtonForManualTrigger, workflowController, workflowIDController,getAllWorkflowsController,updateWorkflowController } from "../controller/workflow.controller.ts";
// import { protect } from "../middleware/routesProtect.ts";
// const router = Router();
// router.post("/workflows", workflowController)
// router.get("/workflows", getAllWorkflowsController);
// router.get("/workflows/:id",protect, workflowIDController)
// router.patch('/workflows/:id',updateWorkflowController)
// router.put("/:id/activated",protect,ActivateWorkflow )

//  // PROTECT ALL THESE ROUTES
// // router.post("/", protect, createWorkflow);
// // router.get("/", protect, getAllWorkflows);
// // router.get("/:id", protect, getWorkflowById);
// // router.patch('/:id', protect, updateWorkflow);
// // router.put("/:id/activate", protect, activateWorkflow);






// export default router;

// //this is for manual trigger -> no use write now cause i am triggering the node bia webhook
// // router.post("/workflow/:id/run",protect,startButtonForManualTrigger) 


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

router.post("/", createWorkflowController);
router.get("/", getAllWorkflowsController);
router.get("/:id", getWorkflowByIdController);
router.patch("/:id", updateWorkflowController);
router.put("/:id/activate", activateWorkflowController);
router.delete("/:id", deleteWorkflowController);

export default router;