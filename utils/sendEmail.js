import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Send Appointment Email
export const sendAppointmentEmail = async (
  email,
  name,
  doctor,
  date,
  time
) => {
  console.log("Email function starting");

  try {
    console.log("before email");

    const { data, error } = await resend.emails.send({
      from: "Nova Health <onboarding@resend.dev>", 
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
          <p>Thank you,<br/>Nova HealthCare Team</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return;
    }

    console.log("Email sent successfully:", data);
  } catch (error) {
    console.error("Email sending failed:", error);
  }
};