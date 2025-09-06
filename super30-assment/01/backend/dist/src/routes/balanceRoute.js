import express from "express";
const router = express.Router();
import { getBalanceUsd } from "../controller/balanceController.js";
router.get('/usd', getBalanceUsd);
export default router;
//# sourceMappingURL=balanceRoute.js.map