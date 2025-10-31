import Router, { type Request, type Response } from "express";
import { protect } from "../middleware/routesProtect.ts";
import { handleWebhook } from "../controller/webhook.controller.ts";


const router = Router();


router.post("/handler/:webhookId",protect, handleWebhook) //this is straightly getting from the database the node,




export default router;