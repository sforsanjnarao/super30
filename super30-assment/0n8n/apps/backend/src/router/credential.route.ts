import { Router } from "express";
import { getCredential, getCredentialOfPercrulID, postCredential } from "../controller/credential.controller.ts";
const router=Router()

router.post('/',postCredential)
router.get('/',getCredential )
router.get('/:id',getCredentialOfPercrulID)
export default router