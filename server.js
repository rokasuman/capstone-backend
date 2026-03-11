import express from "express"
import cors from "cors"
import "dotenv/config"
import  connectDB from "./config/mongodb.js"
import connectCloudinary from "./config/cloudinary.js"
import adminRouter from "./routes/adminRoute.js"


//app configuration 
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

//middleware
app.use(express.json())
app.use(cors())


app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.url} ${res.statusCode} ${duration}ms`);
  });
  next();
});
app.get("/healthz", (req, res) => {
  res.json({
    status: "ok",
    version: "1.0.0",
    time: new Date().toISOString()
  });
});




//api endpoint 
app.use("/api/admin",adminRouter)

app.get("/",(req,res)=>{
  res.send("Api is working")
})

app.listen(port,()=>console.log("server is running at",port))