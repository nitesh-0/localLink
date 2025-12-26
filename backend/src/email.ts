import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "in-v3.mailjet.com",
  port: 587,
  auth: {
    user: process.env.MJ_API_KEY_PUBLIC,
    pass: process.env.MJ_API_KEY_PRIVATE,
  }
});

export async function sendVerificationEmail(to: string, token: string) {
  const url = `${process.env.FRONTEND_URL}/verify?token=${token}&email=${to}`;

  try {
    await transporter.sendMail({
      from: `"LocalLink" <yourgmail@gmail.com>`, // verified sender email
      to,
      subject: "Verify Your Email",
      html: `<a href="${url}">Verify Email</a>`
    });

    console.log("Mail sent to:", to);
  } catch (err) {
    console.error("Mailjet Error:", err);
  }
}
