import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendAppointmentEmail = async (
  email,
  userName,
  doctorName,
  date,
  time
) => {
  try {
    if (!email) {
      console.log("Email is missing");
      return;
    }

    await transporter.sendMail({
      from: `"NovaHealth Care" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Appointment Confirmation",
      html: `
        <h2>Appointment Confirmed 🎉</h2>
        <p>Hi <b>${userName}</b>,</p>

        <p>Your appointment has been successfully booked.</p>

        <h3>📅 Appointment Details:</h3>
        <ul>
          <li><b>Doctor:</b> ${doctorName}</li>
          <li><b>Date:</b> ${date}</li>
          <li><b>Time:</b> ${time}</li>
        </ul>

        <p>Thank you for choosing NovaHealth Care</p>
      `,
    });

    console.log("Appointment email sent");
  } catch (error) {
    console.error(" Email error:", error.message);
  }
};