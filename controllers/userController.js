import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import Stripe from "stripe";
import { sendWelcomeEmail } from "../utils/sendEmail.js";
import { sendAppointmentEmail } from "../utils/sendEmail.js";


// api to register the user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing details",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "enter a strong password",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new userModel(userData);
    const user = await newUser.save();

    // ✅ FIXED: await email
    try {
      await sendWelcomeEmail(user.email, user.name);
      console.log("Welcome email sent");
    } catch (emailError) {
      console.log("Welcome email failed:", emailError.message);
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ success: true, token });

  } catch (error) {
    if (error.code === 11000) {
      return res.json({ success: false, message: "Email already exists" });
    }
    res.json({ success: false, message: error.message });
  }
};
//api for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Missing email or password" });
    }

    // Find user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User does not exist" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ success: true, message: "You have successfully login", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
//api user profile data
const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId).select("-password");

    res.json({
      success: true,
      userData,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
//api to update the userProfile
const updateUserProfile = async (req, res) => {
  try {
    const { userId, name, Number, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!userId || !name || !Number || !address || !dob || !gender) {
      return res.json({
        success: false,
        message: "Missing Details",
      });
    }
    await userModel.findByIdAndUpdate(userId, {
      name,
      Number,
      address,
      dob,
      gender,
    });

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageURL = imageUpload.secure_url;

      await userModel.findByIdAndUpdate(userId, { image: imageURL });
    }

    res.json({
      success: true,
      message: "Profile Updated Successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
// api to book the appointment

const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;

    if (!userId || !docId || !slotDate || !slotTime) {
      return res.json({
        success: false,
        message: "Missing required fields",
      });
    }

    const docData = await doctorModel.findById(docId).select("-password");

    if (!docData || !docData.available) {
      return res.json({
        success: false,
        message: "Doctor not available",
      });
    }

    const userData = await userModel.findById(userId).select("-password");

    if (!userData) {
      return res.json({
        success: false,
        message: "Login to book the Appointment",
      });
    }

    const updatedDoctor = await doctorModel.findOneAndUpdate(
      {
        _id: docId,
        [`slot_booked.${slotDate}`]: { $nin: [slotTime] },
      },
      {
        $push: { [`slot_booked.${slotDate}`]: slotTime },
      },
      { new: true }
    );

    if (!updatedDoctor) {
      return res.json({
        success: false,
        message: "Slot already booked, choose another",
      });
    }

    const docInfoForAppointment = { ...docData.toObject() };
    delete docInfoForAppointment.slot_booked;

    const appointmentData = {
      userId,
      docId,
      slotDate,
      slotTime,
      userData,
      docData: docInfoForAppointment,
      amount: docData.fees,
      date: Date.now(),
      status: "pending",
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    // ✅ FIXED: await email
    try {
      await sendAppointmentEmail(
        userData.email,
        userData.name,
        docData.name,
        slotDate,
        slotTime
      );
      console.log("Appointment email sent");
    } catch (emailError) {
      console.log("Appointment email failed:", emailError.message);
    }

    return res.json({
      success: true,
      message: "Appointment booked successfully",
    });

  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

//api to get user appointmets
const listAppointment = async (req, res) => {
  try {
    const { userId } = req.body;
    const appointments = await appointmentModel.find({ userId });
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
//api to cancel the appointments
const cancelAppointment = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    if (appointmentData.userId.toString() !== userId) {
      return res.json({ success: false, message: "Unauthorized Action" });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, { cancel: true });

    const { docId, slotDate, slotTime } = appointmentData;

    const docData = await doctorModel.findById(docId);
    let slot_booked = docData.slot_booked || {};

    if (slot_booked[slotDate]) {
      slot_booked[slotDate] = slot_booked[slotDate].filter(
        (e) => e !== slotTime,
      );

      if (slot_booked[slotDate].length === 0) {
        delete slot_booked[slotDate];
      }
    }

    await doctorModel.findByIdAndUpdate(docId, { slot_booked });

    res.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
//api for appointment payment
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    if (appointment.payment)
      return res.status(400).json({ message: "Already paid" });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: appointment.amount * 100,
      currency: "aud",
      payment_method_types: ["card"],
      metadata: {
        appointmentId: appointment._id.toString(),
        userId: appointment.userId,
        docId: appointment.docId,
      },
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
const confirmPayment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointment = await appointmentModel.findByIdAndUpdate(
      appointmentId,
      { payment: true, status: "Confirmed" },
      { new: true },
    );

    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    res.json({ success: true, message: "Payment successful", appointment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export {
  registerUser,
  loginUser,
  getProfile,
  updateUserProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  createPaymentIntent,
  confirmPayment,
};
