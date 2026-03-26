import express from 'express'
import { addDoctor, adminLogin, allDoctors, deleteDoctor, editDoctor , appointmentsAdmin,appointmentCancel,adminDashboard }from '../controllers/adminController.js'
import {upload }from '../middlewares/multer.js'
import authAdmin from '../middlewares/authAdmin.js'
import { changeAvailiabity } from '../controllers/doctorController.js'


// creating the router
const adminRouter = express.Router()

adminRouter.post('/add-doctor',authAdmin,upload.single("image"), addDoctor)
adminRouter.put("/edit-doctor/:id",authAdmin,upload.single("image"),editDoctor)
adminRouter.post("/login",adminLogin)
adminRouter.post("/all-doctors",authAdmin,allDoctors)
adminRouter.delete("/delete-doctor/:id",authAdmin,deleteDoctor)
adminRouter.post("/change-availability", authAdmin,changeAvailiabity);
adminRouter.get("/appointments",authAdmin,appointmentsAdmin)
adminRouter.post("/appointment-cancel",authAdmin,appointmentCancel)
adminRouter.get("/dashboard",authAdmin,adminDashboard)

export default adminRouter
