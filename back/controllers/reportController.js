const Report = require("../models/Report");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const twilio = require("twilio");

// --- Nodemailer configuration ---
// IMPORTANT: These should be in your .env file!
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// --- Twilio client configuration ---
// IMPORTANT: These should be in your .env file!
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// --- Helper function to send emails ---
const sendReportEmails = async (report, user) => {
  try {
    const mailOptions = {
      from: `"Service de Signalement" <${process.env.EMAIL_FROM}>`,
      to: user.email,
      bcc: process.env.ANTIC_EMAIL, // Blind carbon copy to ANTIC
      subject: `Confirmation de votre signalement #${report.caseId}`,
      html: `
        <h1>Confirmation de Signalement</h1>
        <p>Bonjour ${user.name},</p>
        <p>Nous avons bien reçu votre signalement et l'avons enregistré sous le numéro de dossier <strong>${report.caseId}</strong>.</p>
        <p><strong>Titre:</strong> ${report.title}</p>
        <p><strong>Description:</strong> ${report.description}</p>
        <p>Nous vous tiendrons informé de l'avancement de votre dossier.</p>
        <p>Cordialement,<br>L'équipe de modération</p>
      `,
      attachments: report.attachments.map((filePath) => ({
        path: filePath,
      })),
    };

    await transporter.sendMail(mailOptions);
    console.log(`Emails for case ${report.caseId} sent successfully.`);
  } catch (error) {
    console.error(`Error sending email for case ${report.caseId}:`, error);
  }
};

// --- Helper function to send SMS ---
const sendSmsNotification = async (user, message) => {
  if (!user.phoneNumber || !process.env.TWILIO_PHONE_NUMBER) {
    console.log(
      `Cannot send SMS to user ${user._id}, no phone number or Twilio config.`
    );
    return;
  }
  try {
    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: user.phoneNumber,  
    });
    console.log(`SMS sent successfully to user ${user._id}.`);
  } catch (error) {
    console.error(`Error sending SMS to user ${user._id}:`, error);
  }
};

// Create a new report
exports.createReport = async (req, res) => {
  try {
    const { title, description, sourceURL } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const caseId = `SIG-${Date.now()}`;
    const attachments = req.files ? req.files.map((file) => file.path) : [];

    const report = new Report({
      caseId,
      title,
      description,
      sourceURL,
      attachments,
      user: req.user._id,
      status: "Nouveau",
      history: [
        {
          status: "Nouveau",
          date: new Date(),
          comments: "Signalement créé par l'utilisateur.",
        },
      ],
    });

    const savedReport = await report.save();
    sendReportEmails(savedReport, user);
    res.status(201).json(savedReport);
  } catch (err) {
    console.error("Error creating report:", err);
    res
      .status(500)
      .json({ message: "Error creating report", error: err.message });
  }
};

// Get a single report by its Case ID
exports.getReportByCaseId = async (req, res) => {
  try {
    const report = await Report.findOne({ caseId: req.params.caseId }).populate(
      "user",
      "name email"
    );
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.status(200).json(report);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching report", error: err.message });
  }
};

// Update a report's status
exports.updateReportStatus = async (req, res) => {
  try {
    const { status, comments } = req.body;
    const report = await Report.findOne({ caseId: req.params.caseId });

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    report.status = status;
    report.history.push({
      status,
      comments,
      date: new Date(),
      updatedBy: req.user._id,
    });

    const updatedReport = await report.save();
    const reportOwner = await User.findById(report.user);
    if (reportOwner) {
      sendSmsNotification(
        reportOwner,
        `Mise à jour de votre signalement #${report.caseId}: Le statut est maintenant "${status}".`
      );
    }

    res.status(200).json(updatedReport);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating report status", error: err.message });
  }
};

// Update a report with AI analysis
exports.updateReportWithAiAnalysis = async (req, res) => {
  try {
    const { category, priority, summary } = req.body;
    const report = await Report.findOne({ caseId: req.params.caseId });

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    report.aiAnalysis = {
      category,
      priority,
      summary,
      analyzedAt: new Date(),
    };

    const updatedReport = await report.save();
    res.status(200).json(updatedReport);
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Error updating report with AI analysis",
        error: err.message,
      });
  }
};

// Get all reports (existing function, slightly improved)
exports.getReports = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const query = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { status: { $regex: search, $options: "i" } },
            { caseId: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const reports = await Report.find(query)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Report.countDocuments(query);

    res.status(200).json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      reports,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching reports", error: err });
  }
};

// Legacy functions, to be deprecated
exports.updateReport = async (req, res) => {
  try {
    const updatedReport = await Report.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedReport);
  } catch (err) {
    res.status(500).json({ message: "Error updating report", error: err });
  }
};

exports.deleteReport = async (req, res) => {
  try {
    await Report.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Report deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting report", error: err });
  }
};
