import express from "express"
const router=express.Router()

import { getBalanceUsd, getBalanceInr } from "../controller/balanceController.js";


router.get('/usd',getBalanceUsd)