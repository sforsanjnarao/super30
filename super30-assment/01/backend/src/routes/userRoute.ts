const express=require('express')
const router=express.Router()
const controller=require('../controller/userController')

// router.post('/signup',controller.signup)
// router.post('/signin',controller.signin)

// router.get('/email',controller.emailVerfy)

router.post("/auth",controller.auth)
router.get("/auth/verify",controller.verifyEmail)

router.get("/me",controller.getMe)

export default router