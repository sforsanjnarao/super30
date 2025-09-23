import Router, { type Request, type Response } from "express";
import { signup, signin } from "../controller/user.controller.ts";
const router = Router();
router.post("/signup", signup)
router.get("/signin", signin)



export default router;