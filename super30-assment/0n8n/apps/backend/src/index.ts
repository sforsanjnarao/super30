import express from "express"
import dotenv from "dotenv"
import WorkflowRouter from "./router/workflow.router.js"


dotenv.config()
const PORT = process.env.PORT || 3000
const app = express()
app.use(express.json())

app.use(express.urlencoded({extended:true}))
app.use('/api/v0',WorkflowRouter)



app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})