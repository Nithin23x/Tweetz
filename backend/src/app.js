import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

//General Middlewares 
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"50kb"})) //to parse the req.body into json format 
app.use(express.urlencoded({limit:"500kb",extended:true}))
app.use(express.static('public')) 
app.use(cookieParser())


//Application Routes,defining them as middlewares app.use()
import { userRouter } from './routes/user.routes.js'

app.use("/api/v1",userRouter)  // api/v1 is route ans userRouter routing section re-direct to controllers 



export {app}