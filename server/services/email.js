const nodemailer = require("nodemailer");

const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const sendVerificationEmail = async (username, email, verificationCode) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    to: email,
    from: process.env.EMAIL_USER,
    subject: "Verify Your Account",
    html: `
      <div style="font-family: 'Arial', sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; background-color: #f5f5f5; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h1 style="text-align: center; color: #333;">Academics Connect</h1>
        <h2 style="font-size: 20px; font-weight: bold; margin-bottom: 10px;">Hello, ${username}!</h2>
        <p style="font-size: 16px; line-height: 1.5;">Thank you for creating an account with Academics Connect. To activate your account, please verify your email address by entering the code below:</p>
        <div style="background-color: #007bff; color: white; padding: 15px; border-radius: 5px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0;">
          ${verificationCode}
        </div>
        <p style="font-size: 14px; color: #888;">If you didn't create an account, you can safely ignore this email.</p>
        <p style="text-align: center; margin-top: 40px; font-size: 14px; color: #aaa;">&copy; ${new Date().getFullYear()} Academics Connect. All rights reserved.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully!");
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};

const sendPasswordResetOTPEmail = async (username, email, otp) => {
  const transporter = createTransporter();

  const mailOptions = {
    to: email,
    from: process.env.EMAIL_USER,
    subject: "Password Reset OTP",
    html: `
      <div style="font-family: 'Arial', sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; background-color: #f5f5f5; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h1 style="text-align: center; color: #333;">Academics Connect</h1>
        <h2 style="font-size: 20px; font-weight: bold; margin-bottom: 10px;">Hello, ${username}!</h2>
        <p style="font-size: 16px; line-height: 1.5;">We received a request to reset your password. Your OTP for resetting the password is:</p>
        <div style="background-color: #007bff; color: white; padding: 15px; border-radius: 5px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0;">
          ${otp}
        </div>
        <p style="font-size: 14px; color: #888;">If you didn't request this, please ignore this email.</p>
        <p style="text-align: center; margin-top: 40px; font-size: 14px; color: #aaa;">&copy; ${new Date().getFullYear()} Academics Connect. All rights reserved.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Password reset OTP email sent successfully!");
  } catch (error) {
    console.error("Error sending password reset OTP email:", error);
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetOTPEmail,
};