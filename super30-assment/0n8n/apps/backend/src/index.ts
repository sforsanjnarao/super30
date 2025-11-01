import express from "express"
import dotenv from "dotenv"
import WorkflowRouter from "./router/workflow.route.ts"
import UserRouter from "./router/user.route.ts"
import Webhook from "./router/webhook.route.ts"
import Credential from "./router/credential.route.ts"
import cookieParser from "cookie-parser"
import cors from 'cors'



dotenv.config()
const PORT = process.env.PORT || 8080
const app = express()

app.use(cors({origin:'http://localhost:3000',
    credentials:true
}))

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/api/v0/user',UserRouter)
app.use('/api/v0/credentials', Credential)
app.use('/api/v0',WorkflowRouter)
app.use('/api/v0/webhook',Webhook)



app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})