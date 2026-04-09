import nodemailer from "nodemailer";

// ✅ Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Send Appointment Email
export const sendAppointmentEmail = async (
  email,
  name,
  doctor,
  date,
  time
) => {
  console.log("📧 Email function triggered");

  try {
    await transporter.sendMail({
      from: `"Nova Health" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Appointment Confirmation",

      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2 style="color:#2c3e50;">Appointment Confirmed</h2>

          <p>Dear <strong>${name}</strong>,</p>

          <p>Your appointment has been successfully booked.</p>

          <p>
            <strong>Doctor:</strong> ${doctor}<br/>
            <strong>Date:</strong> ${date}<br/>
            <strong>Time:</strong> ${time}
          </p>

          <p>Please arrive 10 minutes early.</p>

          <br/>
          <p>Thank you,<br/>Nova Health Team</p>
        </div>
      `,

      text: `
        Appointment Confirmed

        Dear ${name},

        Your appointment has been successfully booked.

        Doctor: ${doctor}
        Date: ${date}
        Time: ${time}

        Please arrive 10 minutes early.

        Thank you,
        Nova Health Team
      `,
    });

    console.log("✅ Email sent successfully");
  } catch (error) {
    console.error("❌ Email sending failed:", error);
  }
};