const nodemailer = require("nodemailer");
const path = require("path");
const dotenv = require("dotenv");

// Load backend environment variables
dotenv.config();

// Configuration
// SET TO false TO SEND TO PRODUCTION USERS (real list)
const TEST_MODE = false;
const TEST_EMAIL = "parkhiom50@gmail.com";

const PRODUCTION_EMAILS = [
  "nikodeprathamesh@gmail.com",
  "kamdikshitij3@gmail.com",
  "nagoseronit18@gmail.com",
  "muskansheikhriyaz@gmail.com",
  "vishweshaiya1331@gmail.com"
];

// Target recipients determined by mode
const recipients = TEST_MODE ? [TEST_EMAIL] : PRODUCTION_EMAILS;

async function sendBadgeBackfillEmail(recipientEmail) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const subject = "[ASOC Cohort] Claim Your Contributor and Cohort Badges! 🎓🎉";

  const htmlContent = `
    <div style="background-color: #06091b; padding: 40px 20px; font-family: 'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff; max-width: 600px; margin: 0 auto; border-radius: 16px; border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
      <!-- Header with Logo -->
      <div style="text-align: center; margin-bottom: 30px;">
        <img src="cid:logo" alt="Altraverse Logo" style="height: 60px; width: auto; margin-bottom: 15px;" />
        <h1 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0; letter-spacing: 1px;">ASOC</h1>
        <p style="color: #a78bfa; font-size: 14px; margin: 5px 0 0 0; text-transform: uppercase; letter-spacing: 2px;">Altraverse Space Of Code</p>
      </div>
      
      <h2 style="color: #10b981; text-align: center; margin-top: 10px; margin-bottom: 25px;">Your Earned Badges! 🎓🎉</h2>
      
      <div style="background-color: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 30px; margin-bottom: 25px;">
        <p style="font-size: 16px; line-height: 1.6; color: #e2e8f0; margin-top: 0;">Dear Contributor,</p>
        
        <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1;">Earlier, we sent you your application approval confirmation for the ASOC Cohort. However, we realized that the badges representing your achievements were not attached to the welcome email.</p>
        
        <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1;">We have now attached your earned badges directly to this email! You will find:</p>
        
        <ul style="color: #cbd5e1; font-size: 14px; line-height: 1.8; margin: 15px 0; padding-left: 20px;">
          <li><strong>ALL.png</strong>: The ASOC All Cohorts Badge</li>
          <li><strong>Contributor.jpg</strong>: The Contributor Badge</li>
          <li><strong>Contributor.pdf</strong>: The Contributor Welcome Guide/Certificate</li>
        </ul>

        <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1;">Please download and view these attachments. Feel free to showcase your badges on your social profiles (LinkedIn, Twitter/X, GitHub) and tag Altraverse!</p>
        
        <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1; font-weight: 600; margin-bottom: 0;">Thank you again for joining our open-source cohort. Let's build something great!</p>
      </div>

      <!-- Footer -->
      <div style="text-align: center; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 25px; margin-top: 25px;">
        <p style="font-size: 14px; font-weight: 600; color: #e2e8f0; margin: 0;">Best regards,</p>
        <p style="font-size: 16px; font-weight: 700; color: #a78bfa; margin: 5px 0 0 0;">ASOC - Altraverse Space of Code</p>
        <p style="font-size: 12px; color: #94a3b8; margin: 5px 0 0 0; font-style: italic;">Building. Learning. Growing Together.</p>
      </div>
    </div>
  `;

  const attachments = [
    {
      filename: "logo.png",
      path: path.join(__dirname, "src/assets/logo.png"),
      cid: "logo",
    },
    {
      filename: "ALL.png",
      path: path.join(__dirname, "src/assets/ALL.jpg"),
    },
    {
      filename: "Contributor.jpg",
      path: path.join(__dirname, "src/assets/Contributor.jpg"),
    },
    {
      filename: "Contributor.pdf",
      path: path.join(__dirname, "src/assets/Contributor.pdf"),
    }
  ];

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Altraverse Open Source" <noreply@altraverse.com>',
    to: recipientEmail,
    subject: subject,
    html: htmlContent,
    attachments: attachments,
  };

  await transporter.sendMail(mailOptions);
  console.log(`[SMTP Badge Backfill] Sent badges email to: ${recipientEmail}`);
}

async function run() {
  console.log(`Starting badges backfill script. Mode: ${TEST_MODE ? "TEST" : "PRODUCTION"}`);
  console.log(`Targeting: ${recipients.join(", ")}`);

  for (const email of recipients) {
    try {
      await sendBadgeBackfillEmail(email);
    } catch (err) {
      console.error(`Failed to send email to ${email}:`, err);
    }
  }
  console.log("Done!");
}

run();
