const express=require('express')
const router=express.Router()
const controller=require('../controller/userController')

router.post('/signup',controller.signup)
router.post('/signin',controller.signin)

router.get('/email',controller.emailVerfy)
module.exports=router

