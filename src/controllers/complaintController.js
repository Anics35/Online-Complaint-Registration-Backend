const Complaint = require("../models/complaintSchema");
const ComplaintAction = require("../models/action"); // ✅ Import ComplaintAction

// Submit a new complaint
const submitComplaint = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    const attachments = req.files?.map((file) => ({
      url: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
    })) || [];

    const complaint = new Complaint({
      title,
      description,
      category,
      submittedBy: req.user._id,
      attachments,
    });

    await complaint.save();
    res.status(201).send("Complaint submitted successfully");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
};

// Get complaints (student = own, staff = all)
const getComplaints = async (req, res) => {
  try {
    const filter =
      req.user.role === "student" ? { submittedBy: req.user._id } : {};

    const complaints = await Complaint.find(filter).populate(
      "submittedBy",
      "firstName rollNumber role"
    );

    res.status(200).send(complaints);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
};

// Update complaint status and log action
const updateComplaintStatus = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { status, note, meeting } = req.body;

    if (req.user.role === "student")
      throw new Error("Unauthorized: Only Panel/Admin can update status");

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) throw new Error("Complaint not found");

    complaint.status = status;
    await complaint.save();

    // Prepare action object
    const actionData = {
      complaintId: complaint._id,
      status,
      actionTakenBy: req.user._id,
      remarks: `Status changed to '${status}' by ${req.user.role}`,
      note,
    };

    // Include meeting only if provided and scheduled
    if (meeting && meeting.scheduled) {
      actionData.meeting = {
        scheduled: true,
        date: meeting.date,
        note: meeting.note || "",
      };
    }

    await ComplaintAction.create(actionData);

    res.status(200).send("Complaint status updated and action logged");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
};


module.exports = {
  submitComplaint,
  getComplaints,
  updateComplaintStatus,
};
