console.log("Application Started")

import { app } from "./app.js"
import dotenv from 'dotenv'
import { connectDB } from "./db/connectDB.js"

//environment Variables config
dotenv.config({
    path: './env'
})

//Database Connection
connectDB().then(
    () =>{
        app.listen(process.env.PORT,()=>{
            console.log("Application Running")
        })
    }
).catch((e) => {throw("Error MongoDB Connect",e)})
