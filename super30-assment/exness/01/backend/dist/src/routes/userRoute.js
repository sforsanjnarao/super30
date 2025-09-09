import express from "express";
const router = express.Router();
import { auth, emailVerify, getMe } from '../controller/userController.js';
// router.post('/signup',controller.signup)
// router.post('/signin',controller.signin)
// router.get('/email',controller.emailVerfy)
router.post("/auth", auth);
router.get("/auth/verify", emailVerify);
router.get("/me", getMe);
export default router;
//# sourceMappingURL=userRoute.js.map