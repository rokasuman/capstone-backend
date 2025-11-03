import mongoose from "mongoose";

//function to connect with mongoose

const connectDB = async ()=>{
try {
    
    mongoose.connection.on('connected',()=>console.log("database is connected"))
    await mongoose.connect(`${process.env.MONGODB_URL}/novahealth`)

} catch (error) {
    console.log(error)
}
}

export default connectDB