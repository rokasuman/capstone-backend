import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service:"gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

//send email for creating account 
export const sendWelcomeEmail = async(userEmail, userName) => {
  try {
    const mailOptions = {
      from:`"Nova Health Care " <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "Welcome to Nova Health Care",
      html: `
        <h2 style="color: green">Welcome ${userName}</h2>
        <p>Your account has been created Successfully.</p>
        <p>You can now login and book appointments with our doctors anytime.</p>
        <br/>
        <p>Stay healthy. See you soon.</p>
      `,
    };

await transporter.sendMail(mailOptions);
    console.log("Welcome email sent");

  } catch (error) {
    console.log("Email error:", error);

  }
};

//send email after appointment is booked 
export const sendAppointmentEmail =async(userEmail,userName,doctorName,date,time)=>{

  try {
    const mailOptions ={
      from:`"Nova Health Care " <${process.env.EMAIL_USER}>`,
      to:userEmail,
      subject:"Appointment Confirm",
      html:`
      <div style= "font-family: Arial, sans-serif; padding: 20px;">
      <h2  style="color: green;">Hello ${userName} </h2>

      <p>Your appointment has been successfully booked.</p>

      <h3>Appointment Details:</h3>
      <ul>
            <li><b>Doctor:</b> ${doctorName}</li>
            <li><b>Date:</b> ${date}</li>
            <li><b>Time:</b> ${time}</li>
        </ul>
          <p>Please arrive 10 minutes early.</p>
          <br/>
          <p style="color: #555;">
            Thank you for choosing Nova Health Care 
          </p>
          <p>Kind Regards,</p>
          <p>Nova Health Care</p>
          </div>
      `
    }

 await transporter.sendMail(mailOptions)
    console.log("appointment email send successfully")
  } catch (error) {
    console.log("appointment email error", error.message)
    
  }
}

