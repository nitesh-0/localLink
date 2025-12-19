"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerificationEmail = sendVerificationEmail;
// utils/email.ts
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});
// simple send function
async function sendVerificationEmail(to, token) {
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
    catch (e) {
        console.log(e);
    }
}
//# sourceMappingURL=email.js.map