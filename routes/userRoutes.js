import express from "express"
import { registerUser,loginUser, getProfile,updateUserProfile,bookAppointment, listAppointment, cancelAppointment, createPaymentIntent,confirmPayment } from "../controllers/userController.js"
import authUser from "../middlewares/authUser.js"
import { upload } from "../middlewares/multer.js"

const userRouter = express.Router()
userRouter.post("/register",registerUser)
userRouter.post("/login",loginUser)

//getting user data
userRouter.get("/get-profile",authUser,getProfile)
//update user profile
userRouter.post("/update-profile",upload.single("image"),authUser,updateUserProfile)
//api to book appointment
userRouter.post("/book-appointment",authUser,bookAppointment)
//api to list the appointments 
userRouter.get("/appointments",authUser,listAppointment)

//cancel route 
userRouter.post("/cancel-appointment",authUser,cancelAppointment)

//payment 
userRouter.post("/create-payment",authUser,createPaymentIntent)
userRouter.post("/confirm-payment",authUser,confirmPayment)

export default userRouter