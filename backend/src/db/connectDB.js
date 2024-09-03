import mongoose from "mongoose";

export const connectDB = async() =>{
    try {
        const connectResponse = await mongoose.connect(`${process.env.MONGODB_URL}/tweetz`)
        console.log("DB conncected",connectResponse.connection.host)
    } catch (error) {
        console.log("Error While Connecting to MongoDB")
        process.exit(1)
    }
}

