import mongoose from "mongoose";

const connectDB = async ()=>{
    mongoose.connection.on("connected",()=>console.log("Database is Connected"))
    console.log(process.env.MONGODB_URL
        
    )
    await mongoose.connect(`${process.env.MONGODB_URL}/NovaHealth`)

}
export default connectDB