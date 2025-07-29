const nodemailer = require("nodemailer");
const path = require('path');
const fs = require('fs');
const handlebars = require('handlebars');

// Create reusable transporter object
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Cache loaded templates
const templateCache = {};

// Load email templates with caching
const loadTemplate = (templateName, data) => {
  if (!templateCache[templateName]) {
    const filePath = path.join(__dirname, 'email-templates', `${templateName}.html`);
    const source = fs.readFileSync(filePath, 'utf8');
    templateCache[templateName] = handlebars.compile(source);
  }
  return templateCache[templateName](data);
};

// Generic email sender
const sendEmail = async (options) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    to: options.email,
    from: `Academics Connect <${process.env.EMAIL_USER}>`,
    subject: options.subject,
    html: options.message,
    ...(options.cc && { cc: options.cc }),
    ...(options.bcc && { bcc: options.bcc })
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

// Verification email
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

// Password reset OTP email
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

// Password changed notification
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

// Account activation notification
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

// Welcome email
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

// New: Advising request notification (to admin/advisor)
const sendAdvisingRequestEmail = async (advisingRequest, student) => {
  const adminEmail = process.env.ADMIN_EMAIL; // Set this in your .env
  
  const message = loadTemplate('advising-request', {
    studentName: student.name,
    studentEmail: student.email,
    requestReason: advisingRequest.reason,
    requestDate: new Date(advisingRequest.createdAt).toLocaleDateString(),
    additionalInfo: advisingRequest.additionalInfo || 'None provided',
    year: new Date().getFullYear()
  });

  return sendEmail({
    email: adminEmail, // Or advisor's email if already assigned
    subject: `New Advising Request from ${student.name}`,
    message,
    cc: process.env.ADVISING_TEAM_EMAIL // Optional CC for advising team
  });
};

// New: Advising status update notification (to student)
const sendAdvisingStatusUpdateEmail = async (advisingRequest, status) => {
  let subject, templateName;
  
  switch(status) {
    case 'assigned':
      subject = `Your Advising Request Has Been Assigned`;
      templateName = 'advising-assigned';
      break;
    case 'scheduled':
      subject = `Your Advising Appointment Has Been Scheduled`;
      templateName = 'advising-scheduled';
      break;
    case 'completed':
      subject = `Your Advising Session Has Been Completed`;
      templateName = 'advising-completed';
      break;
    case 'cancelled':
      subject = `Your Advising Request Has Been Cancelled`;
      templateName = 'advising-cancelled';
      break;
    default:
      subject = `Update on Your Advising Request`;
      templateName = 'advising-update';
  }

  const message = loadTemplate(templateName, {
    studentName: advisingRequest.user.name,
    status,
    advisorName: advisingRequest.advisor?.name || 'an advisor',
    appointmentDate: advisingRequest.appointment?.date 
      ? new Date(advisingRequest.appointment.date).toLocaleString()
      : 'Not scheduled yet',
    notes: advisingRequest.notes?.advisorNotes || 'No additional notes',
    year: new Date().getFullYear()
  });

  return sendEmail({
    email: advisingRequest.user.email,
    subject,
    message
  });
};

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetOTPEmail,
  sendPasswordChangedEmail,
  sendAccountActivationEmail,
  sendWelcomeEmail,
  sendAdvisingRequestEmail,
  sendAdvisingStatusUpdateEmail
};