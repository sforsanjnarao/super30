import express from 'express'
const app=express()
import cookieParser from "cookie-parser";
import userRouter from './src/routes/userRoute.js'
import dotenv from "dotenv";
import tradeRouter from './src/routes/tradeRoute.js'
import balanceRouter from './src/routes/balanceRoute.js'
dotenv.config();


app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cookieParser());


app.use('/api/v1',userRouter)
app.use('/api/v1/trade',tradeRouter)
app.use('/api/v1/balance',balanceRouter)


app.listen(3001,()=>{
    console.log(`server is running on port ${process.env.PORT}`)
})