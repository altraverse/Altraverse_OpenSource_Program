const nodemailer = require("nodemailer");

/**
 * Generates a random 6-digit numeric OTP.
 * @returns {string}
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Sends an email containing the OTP code. Falls back to console logging if SMTP settings are not configured.
 * @param {string} email 
 * @param {string} name 
 * @param {string} otp 
 */
const sendOTPEmail = async (email, name, otp) => {
  const isPlaceholderConfig = 
    !process.env.SMTP_HOST || 
    process.env.SMTP_USER === "placeholder" || 
    !process.env.SMTP_USER;

  if (isPlaceholderConfig) {
    console.log("\n=============================================");
    console.log(`[DEV OTP LOG] Email to: ${email} (${name})`);
    console.log(`[DEV OTP LOG] Your OTP is: ${otp}`);
    console.log("=============================================\n");
    return true;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 2525,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Altraverse Open Source" <noreply@altraverse.com>',
      to: email,
      subject: "Verify Your Email Address - Altraverse Open Source",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #6a5cff; text-align: center;">Altraverse Open Source</h2>
          <p>Hello ${name},</p>
          <p>Thank you for registering. Please use the following One-Time Password (OTP) to verify your email address. This OTP is valid for 10 minutes:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 28px; font-weight: bold; letter-spacing: 5px; padding: 10px 20px; background-color: #f4f4f4; border-radius: 5px; border: 1px dashed #6a5cff; color: #333;">
              ${otp}
            </span>
          </div>
          <p>If you did not initiate this request, please ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin-top: 30px;" />
          <p style="font-size: 12px; color: #888; text-align: center;">This is an automated email. Please do not reply.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`[SMTP Email Sent] OTP successfully sent to ${email}`);
    return true;
  } catch (error) {
    console.error(`[SMTP Email Failure] Failed to send email to ${email}:`, error.message);
    console.log("\n=============================================");
    console.log(`[DEV OTP LOG FALLBACK] Email to: ${email} (${name})`);
    console.log(`[DEV OTP LOG FALLBACK] Your OTP is: ${otp}`);
    console.log("=============================================\n");
    return false;
  }
};

/**
 * Sends a notification email to the system administrator when a new application is submitted.
 * @param {string} applicantName 
 * @param {string} applicantEmail 
 * @param {string} roleId 
 */
const sendAdminRoleNotificationEmail = async (applicantName, applicantEmail, roleId) => {
  const adminEmail = process.env.SMTP_USER || "admin@altraverse.com";
  const isPlaceholderConfig = 
    !process.env.SMTP_HOST || 
    process.env.SMTP_USER === "placeholder" || 
    !process.env.SMTP_USER;

  const rolesMap = {
    "contributor": "Contributor",
    "ambassador": "Ambassador",
    "project-admin": "Project Admin",
    "sponsor": "Sponsor",
    "mentor": "Mentor",
  };
  const roleName = rolesMap[roleId] || roleId;

  if (isPlaceholderConfig) {
    console.log("\n=============================================");
    console.log(`[DEV ADMIN NOTIFICATION LOG] Email to admin: ${adminEmail}`);
    console.log(`[DEV ADMIN NOTIFICATION LOG] Applicant: ${applicantName} (${applicantEmail})`);
    console.log(`[DEV ADMIN NOTIFICATION LOG] Applied for: ${roleName}`);
    console.log("=============================================\n");
    return true;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 2525,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Altraverse Open Source" <noreply@altraverse.com>',
      to: adminEmail,
      subject: `[ASOC Admin Alert] New ${roleName} Application Submitted`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #6a5cff; text-align: center;">New Role Application Alert</h2>
          <p>Hello Administrator,</p>
          <p>A user has submitted an application for the <strong>${roleName}</strong> cohort track on the platform.</p>
          <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #6a5cff; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>Name:</strong> ${applicantName}</p>
            <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${applicantEmail}</p>
            <p style="margin: 0;"><strong>Applied Track:</strong> ${roleName}</p>
          </div>
          <p>Please log in to the admin panel to review details and take action.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/admin" style="background-color: #6a5cff; color: white; padding: 12px 25px; text-decoration: none; font-weight: bold; border-radius: 5px; display: inline-block;">
              Open Admin Dashboard
            </a>
          </div>
          <hr style="border: 0; border-top: 1px solid #eee; margin-top: 30px;" />
          <p style="font-size: 12px; color: #888; text-align: center;">This is an automated email. Please do not reply.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`[SMTP Admin Notification Email Sent] Alert successfully sent to ${adminEmail}`);
    return true;
  } catch (error) {
    console.error(`[SMTP Admin Email Failure] Failed to send admin email:`, error.message);
    return false;
  }
};

/**
 * Sends a status decision email to the user when their application is approved or rejected.
 * @param {string} userEmail 
 * @param {string} userName 
 * @param {string} roleId 
 * @param {string} status - Approved or Rejected
 */
const sendUserRoleStatusEmail = async (userEmail, userName, roleId, status) => {
  const isPlaceholderConfig = 
    !process.env.SMTP_HOST || 
    process.env.SMTP_USER === "placeholder" || 
    !process.env.SMTP_USER;

  const rolesMap = {
    "contributor": "Contributor",
    "ambassador": "Ambassador",
    "project-admin": "Project Admin",
    "sponsor": "Sponsor",
    "mentor": "Mentor",
  };
  const roleName = rolesMap[roleId] || roleId;
  const isApproved = String(status).toLowerCase() === "approved";

  if (isPlaceholderConfig) {
    console.log("\n=============================================");
    console.log(`[DEV USER STATUS LOG] Email to: ${userEmail} (${userName})`);
    console.log(`[DEV USER STATUS LOG] Applied for: ${roleName}`);
    console.log(`[DEV USER STATUS LOG] Decision: ${status}`);
    console.log("=============================================\n");
    return true;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 2525,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const subject = isApproved 
      ? `[ASOC Cohort] Congratulations! Your application has been approved` 
      : `[ASOC Cohort] Update on your role application`;

    const htmlContent = isApproved 
      ? `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #10b981; text-align: center;">Application Approved! 🎉</h2>
          <p>Hello ${userName},</p>
          <p>We have wonderful news! The program administrators have reviewed and <strong>approved</strong> your application to join the ASOC cohort as a <strong>${roleName}</strong>.</p>
          <p>Your platform account permissions have been upgraded. You can now access all features, dashboards, and start contributing immediately.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/roles" style="background-color: #10b981; color: white; padding: 12px 25px; text-decoration: none; font-weight: bold; border-radius: 5px; display: inline-block;">
              Go to Dashboard
            </a>
          </div>
          <p>Welcome aboard, and thank you for being a part of Altraverse Open Source!</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin-top: 30px;" />
          <p style="font-size: 12px; color: #888; text-align: center;">This is an automated email. Please do not reply.</p>
        </div>
      `
      : `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #ef4444; text-align: center;">Application Status Update</h2>
          <p>Hello ${userName},</p>
          <p>Thank you for your interest in joining the ASOC cohort as a <strong>${roleName}</strong>.</p>
          <p>The program administrators have reviewed your application. Unfortunately, we are unable to accept your application for this track at this time.</p>
          <p>We encourage you to check out other tracks on the platform or apply in future cohorts.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/roles" style="background-color: #6a5cff; color: white; padding: 12px 25px; text-decoration: none; font-weight: bold; border-radius: 5px; display: inline-block;">
              View Other Tracks
            </a>
          </div>
          <hr style="border: 0; border-top: 1px solid #eee; margin-top: 30px;" />
          <p style="font-size: 12px; color: #888; text-align: center;">This is an automated email. Please do not reply.</p>
        </div>
      `;

    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Altraverse Open Source" <noreply@altraverse.com>',
      to: userEmail,
      subject: subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log(`[SMTP User Status Email Sent] Decision email successfully sent to ${userEmail}`);
    return true;
  } catch (error) {
    console.error(`[SMTP User Status Email Failure] Failed to send status email to ${userEmail}:`, error.message);
    return false;
  }
};

/**
 * Sends a confirmation email to a new newsletter subscriber.
 * @param {string} email 
 */
const sendNewsletterSubscriptionEmail = async (email) => {
  const isPlaceholderConfig = 
    !process.env.SMTP_HOST || 
    process.env.SMTP_USER === "placeholder" || 
    !process.env.SMTP_USER;

  if (isPlaceholderConfig) {
    console.log("\n=============================================");
    console.log(`[DEV NEWSLETTER LOG] Subscription Confirmation Email to: ${email}`);
    console.log("=============================================\n");
    return true;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 2525,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Altraverse Open Source" <noreply@altraverse.com>',
      to: email,
      subject: "Welcome to the ASOC Newsletter! 📬",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #6a5cff; text-align: center;">ASOC Newsletter</h2>
          <p>Hello,</p>
          <p>Thank you for subscribing to the ASOC newsletter! You are now on the list to receive our latest updates, announcements, and developer news.</p>
          <p>Stay tuned for exciting opportunities in open source!</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin-top: 30px;" />
          <p style="font-size: 12px; color: #888; text-align: center;">This is an automated email. If you did not subscribe, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`[SMTP Newsletter Email Sent] Confirmation successfully sent to ${email}`);
    return true;
  } catch (error) {
    console.error(`[SMTP Newsletter Email Failure] Failed to send email to ${email}:`, error.message);
    return false;
  }
};

module.exports = {
  generateOTP,
  sendOTPEmail,
  sendAdminRoleNotificationEmail,
  sendUserRoleStatusEmail,
  sendNewsletterSubscriptionEmail,
};
