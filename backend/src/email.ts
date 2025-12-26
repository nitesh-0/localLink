import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(to: string, token: string) {
  console.log("email function called");

  const verifyUrl = `${process.env.FRONTEND_URL}/verify?token=${token}&email=${to}`;

  try {
    const result = await resend.emails.send({
      from: "LocalLink <onboarding@resend.dev>", // works without domain setup
      to,
      subject: "Verify your email",
      html: `
        <p>Hi,</p>
        <p>Please verify your email:</p>
        <p><a href="${verifyUrl}">Verify my email</a></p>
      `,
    });

    console.log("Email sent =>", result);
  } catch (err) {
    console.error("Email Send Failed =>", err);
  }
}
