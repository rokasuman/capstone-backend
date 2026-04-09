import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendAppointmentEmail = async (
  email,
  name,
  doctor,
  date,
  time
) => {
  console.log("Email function starting");

  try {
    const { data, error } = await resend.emails.send({
      from: "Nova Health <onboarding@resend.dev>", // default test sender
      to: email,
      subject: "Appointment Confirmation",

      html: `
        <h2>Appointment Confirmed</h2>
        <p>Hello ${name},</p>

        <p>Your appointment is booked successfully.</p>

        <p>
          Doctor: ${doctor} <br/>
          Date: ${date} <br/>
          Time: ${time}
        </p>

        <p>Thanks,<br/>Nova Health</p>
      `,
    });

    if (error) {
      console.error("❌ Resend error:", error);
      return;
    }

    console.log("✅ Email sent:", data);
  } catch (err) {
    console.error("❌ Email failed:", err);
  }
};