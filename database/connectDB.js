const mongoose = require("mongoose")

const uri = "mongodb+srv://9530504126:9530504126@cluster0.rwsrhic.mongodb.net/?retryWrites=true&w=majority"


const connectDB = async () =>{
    try{
        const connect = await mongoose.connect(uri);
        console.log("DB CONNECTED")
    }
    catch(error){
        console.log('error in connecting database', error)
        process.exit(1)
    }
}

module.exports = connectDB;