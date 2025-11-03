import bcrypt from 'bcrypt';
import validator from 'validator';
import { v2 as cloudinary } from 'cloudinary';
import doctorModel from '../models/doctorModel.js';
import jwt from 'jsonwebtoken';

// API for adding doctors
const addDoctor = async (req, res) => {
  try {
    const { name, email, speciality, degree, experience, about, fees, password } = req.body;

    // Check all required fields
    if (!name || !email || !speciality || !degree || !experience || !about || !fees || !password) {
      return res.status(400).json({ success: false, message: "Missing details" });
    }

    // Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email" });
    }

    // Validate password
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Please enter a stronger password" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Handle image with option
    let imageUrl = "";
    if (req.file) {
      const imageUpload = await cloudinary.uploader.upload(req.file.path, { resource_type: 'image' });
      imageUrl = imageUpload.secure_url;
    } else {
      imageUrl = req.body.image || "https://example.com/default-doctor.jpg";
    }

    // Prepare doctor data
    const doctorData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      date: Date.now()
    };

    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();

    res.status(201).json({ success: true, message: "New doctor added successfully" });
  } catch (error) {
    console.error("Error adding doctor:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API for admin login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
      res.json({ success: true, token });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { addDoctor, loginAdmin };
