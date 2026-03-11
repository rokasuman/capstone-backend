import validator from "validator"
import bcrypt from "bcrypt"
import doctorModel from "../models/doctorModel.js"

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

export { addDoctor }