import express, { Request, Response } from 'express'

const app= express()
app.use(express.json())


interface payloadTypes{
    title:string,
    dex
}
app.use('/todos',(req:Request, res:Response)=>{
    const {title, desc, isCompleted}=req.body
})


app.listen(3002,()=>{
    console.log(' working on port 3000')
})