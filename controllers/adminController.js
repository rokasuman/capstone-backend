import validator from "validator";
import bcrypt from "bcrypt";
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

const addDoctor = async (req, res) => {
  try {
    // Request body data form the user 
    const { name, email, password, speciality, degree, experience, about, fees } = req.body;
    const imageFile = req.file;

    console.log("body:", req.body);
    console.log("File:", req.file);

    // Validate required fields
    if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees) {
      return res.status(400).json({ success: false, message: "Missing Details" });
    }

    if (!imageFile) {
      return res.status(400).json({ success: false, message: "Image not uploaded" });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(imageFile.path, {
      folder: "doctor", 
    });
     const imgeUrl = result.secure_url;
    // Remove local file after upload
    fs.unlinkSync(imageFile.path);

    // Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email" });
    }

    // Validate password
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create doctor object
    const doctorData = {
      name,
      email,
      password: hashedPassword,
      speciality,
      image: imgeUrl, 
      degree,
      experience,
      fees,
      about,
      date: Date.now(),
    };

    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();

   
    res.status(200).json({
      success: true,
      message: "Doctor added successfully",
      doctor:newDoctor, 
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// api to login for admin
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      //create a token
      const token = jwt.sign({ email }, process.env.JWT_SECRET);
      res.json({
        success: true,
        token,
      });
    } else {
      res.json({
        status: 400,
        success: false,
        message: "Unable to create the token",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: 500,
      success: false,
      message: error.mesesage,
    });
  }
};
//api to get all the doctor list in admin pannel without password
const allDoctors =async (req,res)=>{
try {
  const doctors = await doctorModel.find({}).select("-password")
  res.json({
    status:200,
    success:true,
    doctors
  })
} catch (error) {
  console.log(error)
  res.json({
    status:400,
    success:false,
    message:"Something went Wrong"
  })
}
}
//api to delete by id
const deleteDoctor = async(req,res)=>{
  const {id} = req.params;
  try {
    const doctor = await doctorModel.findById(id);
    if(!doctor){
      res.json({
        status: 404,
        success:false,
        message:"Doctor not found"
      })
    }
    //delete the doctor
    await doctorModel.findByIdAndDelete(id)
    res.json({
      status:200,
      success:true,
      message:"Doctor Deleted Successfully"
    })
  } catch (error) {
    console.log(error),
    res.json({
      status:500,
      success:false,
      message:"Server Error"

    })
  }
}
//editing the doctor 
const editDoctor = async (req, res) => {
  const { id } = req.params;
  try {
    const doctor = await doctorModel.findById(id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    // Destructure fields from JSON
    const { name, email, speciality, degree, experience, about, fees, password, image } = req.body;

    if (name) doctor.name = name;
    if (email) doctor.email = email;
    if (speciality) doctor.speciality = speciality;
    if (degree) doctor.degree = degree;
    if (experience) doctor.experience = experience;
    if (about) doctor.about = about;
    if (fees) doctor.fees = fees;
    if (image) doctor.image = image; // URL from frontend

    // Hash password if provided
    if (password && password.length >= 8) {
      const salt = await bcrypt.genSalt(10);
      doctor.password = await bcrypt.hash(password, salt);
    }

    await doctor.save();

    res.status(200).json({ success: true, message: "Doctor updated successfully", doctor });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
export { addDoctor, adminLogin, allDoctors , deleteDoctor, editDoctor};


