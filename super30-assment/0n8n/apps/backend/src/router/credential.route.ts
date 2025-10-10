import { Router } from "express";
import { getCredential, getCredentialOfParticularD, postCredential } from "../controller/credential.controller.ts";
const router=Router()

router.post('/',postCredential)
router.get('/',getCredential )
router.get('/:id',getCredentialOfParticularD)
export default router