import nodemailer from "nodemailer" 

//creating the transger

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:"process.env.EMAIL_USER",
        pass:"process.env.EMAIL_PASS"
    }
})
export const sendWelcomeEmail = async (email, name) => {
  try {
    await transporter.sendMail({
      from: `"NovaHealth" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: " Welcome to NovaHealth!",
      html: `
        <h2 class="text-green">Welcome, ${name} 👋</h2>
        <p>Thank you for joining NovaHealth.</p>
        <p>You can now book appointments and manage your health easily.</p>
        <br/>
        <p>Best regards,<br/>NovaHealth Team</p>
      `,
    });

    console.log("Welcome email sent successfully");
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
};