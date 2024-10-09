import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

//General Middlewares  CJUSC
app.use(cors({ //CORS - Cross Origin Resource Sharing
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"500kb"})) //to parse the req.body into json format 
app.use(express.urlencoded({limit:"500kb",extended:true}))  //urlencoded() is a method  to recognize the incoming Request Object as strings or arrays
app.use(express.static('public')) //to load the html files in public folder
app.use(cookieParser()) //to enable cookie operations like setCookie and clearCookie 


//Application Routes,defining them as middlewares app.use()
import { userRouter } from './routes/user.routes.js'
import { appRouter } from './routes/app.routes.js'
import { postRouter } from './routes/post.routes.js'
import { notificationRouter } from './routes/notification.routes.js'


app.use("/api/v1/users",userRouter)  // api/v1 is route ans userRouter routing section re-direct to controllers 
app.use("/api/v1/app",appRouter) 
app.use("/api/v1/posts",postRouter) 
app.use("/api/v1/notifications", notificationRouter) 

export {app} 