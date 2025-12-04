import Router, { type Request, type Response } from "express";
import { protect } from "../middleware/routesProtect.ts";
import { handleWebhook } from "../controller/webhook.controller.ts";


const router = Router();


router.post("/handler/:webhookId", handleWebhook) 




export default router;