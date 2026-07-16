const Newsletter = require("../models/newsletter.model");
const { sendNewsletterSubscriptionEmail } = require("../utils/email.utils");
const { appendNewsletterSubscriber } = require("../utils/excel.utils");

/**
 * Subscribe a new email to the newsletter
 * POST /api/newsletter/subscribe
 */
const subscribeNewsletter = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address",
    });
  }

  try {
    // Check if already subscribed
    const existingSubscription = await Newsletter.findOne({ email });
    if (existingSubscription) {
      return res.status(400).json({
        success: false,
        message: "You are already subscribed to our newsletter!",
      });
    }

    const subscription = new Newsletter({ email });
    await subscription.save();

    // Log to Excel spreadsheet
    appendNewsletterSubscriber(email);

    // Send confirmation email
    await sendNewsletterSubscriptionEmail(email);

    res.status(201).json({
      success: true,
      message: "Successfully subscribed to our newsletter! Thank you.",
    });
  } catch (error) {
    console.error("Newsletter Subscription Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred while subscribing to the newsletter",
    });
  }
};

module.exports = {
  subscribeNewsletter,
};
