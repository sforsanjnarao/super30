import express from "express";
const router = express.Router();
import { createTrade, closeTrade } from "../controller/tradeController.js";
import isLoggedIn from '../middleware.js';
// const controller=require('../controller/userController')
router.post('/create', createTrade);
router.post('/close', isLoggedIn, closeTrade);
export default router;
//# sourceMappingURL=tradeRoute.js.map