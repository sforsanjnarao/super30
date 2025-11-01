import { Router } from "express";
import {
  createCredentialController,
  getCredentialsController,
  deleteCredentialController
} from "../controller/credential.controller.ts";
import { protect } from "../middleware/routesProtect.ts";

const router = Router();

router.use(protect);

router.post("/", createCredentialController);
router.get("/", getCredentialsController);
router.delete("/:id", deleteCredentialController);

export default router;