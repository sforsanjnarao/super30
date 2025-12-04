import express, { Request, Response } from "express";
import { createClient } from "redis";


const app =express()
app.use(express.json())

const client= createClient()
// client.on('error',(err)=> console.log('Redis client error', err))
app.post('/submit', async (req:Request, res:Response)=>{
    console.log('lalala')
    const {user, problemId,code, language}= req.body || {}
     if (!user || !problemId || !code || !language) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try{
        await client.lPush('submission',JSON.stringify({user, problemId, code, language}))
        res.status(200).json({message:'submission sucessfull'})
    }catch(error){
        console.error("Redis error:", error);
        res.status(500).send("Failed to store submission.");        
    }
})
//BRPOP submissition 0
async function startServer(){
   try{
        await client.connect()
        console.log('redis client is connected')

        app.listen(3000,()=>{
            console.log('app is listing on port 3000')
        })
   }catch(error){
        console.error(error,'failed to connect to redis')
   }
}

startServer()