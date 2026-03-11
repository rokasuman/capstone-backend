import validator from "validator"
import bcrypt from "bcrypt"
import doctorModel from "../models/doctorModel.js"
import jwt from "jsonwebtoken"

//Api to add the doctor/ EP of adding the doctor
const addDoctor = async (req, res) => {
  try {

    const { name, email, password, speciality, degree, experience, about, fees, image } = req.body

    console.log(name, email)

    // checking all the data 
    if(!name || !email || !password || !speciality || !degree || !experience || !about || !fees){
      return res.status(400).json({
        success: false,
        message: "Missing Details"
      })
    }

    // validate email
    if(!validator.isEmail(email)){
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email"
      })
    }

    // password validation 
    if(password.length < 8 ){
      return res.status(400).json({
        success: false,
        message: "Please enter a strong password"
      })
    }

    // hashing the doctor password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const doctorData = {
      name,
      email,
      password: hashedPassword,
      speciality,
      image,
      degree,
      experience,
      fees,
      about,
      date: Date.now()
    }

    const newDoctor = new doctorModel(doctorData)

    await newDoctor.save()

    res.status(200).json({
      success: true,
      message: "Doctor added successfully"
    })

  } catch (error) {
    console.log(error)

    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

//Api for admin login 
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      // create a proper JWT token
      const token = jwt.sign(
        { email: email },
        process.env.JWT_SECRET,
        { expiresIn: "24h" } // optional: token expires in 2 hours
      );

      res.json({ success: true, token });
    } else {
      res.status(401).json({
        success: false,
        message: "Unauthorized to Login",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addDoctor, loginAdmin };
