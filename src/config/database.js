const mongoose = require("mongoose")

const connectDB = async ()=>{
    try{
        await mongoose.connect("mongodb+srv://dhanu:dhanu123@cluster0.x0sdo.mongodb.net/devTinder")
        console.log("mongoose connect successfully")
    }
    catch(err){
        console.log("connection failed")
        process.exit(1)
    }
}

module.exports ={connectDB} 