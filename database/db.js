const mongoose = require("mongoose")
require("dotenv").config()

const connectDB = async ()=>{
    try{
    await mongoose.connect(process.env.MONGO_URI,{})
    console.log("MongoDB connected successfully!!!")
}catch(e){
    console.error(`Error`, e.message)
}
}

module.exports = connectDB