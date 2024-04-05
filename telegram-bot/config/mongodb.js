import mongoose from "mongoose"
import dotenv from 'dotenv';
dotenv.config();

const DB_CONNECTION_STRING = process.env.DB_URL;

mongoose.connect(DB_CONNECTION_STRING,).then(()=>{console.log("Connected to mongodb...");
}).catch((error)=>{
    console.log("Mongoose connect error ---> \n" +error);
})