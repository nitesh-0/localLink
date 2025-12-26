import Mailjet from 'node-mailjet';

const mailjet = Mailjet.apiConnect(
  process.env.MJ_API_KEY_PUBLIC!,
  process.env.MJ_API_KEY_PRIVATE!
);

export async function sendVerificationEmail(to: string, token: string) {
  const url = `${process.env.FRONTEND_URL}/verify?token=${token}&email=${to}`;

  try {
    const request = mailjet.post("send", { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: "yourgmail@gmail.com",
            Name: "LocalLink"
          },
          To: [{ Email: to }],
          Subject: "Verify Your Email",
          HTMLPart: `<p>Click to verify: <a href="${url}">Verify Email</a></p>`
        }
      ]
    });

    await request;
    console.log("Mail sent to:", to);
  } catch (err) {
    console.error("Mailjet API Error:", err);
  }
}
