import express from "express"
import dotenv from "dotenv"
import WorkflowRouter from "./router/workflow.router.ts"
import UserRouter from "./router/user.router.ts"


dotenv.config()
const PORT = process.env.PORT || 8080
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/api/v0',WorkflowRouter)
app.use('/api/v0/user',UserRouter)



app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})