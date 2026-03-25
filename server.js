import express from "express"
import cors from "cors"
import "dotenv/config"
import  connectDB from "./config/mongodb.js"
import adminRouter from "./routes/adminRoute.js"
import doctorRouter from "./routes/doctorRoutes.js"
import userRouter from "./routes/userRoutes.js"


//app configuration 
const app = express()
const port = process.env.PORT || 4000
connectDB()


//middleware
app.use(express.json())
app.use(cors())

//api endpoint 
app.use("/api/admin",adminRouter)
app.use("/api/doctor",doctorRouter)
app.use("/api/user",userRouter)


app.get("/",(req,res)=>{
  res.send("Api is working")
})

app.listen(port,()=>console.log("server is running at",port))