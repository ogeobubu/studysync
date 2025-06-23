// utils/sendEmail.js
const nodemailer = require("nodemailer");
const path = require('path');
const fs = require('fs');
const handlebars = require('handlebars');

const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Load email templates
const loadTemplate = (templateName, data) => {
  const filePath = path.join(__dirname, 'email-templates', `${templateName}.html`);
  const source = fs.readFileSync(filePath, 'utf8');
  const template = handlebars.compile(source);
  return template(data);
};

const sendEmail = async (options) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    to: options.email,
    from: `Academics Connect <${process.env.EMAIL_USER}>`,
    subject: options.subject,
    html: options.message
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${options.email}`);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

const sendVerificationEmail = async (user, verificationCode) => {
  const message = loadTemplate('verification', {
    username: user.name,
    verificationCode,
    year: new Date().getFullYear()
  });

  return sendEmail({
    email: user.email,
    subject: "Verify Your Account",
    message
  });
};

const sendPasswordResetOTPEmail = async (user, otp) => {
  const message = loadTemplate('password-reset', {
    username: user.name,
    otp,
    year: new Date().getFullYear()
  });

  return sendEmail({
    email: user.email,
    subject: "Password Reset OTP",
    message
  });
};

const sendPasswordChangedEmail = async (user) => {
  const message = loadTemplate('password-changed', {
    username: user.name,
    year: new Date().getFullYear()
  });

  return sendEmail({
    email: user.email,
    subject: "Password Changed Successfully",
    message
  });
};

const sendAccountActivationEmail = async (user) => {
  const message = loadTemplate('account-activated', {
    username: user.name,
    year: new Date().getFullYear()
  });

  return sendEmail({
    email: user.email,
    subject: "Account Activated",
    message
  });
};

const sendWelcomeEmail = async (user) => {
  const message = loadTemplate('welcome', {
    username: user.name,
    year: new Date().getFullYear()
  });

  return sendEmail({
    email: user.email,
    subject: "Welcome to Academics Connect!",
    message
  });
};

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetOTPEmail,
  sendPasswordChangedEmail,
  sendAccountActivationEmail,
  sendWelcomeEmail
};