const SupportTicket = require("../models/support.model");

/**
 * Submit a support request
 * POST /api/support
 */
const createSupportRequest = async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: "Please fill in all required fields",
    });
  }

  try {
    const ticketData = {
      name,
      email,
      subject,
      message,
    };

    // If request contains authenticated user (from optional auth middleware)
    if (req.user) {
      ticketData.userId = req.user._id;
    }

    const ticket = new SupportTicket(ticketData);
    await ticket.save();

    res.status(201).json({
      success: true,
      message: "Support request raised successfully! Our team will get back to you shortly.",
      ticket,
    });
  } catch (error) {
    console.error("Create Support Request Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred while submitting support request",
    });
  }
};

/**
 * Get all support tickets (Admin only)
 * GET /api/support/admin/tickets
 */
const getSupportTickets = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    
    if (status && status !== "all") {
      filter.status = status;
    }

    const tickets = await SupportTicket.find(filter)
      .populate("userId", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      tickets,
    });
  } catch (error) {
    console.error("Get Support Tickets Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred while fetching support tickets",
    });
  }
};

/**
 * Update a support ticket status (Admin only)
 * PUT /api/support/admin/tickets/:id
 */
const updateTicketStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !["open", "in-progress", "resolved"].includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid ticket status ('open', 'in-progress', 'resolved')",
    });
  }

  try {
    const ticket = await SupportTicket.findById(id);

    if (!ticket) {
      return res.status(444).json({
        success: false,
        message: "Support ticket not found",
      });
    }

    ticket.status = status;
    await ticket.save();

    res.status(200).json({
      success: true,
      message: `Support ticket status updated to '${status}' successfully.`,
      ticket,
    });
  } catch (error) {
    console.error("Update Ticket Status Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred while updating ticket status",
    });
  }
};

module.exports = {
  createSupportRequest,
  getSupportTickets,
  updateTicketStatus,
};
