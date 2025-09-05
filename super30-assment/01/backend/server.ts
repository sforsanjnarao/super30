import express from 'express'
const app=express()
import cookieParser from "cookie-parser";
import userRouter from './src/routes/userRoute.js'
import dotenv from "dotenv";
import tradeRouter from './src/routes/tradeRoute.js'

dotenv.config();


app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cookieParser());


app.use('/api/vi',userRouter)
app.use('/api/vi/trade',tradeRouter)

app.listen(3000,()=>{
    console.log(`server is running on port ${process.env.PORT}`)
})