// utils/email.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// simple send function
export async function sendVerificationEmail(to: string, token: string) {

    try {
        const verifyUrl = `${process.env.FRONTEND_URL}/verify?token=${token}&email=${to}`;
        const html = `
            <p>Hi,</p>
            <p>Click the link below to verify your email:</p>
            <p><a href="${verifyUrl}">Verify my email</a></p>
            <p>This link will expire in 24 hours.</p>
        `;
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to,
            subject: "Verify your email",
            html,
        });
    }

    catch(e){
        console.log(e)
    }

  
}
