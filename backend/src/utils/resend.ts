// utils/sendResetEmail.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendResetEmail = async (email: string, OTP: string) => {
  return await resend.emails.send({
    from: "DrawingBoard <website@resend.dev>",
    to: email,
    subject: "Reset Your Password",
    html: resetPasswordTemplate(OTP),
  });
};

const resetPasswordTemplate = (OTP: string) => `
  <div style="font-family: Arial, sans-serif; padding: 20px;">
    <h2 style="color: #333;">Reset your password</h2>
    <p>We received a request to reset your password.</p>
    <h2>Reset Your Password</h2>
  <p>Here is your OTP:</p>
  <h1 style="font-size: 32px; color: #4f46e5;">${OTP}</h1>
  <p>This OTP will expire in 15 minutes.</p>
    <p style="margin-top: 20px; color: #555;">If you didn't request a password reset, you can safely ignore this email.</p>
    <p style="color: #aaa; font-size: 12px;">This OTP will expire in 5 minutes.</p>
  </div>
`;
