const nodemailer = require("nodemailer");
const path = require("path");

/**
 * Helper to get the Altraverse logo attachment.
 * @returns {Array<Object>}
 */
const getLogoAttachment = () => {
  return [
    {
      filename: "logo.png",
      path: path.join(__dirname, "../assets/logo.png"),
      cid: "logo",
    },
  ];
};

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
        <div style="font-family: 'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; background-color: #06091b; color: #ffffff; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          <div style="text-align: center; margin-bottom: 25px;">
            <img src="cid:logo" alt="Altraverse Logo" style="height: 50px; width: auto; margin-bottom: 10px;" />
            <h2 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 1px;">ASOC</h2>
            <p style="color: #a78bfa; font-size: 12px; margin: 5px 0 0 0; text-transform: uppercase; letter-spacing: 2px;">Altraverse Space Of Code</p>
          </div>
          <p style="color: #e2e8f0; font-size: 15px; line-height: 1.6;">Hello ${name},</p>
          <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6;">Thank you for registering. Please use the following One-Time Password (OTP) to verify your email address. This OTP is valid for 10 minutes:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; padding: 12px 25px; background-color: rgba(255,255,255,0.03); border-radius: 8px; border: 1px dashed #8b5cf6; color: #a78bfa; display: inline-block;">
              ${otp}
            </span>
          </div>
          <p style="color: #94a3b8; font-size: 14px; line-height: 1.6;">If you did not initiate this request, please ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.08); margin-top: 30px; margin-bottom: 20px;" />
          <p style="font-size: 11px; color: #64748b; text-align: center; margin: 0;">This is an automated email. Please do not reply.</p>
        </div>
      `,
      attachments: getLogoAttachment(),
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
        <div style="font-family: 'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; background-color: #06091b; color: #ffffff; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          <div style="text-align: center; margin-bottom: 25px;">
            <img src="cid:logo" alt="Altraverse Logo" style="height: 50px; width: auto; margin-bottom: 10px;" />
            <h2 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 1px;">ASOC</h2>
            <p style="color: #a78bfa; font-size: 12px; margin: 5px 0 0 0; text-transform: uppercase; letter-spacing: 2px;">Altraverse Space Of Code</p>
          </div>
          <h2 style="color: #8b5cf6; text-align: center; margin-top: 10px;">New Role Application Alert</h2>
          <p style="color: #e2e8f0; font-size: 15px; line-height: 1.6;">Hello Administrator,</p>
          <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6;">A user has submitted an application for the <strong>${roleName}</strong> cohort track on the platform.</p>
          <div style="background-color: rgba(255,255,255,0.03); padding: 20px; border-left: 4px solid #8b5cf6; border-radius: 0 8px 8px 0; margin: 25px 0; border-top: 1px solid rgba(255,255,255,0.05); border-right: 1px solid rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.05);">
            <p style="margin: 0 0 10px 0; color: #e2e8f0; font-size: 14px;"><strong>Name:</strong> ${applicantName}</p>
            <p style="margin: 0 0 10px 0; color: #e2e8f0; font-size: 14px;"><strong>Email:</strong> ${applicantEmail}</p>
            <p style="margin: 0; color: #e2e8f0; font-size: 14px;"><strong>Applied Track:</strong> ${roleName}</p>
          </div>
          <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6;">Please log in to the admin panel to review details and take action.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/admin" style="background-color: #8b5cf6; color: white; padding: 12px 25px; text-decoration: none; font-weight: bold; border-radius: 30px; display: inline-block; box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);">
              Open Admin Dashboard
            </a>
          </div>
          <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.08); margin-top: 30px; margin-bottom: 20px;" />
          <p style="font-size: 11px; color: #64748b; text-align: center; margin: 0;">This is an automated email. Please do not reply.</p>
        </div>
      `,
      attachments: getLogoAttachment(),
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

    let htmlContent = "";

    if (isApproved) {
      if (roleId === "contributor") {
        // Refactored Premium Contributor Welcome Email
        htmlContent = `
          <div style="background-color: #06091b; padding: 40px 20px; font-family: 'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff; max-width: 600px; margin: 0 auto; border-radius: 16px; border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
            <!-- Header with Logo -->
            <div style="text-align: center; margin-bottom: 30px;">
              <img src="cid:logo" alt="Altraverse Logo" style="height: 60px; width: auto; margin-bottom: 15px;" />
              <h1 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0; letter-spacing: 1px;">ASOC</h1>
              <p style="color: #a78bfa; font-size: 14px; margin: 5px 0 0 0; text-transform: uppercase; letter-spacing: 2px;">Altraverse Space Of Code</p>
            </div>
            
            <h2 style="color: #10b981; text-align: center; margin-top: 10px; margin-bottom: 25px;">Application Approved! 🎉</h2>
            
            <div style="background-color: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 30px; margin-bottom: 25px;">
              <p style="font-size: 16px; line-height: 1.6; color: #e2e8f0; margin-top: 0;">Dear ${userName},</p>
              
              <p style="font-size: 18px; line-height: 1.6; color: #f3e8ff; font-weight: 600;">Welcome to Altraverse – Space of Code! 🎉</p>
              
              <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1;">We're excited to have you join our contributor community. Your skills and enthusiasm will help us build impactful open-source projects together.</p>

              <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1;">Your earned badges (<strong>ASOC_Member.jpg</strong> and <strong>Contributor.jpg</strong>) have been attached to this email for you to view and download!</p>
              
              <div style="margin: 25px 0; background-color: rgba(139, 92, 246, 0.1); border-left: 4px solid #8b5cf6; padding: 20px; border-radius: 0 8px 8px 0;">
                <p style="margin-top: 0; font-weight: bold; color: #c084fc; font-size: 15px;">As a Contributor, you'll:</p>
                <ul style="margin: 0; padding-left: 20px; color: #e2e8f0; font-size: 14px; line-height: 1.8;">
                  <li>Work on open-source projects.</li>
                  <li>Collaborate with developers worldwide.</li>
                  <li>Learn through real-world development.</li>
                  <li>Build your portfolio and GitHub profile.</li>
                </ul>
              </div>
              
              <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1;">We'll soon share project repositories, contribution guidelines, and communication channels.</p>
              
              <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1; font-weight: 600; margin-bottom: 0;">Welcome aboard—we can't wait to see what you'll build!</p>
            </div>

            <!-- Action Button / Community Join -->
            <div style="text-align: center; margin: 30px 0;">
              <p style="color: #cbd5e1; font-size: 14px; margin-bottom: 15px;">Join our community on WhatsApp to stay updated and connect with other contributors:</p>
              <a href="https://chat.whatsapp.com/K9YQAz1PxAyDnB2Kw4lteJ?s=cl&p=a&mlu=0" style="display: inline-block; background: linear-gradient(135deg, #25d366 0%, #128c7e 100%); color: #ffffff; text-decoration: none; padding: 14px 30px; font-size: 16px; font-weight: bold; border-radius: 30px; box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);">
                Join WhatsApp Community
              </a>
            </div>

            <!-- Footer -->
            <div style="text-align: center; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 25px; margin-top: 25px;">
              <p style="font-size: 14px; font-weight: 600; color: #e2e8f0; margin: 0;">Best regards,</p>
              <p style="font-size: 16px; font-weight: 700; color: #a78bfa; margin: 5px 0 0 0;">ASOC - Altraverse Space of Code</p>
              <p style="font-size: 12px; color: #94a3b8; margin: 5px 0 0 0; font-style: italic;">Building. Learning. Growing Together.</p>
            </div>
          </div>
        `;
      } else {
        // Standard approved layout
        htmlContent = `
          <div style="font-family: 'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; background-color: #06091b; color: #ffffff; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
            <div style="text-align: center; margin-bottom: 25px;">
              <img src="cid:logo" alt="Altraverse Logo" style="height: 50px; width: auto; margin-bottom: 10px;" />
              <h2 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 1px;">ASOC</h2>
              <p style="color: #a78bfa; font-size: 12px; margin: 5px 0 0 0; text-transform: uppercase; letter-spacing: 2px;">Altraverse Space Of Code</p>
            </div>
            <h2 style="color: #10b981; text-align: center; margin-top: 10px;">Application Approved! 🎉</h2>
            <p style="color: #e2e8f0; font-size: 15px; line-height: 1.6;">Hello ${userName},</p>
            <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6;">We have wonderful news! The program administrators have reviewed and <strong>approved</strong> your application to join the ASOC cohort as a <strong>${roleName}</strong>.</p>
            
            <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6;">Your earned badge (<strong>ASOC_Member.jpg</strong>) has been attached to this email for you to view and download!</p>

            <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6;">Your platform account permissions have been upgraded. You can now access all features, dashboards, and start contributing immediately.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/roles" style="background-color: #10b981; color: white; padding: 12px 25px; text-decoration: none; font-weight: bold; border-radius: 30px; display: inline-block; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);">
                Go to Dashboard
              </a>
            </div>
            <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6;">Welcome aboard, and thank you for being a part of Altraverse Open Source!</p>
            <hr style="border: 0; border-top: 1px solid rgba(255, 255, 255, 0.08); margin-top: 30px; margin-bottom: 20px;" />
            <p style="font-size: 11px; color: #64748b; text-align: center; margin: 0;">This is an automated email. Please do not reply.</p>
          </div>
        `;
      }
    } else {
      // Standard rejected layout
      htmlContent = `
        <div style="font-family: 'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; background-color: #06091b; color: #ffffff; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          <div style="text-align: center; margin-bottom: 25px;">
            <img src="cid:logo" alt="Altraverse Logo" style="height: 50px; width: auto; margin-bottom: 10px;" />
            <h2 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 1px;">ASOC</h2>
            <p style="color: #a78bfa; font-size: 12px; margin: 5px 0 0 0; text-transform: uppercase; letter-spacing: 2px;">Altraverse Space Of Code</p>
          </div>
          <h2 style="color: #ef4444; text-align: center; margin-top: 10px;">Application Status Update</h2>
          <p style="color: #e2e8f0; font-size: 15px; line-height: 1.6;">Hello ${userName},</p>
          <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6;">Thank you for your interest in joining the ASOC cohort as a <strong>${roleName}</strong>.</p>
          <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6;">The program administrators have reviewed your application. Unfortunately, we are unable to accept your application for this track at this time.</p>
          <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6;">We encourage you to check out other tracks on the platform or apply in future cohorts.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/roles" style="background-color: #8b5cf6; color: white; padding: 12px 25px; text-decoration: none; font-weight: bold; border-radius: 30px; display: inline-block; box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);">
              View Other Tracks
            </a>
          </div>
          <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.08); margin-top: 30px; margin-bottom: 20px;" />
          <p style="font-size: 11px; color: #64748b; text-align: center; margin: 0;">This is an automated email. Please do not reply.</p>
        </div>
      `;
    }

    const attachments = getLogoAttachment();
    if (isApproved) {
      // Add ALL.png badge
      attachments.push({
        filename: "ASOC_Member.jpg",
        path: path.join(__dirname, "../assets/ASOC_Member.jpg"),
      });

      if (roleId === "contributor") {
        // Add Contributor.jpg badge
        attachments.push({
          filename: "Contributor.jpg",
          path: path.join(__dirname, "../assets/Contributor.jpg"),
        });
        // Keep the Contributor.pdf attachment
        attachments.push({
          filename: "Contributor.pdf",
          path: path.join(__dirname, "../assets/Contributor.pdf"),
        });
      }
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Altraverse Open Source" <noreply@altraverse.com>',
      to: userEmail,
      subject: subject,
      html: htmlContent,
      attachments,
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
        <div style="font-family: 'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; background-color: #06091b; color: #ffffff; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          <div style="text-align: center; margin-bottom: 25px;">
            <img src="cid:logo" alt="Altraverse Logo" style="height: 50px; width: auto; margin-bottom: 10px;" />
            <h2 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 1px;">ASOC</h2>
            <p style="color: #a78bfa; font-size: 12px; margin: 5px 0 0 0; text-transform: uppercase; letter-spacing: 2px;">Altraverse Space Of Code</p>
          </div>
          <h2 style="color: #8b5cf6; text-align: center; margin-top: 10px;">Welcome to the ASOC Newsletter! 📬</h2>
          <p style="color: #e2e8f0; font-size: 15px; line-height: 1.6;">Hello,</p>
          <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6;">Thank you for subscribing to the ASOC newsletter! You are now on the list to receive our latest updates, announcements, and developer news.</p>
          <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6;">Stay tuned for exciting opportunities in open source!</p>
          <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.08); margin-top: 30px; margin-bottom: 20px;" />
          <p style="font-size: 11px; color: #64748b; text-align: center; margin: 0;">This is an automated email. If you did not subscribe, please ignore this email.</p>
        </div>
      `,
      attachments: getLogoAttachment(),
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
