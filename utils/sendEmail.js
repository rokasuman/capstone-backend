import transporter from "./mailer.js";

export const sendAppointmentEmail = async (
  email,
  name,
  doctor,
  date,
  time
) => {
  try {
    await transporter.sendMail({
      from: `"Nova Health" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Appointment Confirmation",

      html: `
        <div style="font-family: Arial, sans-serif; padding: 10px;">
          <h2 style="color: #2c3e50;">Appointment Confirmed</h2>

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

    console.log("Appointment email sent");
  } catch (error) {
    console.error("Email error:", error);
  }
};

