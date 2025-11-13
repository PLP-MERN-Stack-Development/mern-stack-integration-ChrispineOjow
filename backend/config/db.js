import mongoose from "mongoose"
import "dotenv/config"

async function connectDB(){
    try{

        await mongoose.connect(process.env.MONGO_URI)
        console.log("Database Connected successfully");
        
    }catch(error){

        console.error("Database could not connect", error);
    }
}
