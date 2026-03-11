import express from 'express'
import { addDoctor } from '../controllers/adminController.js'
import upload from '../middlewares/multer.js'
//import authAdmin from '../middlewares/authAdmin.js'

// creating the router
const adminRouter = express.Router()

adminRouter.post('/add-doctor',upload.single("image"), addDoctor)

export default adminRouter