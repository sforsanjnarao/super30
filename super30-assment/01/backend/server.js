const express= require('express')
const app=express()
const dotenv =require('dotenv').config()
const connect=require('./src/db/db')
const userRouter = require('./src/routes/userRoute')

connect()


app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use('/api/vi',userRouter)

app.listen(3000,()=>{
    console.log(`server is running on port ${process.env.PORT}`)
})