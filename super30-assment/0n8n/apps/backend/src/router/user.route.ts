import Router, { type Request, type Response } from "express";
import { signup, signin, signout, itsMe } from "../controller/user.controller.ts";
import { protect } from "../middleware/routesProtect.ts";
const router = Router();
router.post("/signup", signup)
router.post("/signin", signin)
router.post("/signout", signout)
router.get("/me", protect,itsMe)



export default router;