import mongoose from 'mongoose';

export const connectDB = async () => {
    mongoose.connection.on("connected", () => {
        console.log("Database connected")
    })
    try {
        await mongoose.connect(process.env.MONGO_URI)
    } catch (error) {
        console.log(`Mongodb Connection error : ${error.message}`)
    }
}