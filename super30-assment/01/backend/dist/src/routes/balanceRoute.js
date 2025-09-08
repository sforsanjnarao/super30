import express from "express";
const router = express.Router();
import { getBalance, getBalanceUsd, getSupportedAssets } from "../controller/balanceController.js";
router.get('/usd', getBalanceUsd);
router.get('/', getBalance);
router.get('/supportedAssets', getSupportedAssets);
export default router;
//# sourceMappingURL=balanceRoute.js.map